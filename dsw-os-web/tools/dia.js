#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════
 *  D.SOFTWORKS — MOTOR DE OPERACIÓN DIARIA  (H11)
 *  Un comando = todo lo que hay que hacer hoy, en orden, con los
 *  mensajes listos para copiar y pegar.
 *
 *  Uso:
 *    node dsw-os-web/tools/dia.js             → plan del día completo
 *    node dsw-os-web/tools/dia.js seguimiento → cola de seguimiento con mensajes completos
 *    node dsw-os-web/tools/dia.js sheets      → exporta TSV a dsw-os-export/ (listos para Google Sheets)
 *    node dsw-os-web/tools/dia.js radar       → radar de oportunidades (solo ALTA)
 * ═══════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');      // raíz del repo
const DATA = path.join(ROOT, 'app', 'data');
const APPDIR = path.join(ROOT, 'app');

const PROB = {
  'Nuevo': .10, 'Contactado': .20, 'Respondió': .40, 'Reunión': .60,
  'Cotizado': .80, 'Cerrado': 1, 'No registrado': .05, 'Sin respuesta': .05
};

const hoy = new Date();
const HOY_STR = hoy.toISOString().slice(0, 10);
const MES_STR = HOY_STR.slice(0, 7);

function load(file, fallback, dir) {
  try { return JSON.parse(fs.readFileSync(path.join(dir || DATA, file), 'utf8')); }
  catch (e) { return fallback; }
}
function fmt(n) { return '$' + Number(n || 0).toLocaleString('es-MX'); }
function diasDesde(fechaStr) {
  if (!fechaStr) return 999;
  const d = new Date(String(fechaStr).slice(0, 10));
  if (isNaN(d)) return 999;
  return Math.max(0, Math.floor((hoy - d) / 86400000));
}
function telLimpio(t) { return String(t || '').replace(/[^\d+]/g, ''); }
function waLink(t) {
  const n = telLimpio(t).replace('+', '');
  return n ? 'wa.me/' + n : '(sin teléfono)';
}

// ── Cargar todo ────────────────────────────────────────────────────────────────
const prospectos = (load('prospectos.json', {}).prospectos) || [];
const tareas     = (load('tareas.json', { tareas: [] }, APPDIR).tareas) || [];
const finanzas   = load('finanzas.json', { metaMes: 10000, movimientos: [] });
const cotizaciones = load('cotizaciones.json', { cotizaciones: [] }).cotizaciones || [];
const contenido  = load('contenido.json', { publicaciones: [] }).publicaciones || [];
const radar      = (load('radar.json', {}).oportunidades) || [];
const agenda     = load('agenda.json', { reuniones: [] }).reuniones || [];
const clientes   = load('clientes.json', { clientes: [] }).clientes || [];

const metaMes = Number(finanzas.metaMes || 10000);
const ingresado = (finanzas.movimientos || [])
  .filter(m => m.tipo === 'ingreso')
  .reduce((s, m) => s + Number(m.monto || 0), 0);

// ── 1. DINERO ──────────────────────────────────────────────────────────────────
function resumenDinero() {
  const porEstado = {};
  let bruto = 0, ponderado = 0;
  for (const p of prospectos) {
    const e = p.estado || 'No registrado';
    porEstado[e] = porEstado[e] || { n: 0, monto: 0 };
    porEstado[e].n++;
    porEstado[e].monto += Number(p.monto || 0);
    bruto += Number(p.monto || 0);
    ponderado += Number(p.monto || 0) * (PROB[e] || 0);
  }
  const lineas = [];
  lineas.push('  PIPELINE (por etapa)');
  const orden = ['Cerrado', 'Cotizado', 'Reunión', 'Respondió', 'Contactado', 'Nuevo', 'Sin respuesta', 'No registrado'];
  for (const e of orden) {
    if (!porEstado[e]) continue;
    const { n, monto } = porEstado[e];
    const bar = '█'.repeat(Math.min(24, Math.round(monto / Math.max(1, bruto) * 24)));
    lineas.push(`    ${e.padEnd(14)} ${String(n).padStart(2)}  ${fmt(monto).padStart(9)}  ${bar}`);
  }
  lineas.push(`    Bruto: ${fmt(bruto)}  ·  Ponderado: ${fmt(Math.round(ponderado))}`);
  lineas.push(`  META DEL MES: ${fmt(metaMes)}  ·  Ingresado: ${fmt(ingresado)} (${Math.round(ingresado / metaMes * 100)}%)  ·  Faltan: ${fmt(metaMes - ingresado)}`);
  lineas.push(`  COTIZACIONES: ${cotizaciones.length}  ·  CLIENTES ACTIVOS: ${clientes.length}`);
  if (cotizaciones.length === 0) {
    lineas.push('  ⚠  CERO cotizaciones — el embudo se muere aquí. Cada "Contactado" frío es una cotización que no nació.');
  }
  return lineas.join('\n');
}

