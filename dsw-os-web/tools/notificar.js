#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════
 *  D.SOFTWORKS — NOTIFICACIONES POR CORREO  (H14)
 *  Envía el marcador del equipo a los correos de Daniel y César.
 *
 *  Uso:
 *    node dsw-os-web/tools/notificar.js              → abre el correo con el reporte precargado
 *    node dsw-os-web/tools/notificar.js smtp         → envía por Gmail SMTP (requiere app password en creds.json)
 *    node dsw-os-web/tools/notificar.js alerta       → envía alerta de inactividad
 *
 *  CONFIGURACIÓN SMTP (opcional, para envío automático):
 *    1. Ve a https://myaccount.google.com/security → "Contraseñas de aplicaciones"
 *    2. Genera una app password para "Mail" en "Otro (DSoftworks)"
 *    3. Ponla en dsw-os-web/tools/creds.json:
 *       { "gmailAppPassword": "xxxx xxxx xxxx xxxx" }
 * ═══════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'app', 'data');

function load(file, fallback) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8')); }
  catch (e) { return fallback; }
}

const puntos = load('puntos.json', null);
if (!puntos || !puntos.equipo) {
  console.log('  ⚠ No hay datos de puntos. Abre la app y marca tareas primero.');
  process.exit(0);
}

const eq = puntos.equipo;
const meta = puntos.metaSemanal || 50;
const hoy = new Date().toISOString().slice(0, 10);
const semana = (function () {
  var d = new Date();
  var day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
})();

function buildReporte() {
  var lines = [];
  lines.push('D.SOFTWORKS — MARCADOR DEL EQUIPO — ' + hoy);
  lines.push('');
  ['daniel', 'cesar'].forEach(function (k) {
    var p = eq[k];
    lines.push(p.nombre + ': ' + p.puntos + ' pts · ' + p.tareasHechas + ' tareas · racha ' + p.racha);
    var actSemana = p.historial.filter(function (h) { return (h.fecha || '').slice(0, 10) >= semana; });
    lines.push('  Esta semana: ' + actSemana.length + ' tareas · ' + actSemana.reduce(function (s, h) { return s + h.puntos; }, 0) + ' pts (meta: ' + meta + ')');
    lines.push('  Última actividad: ' + (p.ultimaActividad || 'nunca'));
    lines.push('');
  });
  var winner = eq.daniel.puntos >= eq.cesar.puntos ? 'Daniel' : 'César';
  lines.push('Líder: ' + winner);
  lines.push('');
  lines.push('Reglas: Ventas=10pts · Marketing=5pts · Sistema=3pts · Personal=1pt');
  lines.push('Meta semanal: ' + meta + ' pts por persona');
  return lines.join('\n');
}

function buildAlerta() {
  var lines = [];
  lines.push('D.SOFTWORKS — ALERTA DE INACTIVIDAD — ' + hoy);
  lines.push('');
  var hayAlerta = false;
  ['daniel', 'cesar'].forEach(function (k) {
    var p = eq[k];
    var dias = p.ultimaActividad ? Math.floor((new Date(hoy) - new Date(p.ultimaActividad.slice(0, 10))) / 86400000) : 99;
    if (dias >= 3) {
      hayAlerta = true;
      lines.push('⚠ ' + p.nombre + ' lleva ' + días + ' días sin actividad.');
      lines.push('  Última: ' + (p.ultimaActividad || 'nunca'));
      lines.push('  Tareas hechas: ' + p.tareasHechas + ' · Puntos: ' + p.puntos);
      lines.push('');
    }
  });
  if (!hayAlerta) {
    lines.push('✅ Ambos están activos. Sin alertas.');
  }
  return lines.join('\n');
}

function abrirMailto(body, subject) {
  var to = eq.daniel.email + ',' + eq.cesar.email;
  var mailto = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  console.log('\n  📧 Abriendo cliente de correo con el reporte precargado...');
  console.log('  Para: ' + to);
  console.log('  Asunto: ' + subject);
  console.log('');
  var cmd = process.platform === 'win32' ? 'start "" "' + mailto + '"' : 'open "' + mailto + '"';
  exec(cmd, function (err) {
    if (err) console.log('  No pude abrir el cliente de correo automáticamente.');
    console.log('  Copia este enlace en tu navegador:');
    console.log('  ' + mailto.slice(0, 120) + '...');
  });
}

