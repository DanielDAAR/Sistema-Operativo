#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════
 *  D.SOFTWORKS — MOTOR DE PROSPECCIÓN AUTOMÁTICA  (H16)
 *  Busca negocios en Sección Amarilla, extrae contacto, detecta señales
 *  de venta y genera el mensaje personalizado para cada uno.
 *
 *  Uso:
 *    node dsw-os-web/tools/prospectos.js buscar [categoria] [ciudad]
 *    node dsw-os-web/tools/prospectos.js cargar
 *    node dsw-os-web/tools/prospectos.js mensajes
 *
 *  Categorías: dentista, barberia, gimnasio, restaurante, estetica, salon
 *  Ciudades: zapopan, guadalajara, tlaquepaque, tlajomulco
 * ═══════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'app', 'data');

function load(file, fallback) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8')); }
  catch (e) { return fallback; }
}
function save(file, obj) {
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(obj, null, 2), 'utf8');
}

const CATEGORIAS = {
  'dentista': { rubro: 'Clínicas Dentales', monto: 2500, servicio: 'web + sistema de citas + portal de pacientes' },
  'barberia': { rubro: 'Barberías', monto: 1200, servicio: 'landing + agendamiento por WhatsApp' },
  'gimnasio': { rubro: 'Gimnasios', monto: 1500, servicio: 'web + planes + botón de WhatsApp' },
  'restaurante': { rubro: 'Restaurantes', monto: 0, servicio: 'sistema de reservaciones + menú digital' },
  'estetica': { rubro: 'Estéticas', monto: 1200, servicio: 'landing + portafolio + WhatsApp' },
  'salon': { rubro: 'Salones de Belleza', monto: 1200, servicio: 'landing + servicios + WhatsApp' }
};

const CIUDADES = {
  'zapopan': 'Zapopan',
  'guadalajara': 'Guadalajara',
  'tlaquepaque': 'Tlaquepaque',
  'tlajomulco': 'Tlajomulco'
};

function fetchURL(url) {
  return new Promise(function (resolve) {
    var mods = [https, http];
    var done = false;
    for (var i = 0; i < mods.length && !done; i++) {
      try {
        mods[i].get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'es-MX,es;q=0.9' } }, function (res) {
          var data = '';
          res.on('data', function (c) { data += c; });
          res.on('end', function () { done = true; resolve(data); });
        }).on('error', function () {});
      } catch (e) {}
    }
    setTimeout(function () { if (!done) resolve(''); }, 15000);
  });
}