// ── 2. TAREAS ──────────────────────────────────────────────────────────────────
function tareasDelDia() {
  const pend = tareas.filter(t => !t.hecha);
  const vencidas = pend.filter(t => t.vence && t.vence < HOY_STR)
    .sort((a, b) => a.vence < b.vence ? -1 : 1);
  const hoy = pend.filter(t => t.vence === HOY_STR);
  const prox = pend.filter(t => t.vence && t.vence > HOY_STR)
    .sort((a, b) => a.vence < b.vence ? -1 : 1).slice(0, 5);
  const lineas = [];
  lineas.push(`  Vencidas: ${vencidas.length}  ·  Para hoy: ${hoy.length}  ·  Próximas: ${prox.length}`);
  const todas = [...vencidas, ...hoy];
  if (todas.length === 0) { lineas.push('    (ninguna pendiente para hoy — raro. Revisa la app.)'); }
  let i = 1;
  for (const t of todas) {
    const tag = t.vence < HOY_STR ? `VENCIÓ ${t.vence}` : 'HOY';
    lineas.push(`    ${i}. [${t.categoria || '—'}] ${t.titulo}`);
    lineas.push(`       └ ${tag} — ${(t.detalle || '').slice(0, 150)}`);
    i++;
  }
  if (prox.length) {
    lineas.push('  Próximas:');
    for (const t of prox) lineas.push(`    · ${t.vence} — ${t.titulo}`);
  }
  return lineas.join('\n');
}

// ── 3. SEGUIMIENTO ─────────────────────────────────────────────────────────────
function colaSeguimiento(completo) {
  const activos = prospectos
    .filter(p => p.estado && !['Cerrado', 'Descartado'].includes(p.estado))
    .map(p => ({ ...p, dias: diasDesde(p.actualizado || p.fecha) }))
    .sort((a, b) => b.dias - a.dias);
  const lineas = [];
  lineas.push('  (más días sin mover = más arriba. Rojo mental: ≥7 días = dinero enfriándose)');
  let i = 1;
  for (const p of activos.slice(0, completo ? 99 : 8)) {
    const fuego = p.dias >= 7 ? '🔥' : (p.dias >= 3 ? '◐' : '○');
    lineas.push(`  ${fuego} #${i} — ${p.nombre} · ${p.negocio || ''}`);
    lineas.push(`     ${p.dias}d sin mover · ${p.estado} · ${fmt(p.monto)} · ${p.telefono || 'sin tel'}`);
    if (completo && p.mensaje) {
      lineas.push('     ── MENSAJE LISTO (copiar y pegar) ──');
      for (const l of String(p.mensaje).split('\n')) lineas.push('     ' + l);
      lineas.push(`     ── abrir chat: ${waLink(p.telefono)} ──`);
    }
    i++;
  }
  return lineas.join('\n');
}

// ── 4. CONTENIDO ───────────────────────────────────────────────────────────────
function contenidoHoy() {
  const pend = contenido
    .filter(c => c.estado !== 'publicado')
    .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
  const lineas = [];
  if (!pend.length) { lineas.push('  (todo publicado — nada pendiente)'); return lineas.join('\n'); }
  for (const c of pend.slice(0, 5)) {
    const d = diasDesde(c.fecha);
    const tag = c.fecha <= HOY_STR ? '¡HOY/ATRASADO!' : `en ${d}d`;
    lineas.push(`  · ${c.fecha} ${c.titulo} [${c.canal || '—'}] — ${tag}`);
    if (c.archivo) lineas.push(`    └ ${c.archivo}${c.imagen ? ' · imagen: ' + c.imagen : ''}`);
  }
  return lineas.join('\n');
}

// ── 5. RADAR ───────────────────────────────────────────────────────────────────
function radarAlta() {
  const altas = radar.filter(o => ['ALTA', 'CRÍTICA'].includes(o.prioridad) && o.estado !== 'descartada');
  if (!altas.length) return '  (sin oportunidades ALTA — revisa 07-Marketing/RADAR-OPORTUNIDADES.md)';
  return altas.map(o =>
    `  🎯 ${o.id} [${o.prioridad}] — ${o.titulo} (${o.precio || 'precio en radar'})\n     └ ${o.accion}`
  ).join('\n');
}

