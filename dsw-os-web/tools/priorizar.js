#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════
 *  D.SOFTWORKS — MOTOR DE PRIORIZACIÓN DE PROSPECTOS  (H15)
 *  Puntúa cada prospecto 0-100 y te dice a quién contactar HOY.
 *
 *  Uso:
 *    node dsw-os-web/tools/priorizar.js          → ranking completo
 *    node dsw-os-web/tools/priorizar.js hoy      → solo los 5 que tocan hoy
 *    node dsw-os-web/tools/priorizar.js embudo   → conversión entre etapas
 *
 *  CÓMO SE PUNTÚA (100 pts):
 *    Etapa del embudo   0-30  (Cerrado=30, Cotizado=28, Reunión=24, Respondió=20, Contactado=15)
 *    Antigüedad         0-25  (14+ días=25, 7+=20, 3+=15, 1+=10, hoy=5)
 *    Valor estimado     0-20  ($4,000+=20, $2,000+=15, $1,000+=10, >0=5)
 *    Fuente             0-10  (Google=10, Doctoralia=8, Web=7, Instagram=6, Fresha=5)
 *    WhatsApp conf.     0-15  (sí=15, no=0)
 * ═══════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'app', 'data');

function load(file, fallback) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8')); }
  catch (e) { return fallback; }
}

const prospectos = (load('prospectos.json', {}).prospectos) || [];
const cotizaciones = (load('cotizaciones.json', { cotizaciones: [] }).cotizaciones) || [];

const hoy = new Date().toISOString().slice(0, 10);

function diasDesde(fechaStr) {
  if (!fechaStr) return 999;
  const d = new Date(String(fechaStr).slice(0, 10));
  if (isNaN(d)) return 999;
  return Math.max(0, Math.floor((new Date(hoy) - d) / 86400000));
}

const STAGE_SCORES = { 'Cerrado': 30, 'Cotizado': 28, 'Reunión': 24, 'Respondió': 20, 'Contactado': 15, 'Nuevo': 10, 'Sin respuesta': 8, 'No registrado': 5 };
const SOURCE_SCORES = { 'Google': 10, 'Doctoralia': 8, 'Web': 7, 'Instagram': 6, 'Fresha': 5, 'Sección Amarilla': 4 };

function scoreProspect(p) {
  var score = 0;
  var detalle = [];
  // Etapa (0-30)
  var st = STAGE_SCORES[p.estado] || 5;
  score += st;
  detalle.push('etapa:' + st);
  // Antigüedad (0-25)
  var dias = diasDesde(p.actualizado || p.fecha);
  var ag = dias >= 14 ? 25 : dias >= 7 ? 20 : dias >= 3 ? 15 : dias >= 1 ? 10 : 5;
  score += ag;
  detalle.push('antigüedad:' + ag);
  // Valor (0-20)
  var monto = Number(p.monto || 0);
  var vl = monto >= 4000 ? 20 : monto >= 2000 ? 15 : monto >= 1000 ? 10 : monto > 0 ? 5 : 0;
  score += vl;
  detalle.push('valor:' + vl);
  // Fuente (0-10)
  var fu = SOURCE_SCORES[p.fuente] || 5;
  score += fu;
  detalle.push('fuente:' + fu);
  // WhatsApp (0-15)
  var wa = (p.telefono && p.telefono.trim()) ? 15 : 0;
  score += wa;
  detalle.push('whatsapp:' + wa);
  return { score: score, detalle: detalle.join(' · '), dias: dias };
}

function fmt(n) { return '$' + Number(n || 0).toLocaleString('es-MX'); }

var ranked = prospectos
  .filter(p => p.estado && !['Cerrado', 'Descartado'].includes(p.estado))
  .map(p => ({ ...p, _s: scoreProspect(p) }))
  .sort((a, b) => b._s.score - a._s.score);

var cmd = process.argv[2] || '';

if (cmd === 'embudo') {
  console.log('\n════════════════════════════════════════════');
  console.log('  EMBUDO DE VENTAS — CONVERSIÓN');
  console.log('════════════════════════════════════════════\n');
  var stages = ['Nuevo', 'Contactado', 'Respondió', 'Reunión', 'Cotizado', 'Cerrado'];
  var counts = {};
  stages.forEach(s => counts[s] = 0);
  prospectos.forEach(p => { if (counts[p.estado] !== undefined) counts[p.estado]++; });
  var prev = 0;
  stages.forEach(s => {
    var n = counts[s];
    var conv = prev > 0 ? Math.round(n / prev * 100) : 100;
    var bar = '█'.repeat(Math.min(20, n));
    console.log('  ' + s.padEnd(14) + ' ' + String(n).padStart(2) + '  ' + bar + (prev > 0 ? '  (' + conv + '% de ' + prev + ')' : ''));
    prev = n;
  });
  console.log('\n  Cotizaciones enviadas: ' + cotizaciones.length);
  console.log('  Cierre (Cerrado): ' + counts['Cerrado']);
  console.log('');
  process.exit(0);
}

if (cmd === 'hoy') {
  console.log('\n════════════════════════════════════════════');
  console.log('  A QUIÉN CONTACTAR HOY — ' + hoy);
  console.log('════════════════════════════════════════════\n');
  var top = ranked.slice(0, 5);
  if (!top.length) { console.log('  (sin prospectos activos)'); process.exit(0); }
  top.forEach(function(p, i) {
    console.log('  ' + (i + 1) + '. [' + p._s.score + ' pts] ' + p.nombre + ' · ' + (p.negocio || ''));
    console.log('     ' + p.estado + ' · ' + p._s.dias + 'd sin mover · ' + fmt(p.monto) + ' · ' + (p.telefono || 'sin tel'));
    console.log('     → ' + p._s.detalle);
    console.log('');
  });
  console.log('  REGLA: los de mayor punje primero. Si tiene 14+ días y WhatsApp, es HOY.');
  console.log('');
  process.exit(0);
}

// ranking completo
console.log('\n══════════════════════════════════════════════════════');
console.log('  RANKING DE PROSPECTOS — ' + hoy);
console.log('══════════════════════════════════════════════════════\n');
console.log('  #   Pts  Prospecto                    Estado          Días  Monto');
console.log('  ──  ───  ────────────────────────────  ──────────────  ────  ────────');
ranked.forEach(function(p, i) {
  var num = String(i + 1).padStart(2);
  var pts = String(p._s.score).padStart(3);
  var nom = (p.nombre || '').slice(0, 28).padEnd(28);
  var est = (p.estado || '').padEnd(14);
  var dias = String(p._s.dias).padStart(4);
  var mon = fmt(p.monto).padStart(8);
  console.log('  ' + num + '  ' + pts + '  ' + nom + '  ' + est + '  ' + dias + '  ' + mon);
});
console.log('\n  Total prospectos activos: ' + ranked.length);
console.log('  Punje máximo: 100. Regla: etapa(30) + antigüedad(25) + valor(20) + fuente(10) + WhatsApp(15).');
console.log('  Variantes: node dsw-os-web/tools/priorizar.js hoy | embudo\n');