function decodeHTML(str) {
  return str.replace(/&#(\d+);/g, function (_, code) { return String.fromCharCode(parseInt(code, 10)); })
    .replace(/&([a-z]+);/g, function (_, name) {
      var map = { 'nbsp': ' ', 'amp': '&', 'quot': '"', 'apos': "'", 'lt': '<', 'gt': '>' };
      return map[name] || '';
    });
}
function extraerNegocios(html) {
  var negocios = [];
  // Primero decodificar entidades HTML, luego quitar etiquetas
  var text = decodeHTML(html)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Estrategia: dividir por "La mejor opción para tus necesidades..." como ancla
  // ANTES del ancla = nombre (+ categoría). DESPUÉS = dirección + teléfono.
  var ancla = 'La mejor opción para tus necesidades...';
  var idx = 0;
  while ((idx = text.indexOf(ancla, idx)) !== -1) {
    // Buscar el teléfono después del ancla
    var despues = text.substring(idx + ancla.length, idx + ancla.length + 300);
    var phoneMatch = despues.match(/\(?\s*33\)?[\s\-]?\d{3,4}[\s\-]?\d{4}/);
    if (!phoneMatch) { idx += ancla.length; continue; }
    var telefono = phoneMatch[0].replace(/[^\d\s\-]/g, '').trim();
    // Dirección: entre el ancla y el teléfono
    var dirChunk = despues.substring(0, phoneMatch.index);
    var dirMatch = dirChunk.match(/(?:AVE|AV|CLL|CALLE|BLVD|BLV|PRL|CIRCUITO|PERIFERICO|CARR|CLZ|DOCTORES|MARIANO|ACUEDUCTO|FEDERALISTAS|PROL|BLV|CARRETERA)[^]*$/i);
    var direccion = dirMatch ? dirMatch[0].trim() : '';
    // Web entre ancla y teléfono
    var webMatch = dirChunk.match(/[\w\-]+\.(com|mx|net)[\w\/\.\-]*/i);
    var web = webMatch ? webMatch[0] : '';
    // Nombre: retroceder desde el ancla hasta el teléfono anterior (o el inicio)
    var prevPhoneEnd = 0;
    var prevMatch = text.substring(0, idx).match(/\(?\s*33\)?[\s\-]?\d{3,4}[\s\-]?\d{4}(?![\d\-])/g);
    if (prevMatch) {
      var lastPhone = prevMatch[prevMatch.length - 1];
      prevPhoneEnd = text.lastIndexOf(lastPhone, idx) + lastPhone.length;
    } else {
      // No hay teléfono previo: usar "filtros Aplicar" como límite del header
      var filtroIdx = text.lastIndexOf('filtros Aplicar', idx);
      if (filtroIdx >= 0) prevPhoneEnd = filtroIdx + 'filtros Aplicar'.length;
    }
    var antes = text.substring(prevPhoneEnd, idx).trim();
    // Limpiar: quitar basura de navegación
    antes = antes.replace(/(Ruta|Ver Más|Llamar|Encuéntralo|Menú|Mi negocio|Registra tu empresa|Anúnciate con nosotros|Blog|Filtros|Inicio|Ordenar por|Reiniciar|Distancia|Z-A|Contenido|Sitio web|Vídeos|Whatsapp|Limpiar|Aplicar)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    // Separar NOMBRE (mayúsculas) de CATEGORÍA (Title Case)
    var words = antes.split(' ');
    var nombreWords = [];
    var catWords = [];
    var enCategoria = false;
    for (var w = 0; w < words.length; w++) {
      var word = words[w];
      if (!word) continue;
      // ¿Es Title Case? (primera letra mayúscula, al menos una minúscula)
      var esTitle = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(word);
      // ¿Es mayúsculas?
      var esMayus = /^[A-ZÁÉÍÓÚÑ0-9\.\-&]+$/.test(word) && word.length > 1;
      if (!enCategoria && esTitle && nombreWords.length > 0) {
        enCategoria = true;
      }
      if (enCategoria) catWords.push(word);
      else nombreWords.push(word);
    }
    var nombre = nombreWords.join(' ').trim();
    negocios.push({ nombre: nombre, direccion: direccion, telefono: telefono, web: web });
    idx += ancla.length;
  }
  return negocios;
}

function limpiarTelefono(t) {
  if (!t) return '';
  var n = t.replace(/[^\d]/g, '');
  if (n.length === 10) return '+52 ' + n.slice(0, 2) + ' ' + n.slice(2, 6) + ' ' + n.slice(6);
  if (n.length === 12 && n.startsWith('52')) return '+52 ' + n.slice(2, 4) + ' ' + n.slice(4, 8) + ' ' + n.slice(8);
  return t;
}

function generarMensaje(negocio, categoria) {
  var cat = CATEGORIAS[categoria];
  var nombre = negocio.nombre.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  var primerNombre = nombre.split(' ')[0];
  var sinWeb = !negocio.web;
  var msg = 'Hola, buenas tardes. Soy Daniel de D.Softworks, una empresa de desarrollo de software aquí en Guadalajara.\n\n';
  var zona = 'Zapopan';
  if (negocio.direccion) {
    var parts = negocio.direccion.split(',');
    if (parts.length > 1 && parts[1].trim()) zona = parts[1].trim();
  }
  msg += 'Vi ' + (categoria === 'dentista' ? 'su clínica' : categoria === 'barberia' ? 'su barbería' : categoria === 'gimnasio' ? 'su gimnasio' : categoria === 'restaurante' ? 'su restaurante' : 'su negocio') + ' ' + nombre + ' en ' + zona + ' y me pareció muy bien.\n\n';
  if (sinWeb) {
    msg += 'Noto que no tienen página web propia. ¿Les gustaría tener una donde sus clientes puedan ver servicios, precios y contactarlos por WhatsApp directamente?\n\n';
  } else {
    msg += 'Vi que ya tienen presencia en línea. ¿Les gustaría mejorarla con un sistema donde sus clientes puedan agendar y contactarlos por WhatsApp directamente?\n\n';
  }
  msg += 'Les puedo ayudar con ' + cat.servicio + '. Es rápido y profesional.\n\n';
  msg += '¿Les interesa conocer más? Son 10 minutos de plática.\n\n';
  msg += 'No es cosa de empresas grandes: tu competencia de barrio ya lo tiene, y cuesta menos de lo que crees.';
  return msg;
}

async function buscar(categoria, ciudad) {
  var cat = CATEGORIAS[categoria];
  var ciu = CIUDADES[ciudad];
  if (!cat || !ciu) {
    console.log('  Categoría o ciudad no válida.');
    console.log('  Categorías: ' + Object.keys(CATEGORIAS).join(', '));
    console.log('  Ciudades: ' + Object.keys(CIUDADES).join(', '));
    return [];
  }
  var url = 'https://www.seccionamarilla.com.mx/resultados/' + categoria + '/' + ciudad + '/1';
  console.log('\n  🔍 Buscando ' + cat.rubro + ' en ' + ciu + '...');
  console.log('  ' + url);
  var html = await fetchURL(url);
  if (!html) { console.log('  ✗ No pude acceder a Sección Amarilla.'); return []; }
  var negocios = extraerNegocios(html);
  console.log('  ✓ ' + negocios.length + ' negocios encontrados con teléfono');
  return negocios;
}

function cargar() {
  var prospectos = load('prospectos.json', { prospectos: [] }).prospectos || [];
  var existentes = {};
  prospectos.forEach(function (p) { existentes[p.telefono] = true; });
  var nuevos = [];
  // Cargar desde el archivo de caché si existe
  var cache = {};
  try { cache = JSON.parse(fs.readFileSync(path.join(DATA, 'prospectos-cache.json'), 'utf8')); } catch (e) {}
  Object.keys(cache).forEach(function (key) {
    // La clave es "categoria-ciudad", extraer la categoría
    var cat = '';
    Object.keys(CATEGORIAS).forEach(function (c) {
      if (key.startsWith(c + '-')) cat = c;
    });
    if (!cat) return;
    cache[key].forEach(function (n) {
      if (!existentes[n.telefono]) {
        nuevos.push({
          id: 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
          fecha: new Date().toISOString().slice(0, 10),
          monto: CATEGORIAS[cat].monto,
          notas: 'Encontrado en Sección Amarilla. Dirección: ' + (n.direccion || 'Sin dirección') + (n.web ? '. Web: ' + n.web : '. Sin sitio web'),
          estado: 'Nuevo',
          fuente: 'Sección Amarilla',
          nombre: n.nombre,
          negocio: n.nombre,
          telefono: limpiarTelefono(n.telefono),
          actualizado: new Date().toISOString().slice(0, 10),
          mensaje: generarMensaje(n, cat)
        });
        existentes[n.telefono] = true;
      }
    });
  });
  prospectos = nuevos.concat(prospectos);
  save('prospectos.json', { prospectos: prospectos, actualizado: new Date().toISOString() });
  console.log('\n  ✅ ' + nuevos.length + ' prospectos nuevos cargados en la app');
  console.log('  Total: ' + prospectos.length + ' prospectos');
}

function mensajes() {
  var prospectos = load('prospectos.json', { prospectos: [] }).prospectos || [];
  var nuevos = prospectos.filter(function (p) { return p.estado === 'Nuevo' && p.mensaje; });
  console.log('\n══════════════════════════════════════════════════════');
  console.log('  MENSAJES LISTOS PARA ENVIAR — ' + nuevos.length + ' prospectos');
  console.log('══════════════════════════════════════════════════════\n');
  nuevos.slice(0, 10).forEach(function (p, i) {
    console.log('  ' + (i + 1) + '. ' + p.nombre + ' · ' + (p.telefono || 'sin tel'));
    console.log('     ── MENSAJE ──');
    console.log('     ' + p.mensaje.split('\n').join('\n     '));
    console.log('     ── abrir: wa.me/' + (p.telefono || '').replace(/[^\d]/g, '').replace(/^52/, '') + ' ──\n');
  });
  if (nuevos.length > 10) console.log('  ... y ' + (nuevos.length - 10) + ' más. Corre: node dsw-os-web/tools/prospectos.js mensajes\n');
}

// ── MAIN ──
var cmd = process.argv[2] || '';
var arg1 = process.argv[3] || '';
var arg2 = process.argv[4] || '';

if (cmd === 'buscar') {
  buscar(arg1, arg2).then(function (negocios) {
    if (!negocios.length) return;
    // Guardar en caché
    var cache = {};
    try { cache = JSON.parse(fs.readFileSync(path.join(DATA, 'prospectos-cache.json'), 'utf8')); } catch (e) {}
    cache[arg1 + '-' + arg2] = negocios;
    fs.writeFileSync(path.join(DATA, 'prospectos-cache.json'), JSON.stringify(cache, null, 2), 'utf8');
    console.log('\n  📁 Guardado en prospectos-cache.json');
    console.log('  Para cargar en la app: node dsw-os-web/tools/prospectos.js cargar');
  });
} else if (cmd === 'cargar') {
  cargar();
} else if (cmd === 'mensajes') {
  mensajes();
} else {
  console.log('\n  D.SOFTWORKS — MOTOR DE PROSPECCIÓN AUTOMÁTICA');
  console.log('  ─────────────────────────────────────────────');
  console.log('  node dsw-os-web/tools/prospectos.js buscar [categoria] [ciudad]');
  console.log('  node dsw-os-web/tools/prospectos.js cargar');
  console.log('  node dsw-os-web/tools/prospectos.js mensajes');
  console.log('');
  console.log('  Categorías: dentista, barberia, gimnasio, restaurante, estetica, salon');
  console.log('  Ciudades: zapopan, guadalajara, tlaquepaque, tlajomulco\n');
}