// ── 6. REUNIONES ───────────────────────────────────────────────────────────────
function reunionesHoy() {
  const prox = agenda
    .filter(r => r.estado === 'Próximamente')
    .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''))
    .slice(0, 3);
  if (!prox.length) return '  (ninguna reunión próxima registrada)';
  return prox.map(r => `  · ${r.fecha} ${r.hora || ''} — ${r.titulo || r.prospecto || 'Reunión'}`).join('\n');
}

// ── 7. ORDEN EXACTA ────────────────────────────────────────────────────────────
function ordenExacta() {
  const pasos = [];
  const tareasPend = tareas
    .filter(t => !t.hecha && t.vence && t.vence <= HOY_STR)
    .sort((a, b) => a.vence < b.vence ? -1 : 1);
  let n = 1;
  for (const t of tareasPend.slice(0, 6)) {
    pasos.push(t.titulo + '  →  detalle en la app (sección Tareas)');
    n++;
  }
  const frio = prospectos
    .filter(p => p.estado && !['Cerrado', 'Descartado'].includes(p.estado))
    .map(p => ({ ...p, dias: diasDesde(p.actualizado || p.fecha) }))
    .filter(p => p.dias >= 3 && p.telefono)
    .sort((a, b) => b.dias - a.dias);
  if (frio.length) {
    pasos.push(`Seguimiento: manda el mensaje a ${frio[0].nombre} (${waLink(frio[0].telefono)}) — lleva ${frio[0].dias} días frío`);
    n++;
  }
  const hoyContenido = contenido.find(c => c.estado !== 'publicado' && c.fecha <= HOY_STR);
  if (hoyContenido) {
    pasos.push(`Publicar HOY: "${hoyContenido.titulo}" → ${hoyContenido.archivo || 'ver en Contenido'}${hoyContenido.imagen ? ' (imagen: ' + hoyContenido.imagen + ')' : ''}`);
    n++;
  }
  pasos.push('Al terminar: escribe "revisa la app" en 🧠 Mensajes para que el cerebro recalcule el plan de mañana');
  return pasos.map((p, i) => `  ${i + 1}. ${p}`).join('\n');
}