function enviarSMTP(body, subject) {
  var creds = {};
  try { creds = JSON.parse(fs.readFileSync(path.join(__dirname, 'creds.json'), 'utf8')); } catch (e) {}
  if (!creds.gmailAppPassword) {
    console.log('\n  ⚠ No hay app password de Gmail en creds.json.');
    console.log('  Sigue las instrucciones al inicio de este archivo.');
    console.log('  Mientras tanto, se abrirá el cliente de correo con el reporte precargado.\n');
    abrirMailto(body, subject);
    return;
  }
  // Envío vía Gmail SMTP usando Node puro (sin dependencias)
  const tls = require('tls');
  const user = eq.daniel.email;
  const pass = creds.gmailAppPassword.replace(/\s/g, '');
  var recipients = [eq.daniel.email, eq.cesar.email];
  var ok = 0, fail = 0;

  function enviarPara(email, cb) {
    var sock = tls.connect(465, 'smtp.gmail.com', function () {
      var buf = '';
      var step = 0;
      var data = '';
      sock.on('data', function (chunk) {
        buf += chunk.toString();
        if (buf.indexOf('\r\n') === -1) return;
        var lines = buf.split('\r\n');
        var code = parseInt(lines[0].slice(0, 3));
        buf = '';
        if (code >= 400) { sock.destroy(); cb(new Error('SMTP ' + code)); return; }
        if (step === 0) { sock.write('EHLO dsoftworks\r\n'); step = 1; }
        else if (step === 1) { sock.write('AUTH LOGIN\r\n'); step = 2; }
        else if (step === 2) { sock.write(Buffer.from(user).toString('base64') + '\r\n'); step = 3; }
        else if (step === 3) { sock.write(Buffer.from(pass).toString('base64') + '\r\n'); step = 4; }
        else if (step === 4) { sock.write('MAIL FROM:<' + user + '>\r\n'); step = 5; }
        else if (step === 5) { sock.write('RCPT TO:<' + email + '>\r\n'); step = 6; }
        else if (step === 6) { sock.write('DATA\r\n'); step = 7; }
        else if (step === 7) {
          var msg = 'From: D.Softworks <' + user + '>\r\nTo: ' + email + '\r\nSubject: ' + subject + '\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n' + body + '\r\n.\r\n';
          sock.write(msg);
          step = 8;
        }
        else if (step === 8) { sock.write('QUIT\r\n'); sock.end(); cb(null); }
      });
      sock.on('error', function (e) { cb(e); });
    });
    sock.on('error', function (e) { cb(e); });
  }

  console.log('\n  📧 Enviando por Gmail SMTP...');
  var pending = recipients.length;
  recipients.forEach(function (email) {
    enviarPara(email, function (err) {
      if (err) { fail++; console.log('  ✗ ' + email + ': ' + err.message); }
      else { ok++; console.log('  ✓ ' + email); }
      pending--;
      if (pending === 0) {
        console.log('\n  Listo: ' + ok + ' enviados, ' + fail + ' fallidos.\n');
      }
    });
  });
}

var cmd = process.argv[2] || '';
var body, subject;

if (cmd === 'alerta') {
  body = buildAlerta();
  subject = 'D.Softworks — Alerta de inactividad ' + hoy;
} else {
  body = buildReporte();
  subject = 'D.Softworks — Marcador del equipo ' + hoy;
}

console.log('\n════════════════════════════════════════════');
console.log('  D.SOFTWORKS — NOTIFICACIÓN POR CORREO');
console.log('════════════════════════════════════════════');
console.log('');
console.log(body);
console.log('');

if (cmd === 'smtp' || cmd === 'alerta') {
  enviarSMTP(body, subject);
} else {
  abrirMailto(body, subject);
}