// ── SHEETS: exporta TSV ────────────────────────────────────────────────────────
function tsvEsc(v) {
  return String(v == null ? '' : v)
    .replace(/\t/g, ' ')
    .replace(/\n/g, ' ⏎ ')
    .replace(/\r/g, '');
}
function escribirTSV(nombre, headers, filas) {
  const out = [headers.join('\t')]
    .concat(filas.map(f => f.map(tsvEsc).join('\t')))
    .join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'dsw-os-export', nombre + '.tsv'), out, 'utf8');
}
function exportarSheets() {
  const dir = path.join(ROOT, 'dsw-os-export');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  escribirTSV('prospectos',
    ['id', 'nombre', 'negocio', 'telefono', 'fuente', 'estado', 'monto_MXN', 'fecha', 'ultimo_movimiento', 'dias_sin_mover', 'notas', 'mensaje'],
    prospectos.map(p => [p.id, p.nombre, p.negocio, p.telefono, p.fuente, p.estado, p.monto, p.fecha, p.actualizado, diasDesde(p.actualizado || p.fecha), p.notas, p.mensaje]));

  escribirTSV('tareas',
    ['id', 'titulo', 'categoria', 'vence', 'hecha', 'origen', 'detalle'],
    tareas.map(t => [t.id, t.titulo, t.categoria, t.vence, t.hecha ? 'SI' : 'NO', t.origen, t.detalle]));

  escribirTSV('cotizaciones',
    ['id', 'prospecto', 'monto', 'estado', 'fecha', 'notas'],
    cotizaciones.map(c => [c.id, c.prospecto || c.nombre, c.monto, c.estado, c.fecha, c.notas]));

  escribirTSV('clientes',
    ['id', 'nombre', 'negocio', 'telefono', 'estado', 'anticipo', 'saldo', 'notas'],
    clientes.map(c => [c.id, c.nombre, c.negocio, c.telefono, c.estado, c.anticipo, c.saldo, c.notas]));

  escribirTSV('finanzas',
    ['tipo', 'fecha', 'monto', 'concepto', 'notas'],
    (finanzas.movimientos || []).map(m => [m.tipo, m.fecha, m.monto, m.concepto || m.titulo, m.notas]));

  escribirTSV('contenido',
    ['id', 'fecha', 'titulo', 'canal', 'estado', 'horaFB', 'horaIG', 'archivo', 'notas'],
    contenido.map(c => [c.id, c.fecha, c.titulo, c.canal, c.estado, c.horaFB, c.horaIG, c.archivo, c.notas]));

  escribirTSV('radar',
    ['id', 'titulo', 'prioridad', 'precio', 'estado', 'fecha', 'resumen', 'accion', 'seConvierteEn'],
    radar.map(o => [o.id, o.titulo, o.prioridad, o.precio, o.estado, o.fecha, o.resumen, o.accion, o.seConvierteEn]));

  escribirTSV('agenda',
    ['fecha', 'hora', 'titulo', 'estado', 'resultado'],
    agenda.map(r => [r.fecha, r.hora, r.titulo || r.prospecto, r.estado, r.resultado]));

  const README = [
    'D.SOFTWORKS — EXPORTACIÓN PARA GOOGLE SHEETS',
    'Generado: ' + new Date().toISOString(),
    '',
    'CÓMO IMPORTAR (2 clics por archivo):',
    '  1. Abre sheets.google.com → hoja nueva (en blanco).',
    '  2. Archivo → Importar → Subir → elige el .tsv → "Insertar nueva hoja".',
    '  (O copia todo el .tsv con Notepad y pégalo directo en la hoja: Sheets lo separa en columnas.)',
    '',
    'ARCHIVOS:',
    '  prospectos.tsv    — pipeline completo con días sin mover (filtra "dias_sin_mover" >= 7 = frío)',
    '  tareas.tsv        — qué hacer y cuándo vence',
    '  cotizaciones.tsv  — dinero en el aire',
    '  clientes.tsv      — proyectos en curso (anticipo / saldo)',
    '  finanzas.tsv      — movimientos de caja',
    '  contenido.tsv     — calendario editorial',
    '  radar.tsv         — oportunidades O-XX',
    '  agenda.tsv        — reuniones',
    '',
    'REGRESAS LOS DATOS A LA APP: la app sigue siendo la fuente de datos; estos TSV son',
    'solo para ver y filtrar en Google Sheets. Edítalos ahí, pero los cambios se hacen en la app.'
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(dir, 'LEEME.txt'), README, 'utf8');

  const archivos = fs.readdirSync(dir).filter(f => f.endsWith('.tsv'));
  console.log(`\n  ✅ ${archivos.length} archivos TSV en dsw-os-export/`);
  for (const a of archivos) console.log('     · ' + a);
  console.log('  📄 LEEME.txt con las instrucciones de importación.');
  console.log('\n  SIGUIENTE PASO: sheets.google.com → nueva hoja → Archivo → Importar → Subir → prospectos.tsv');
  console.log('  Filtra la columna "dias_sin_mover" >= 7 → esos son los que tocan hoy.\n');
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
const cmd = process.argv[2] || '';

if (cmd === 'sheets') {
  console.log('\n════════════════════════════════════════════');
  console.log('  D.SOFTWORKS — EXPORTAR A GOOGLE SHEETS');
  console.log('════════════════════════════════════════════');
  exportarSheets();
  process.exit(0);
}

if (cmd === 'seguimiento') {
  console.log('\n════════════════════════════════════════════');
  console.log(`  COLA DE SEGUIMIENTO — ${HOY_STR}`);
  console.log('════════════════════════════════════════════\n');
  console.log(colaSeguimiento(true));
  console.log('\n  REGLA: ≥7 días frío → mensaje hoy. ≥14 días → mensaje de cierre elegante o Descartado.');
  console.log('  Después de mandar: actualiza "actualizado" en la app (o marca la tarea).\n');
  process.exit(0);
}

if (cmd === 'radar') {
  console.log('\n════════════════════════════════════════════');
  console.log('  RADAR — OPORTUNIDADES ALTA');
  console.log('════════════════════════════════════════════\n');
  console.log(radarAlta());
  console.log('\n  Detalle completo: 07-Marketing/RADAR-OPORTUNIDADES.md\n');
  process.exit(0);
}

// plan del día completo
console.log('\n══════════════════════════════════════════════════════');
console.log(`   D.SOFTWORKS — PLAN DEL DÍA — ${HOY_STR}`);
console.log('══════════════════════════════════════════════════════');
console.log('\n💰 DINERO\n');
console.log(resumenDinero());
console.log('\n🔥 TAREAS (vencidas + hoy)\n');
console.log(tareasDelDia());
console.log('\n📞 SEGUIMIENTO (los más fríos primero)\n');
console.log(colaSeguimiento(false));
console.log('\n📅 CONTENIDO PENDIENTE\n');
console.log(contenidoHoy());
console.log('\n🗓 REUNIONES\n');
console.log(reunionesHoy());
console.log('\n🎯 RADAR ALTA\n');
console.log(radarAlta());
console.log('\n✅ TU ORDEN EXACTA (copia y ejecuta)\n');
console.log(ordenExacta());
console.log('\n  Herramientas: node dsw-os-web/tools/dia.js seguimiento | sheets | radar');
console.log('  Al terminar: escribe "revisa la app" en 🧠 Mensajes.\n');
