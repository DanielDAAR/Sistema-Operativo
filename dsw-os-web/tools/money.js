#!/usr/bin/env node
/**
 * MOTOR DE DINERO — dsw-os-web/tools/money.js
 *
 * Calcula donde esta la plata, detecta plata en riesgo, genera cotizaciones
 * y mensajes de cobranza. Lee app/data/*.json, escribe en cotizaciones.json
 * y finanzas.json. Todo en MXN.
 *
 *   node money.js estado              -> donde esta el dinero, ahora
 *   node money.js riesgo              -> plata que se esta enfriando
 *   node money.js cotizar <id> <paquete>   -> crea cotizacion (ver --help)
 *   node money.js cobrar <cotId> <anticipo|saldo>
 *   node money.js recordatorio        -> mensajes de cobranza listos
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', '..', 'app', 'data');
const leer = (n) => {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, n), 'utf8')); }
  catch (e) { console.error(`  ✗ No pude leer ${n} (¿falta el archivo o el JSON está roto?): ${e.message}`); process.exit(1); }
};
const escribir = (n, d) =>
  fs.writeFileSync(path.join(DATA, n), JSON.stringify(d, null, 2) + '\n');

const hoy = () => new Date().toISOString().slice(0, 10);
const ahora = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
const mxn = (n) => '$' + Number(n || 0).toLocaleString('es-MX');
const dias = (f) => Math.floor((Date.now() - new Date(f + 'T00:00:00')) / 86400000);

// ---------------------------------------------------------------------------
// PAQUETES — precios autoritativos de 01-Empresa/Precios.md y Servicios.md
// ---------------------------------------------------------------------------
const PAQUETES = {
  landing:    { nombre: 'Landing Page',              precio: 1200, dias: 5,
                incluye: ['1 pagina enfocada en conversion', 'Boton de WhatsApp', 'Formulario de contacto', 'Diseno movil', 'Hosting + SSL 1 ano', '2 rondas de cambios'] },
  web:        { nombre: 'Pagina Web Basica',         precio: 1500, dias: 7,
                incluye: ['1 pagina responsive', 'Inicio/Servicios/Galeria/Contacto', 'WhatsApp + mapa', 'Hosting + SSL 1 ano', 'Dominio 1 ano', '2 rondas de cambios'] },
  catalogo:   { nombre: 'Catalogo Digital',          precio: 800,  dias: 4,
                incluye: ['Hasta 10 productos', 'Diseno + PDF alta resolucion', 'Version web opcional', '1 ronda de cambios'] },
  redes:      { nombre: 'Configuracion de Redes',    precio: 600,  dias: 2,
                incluye: ['Perfil optimizado', 'Bio + portada', '3 publicaciones base', 'Capacitacion basica'] },
  presencia:  { nombre: 'Paquete Presencia Digital',  precio: 2000, dias: 7,
                incluye: ['Pagina web basica', 'Facebook + Instagram', '3 publicaciones', 'WhatsApp integrado'] },
 emprendedor:     { nombre: 'Paquete Emprendedor',       precio: 2800, dias: 10,
                incluye: ['Pagina web completa', 'Catalogo 10 productos', 'Redes optimizadas', '5 publicaciones', 'Mantenimiento 1 mes'] },
  profesional:{ nombre: 'Paquete Profesional',       precio: 4500, dias: 12,
                incluye: ['Web + catalogo', 'Redes optimizadas', '10 publicaciones', 'Mantenimiento 1 mes'] },
  mantenimiento:{ nombre: 'Mantenimiento Mensual',    precio: 300,  dias: 30,
                incluye: ['Actualizaciones', 'Soporte por WhatsApp', 'Backups'] },
  sistema:    { nombre: 'Sistema a Medida',           precio: 8000, dias: 21,
                incluye: ['Definicion de alcance', 'Desarrollo a medida', 'Panel de control', 'Capacitacion', '30 dias de soporte'] },
};

// ---------------------------------------------------------------------------
// ESTADO — donde esta la plata
// ---------------------------------------------------------------------------
function estado() {
  const p = leer('prospectos.json').prospectos;
  const c = leer('cotizaciones.json').cotizaciones;
  const cl = leer('clientes.json').clientes;
  const f = leer('finanzas.json');

  const porEstado = {};
  p.forEach(x => {
    porEstado[x.estado] = porEstado[x.estado] || { n: 0, monto: 0 };
    porEstado[x.estado].n++;
    porEstado[x.estado].monto += Number(x.monto || 0);
  });

  const cobranza = c.reduce((a, x) => a + Number(x.saldo || 0), 0);
  const anticipos = f.movimientos
    .filter(m => m.tipo === 'anticipo')
    .reduce((a, m) => a + Number(m.monto), 0);
  const cobrado = f.movimientos.reduce((a, m) => a + Number(m.monto), 0);

  console.log('\n  DONDE ESTA TU PLATA  —  ' + hoy() + '\n');
  console.log('  PIPELINE');
  Object.entries(porEstado)
    .sort((a, b) => b[1].monto - a[1].monto)
    .forEach(([k, v]) => {
      const bar = '#'.repeat(Math.round(v.monto / 800));
      console.log('    ' + k.padEnd(16) + String(v.n).padStart(3) + '  ' +
                  mxn(v.monto).padStart(10) + '  ' + bar);
    });

  console.log('\n  COTIZACIONES');
  if (!c.length) console.log('    (ninguna — por eso no hay ingresos)');
  c.forEach(x => {
    const vencido = x.validaHasta && hoy() > x.validaHasta;
    console.log('    ' + x.id + '  ' + x.cliente.padEnd(24) + mxn(x.total).padStart(9) +
                '  anticipo ' + mxn(x.anticipoPagado).padStart(8) +
                '  saldo ' + mxn(x.saldo).padStart(9) +
                (vencido ? '  [VENCIDA]' : '') +
                (x.estado === 'Cobrada' ? '  [Cobrada]' : ''));
  });

  console.log('\n  CAJA');
  console.log('    Recibido total       ' + mxn(cobrado).padStart(10));
  console.log('    De anticipos         ' + mxn(anticipos).padStart(10));
  console.log('    Por cobrar (saldos)' + mxn(cobranza).padStart(10));
  console.log('    Clientes activos     ' + String(cl.length).padStart(10));
  console.log('    Ingreso recurrente   ' + mxn(cl.filter(x => x.mantenimiento).length * 300).padStart(10));
  console.log('\n  Meta mensual: ' + mxn(f.metaMes || 10000) + '\n');
}

// ---------------------------------------------------------------------------
// RIESGO — plata que se esta enfriando
// ---------------------------------------------------------------------------
function riesgo() {
  const p = leer('prospectos.json').prospectos;
  const filas = [];

  p.forEach(x => {
    const d = dias(x.fecha);
    if (x.estado === 'Contactado' && d >= 3) {
      filas.push({ id: x.id, nombre: x.nombre, monto: x.monto, dias: d,
                   accion: 'Seguimiento #2 obligatorio' });
    }
    if (x.estado === 'Respondió' && d >= 5) {
      filas.push({ id: x.id, nombre: x.nombre, monto: x.monto, dias: d,
                   accion: 'Ya dijo que si — cotizar HOY' });
    }
    if (x.estado === 'Sin respuesta' && d >= 7) {
      filas.push({ id: x.id, nombre: x.nombre, monto: x.monto, dias: d,
                   accion: 'Cierre elegante o descartar' });
    }
    if (x.estado === 'Nuevo') {
      filas.push({ id: x.id, nombre: x.nombre, monto: x.monto, dias: d,
                   accion: 'NUNCA contactado — es lo mas urgente' });
    }
  });

  filas.sort((a, b) => (b.monto || 0) - (a.monto || 0));

  if (!filas.length) {
    console.log('\n  Sin riesgo. Todo el pipeline esta moviendose.\n');
    return;
  }

  const total = filas.reduce((a, f) => a + Number(f.monto || 0), 0);
  console.log('\n  PLATA EN RIESGO  —  ' + mxn(total) + ' en ' + filas.length + ' prospectos\n');
  filas.forEach(f => {
    console.log('    ' + f.id.padEnd(7) + f.nombre.padEnd(26) + mxn(f.monto).padStart(9) +
                '  ' + String(f.dias) + 'd');
    console.log('           ' + f.accion);
  });
  console.log('\n  Top 3 es lo unico que haces hoy. Empieza por el mas monto.\n');
}

// ---------------------------------------------------------------------------
// COTIZAR — genera la cotizacion en el sistema
// ---------------------------------------------------------------------------
function cotizar(prospectoId, clavePaquete, extra) {
  const d = leer('prospectos.json');
  const p = d.prospectos.find(x => x.id === prospectoId);
  if (!p) { console.error('  No existe prospecto ' + prospectoId); process.exit(1); }

  const pack = PAQUETES[clavePaquete];
  if (!pack) {
    console.error('\n  Paquetes disponibles:\n  ' + Object.keys(PAQUETES).join(', ') + '\n');
    process.exit(1);
  }

  const c = leer('cotizaciones.json');
  const sigNum = c.cotizaciones.reduce((m, x) => {
    const n = parseInt(String(x.id || '').replace(/^cot-0*/, ''), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  const extraMonto = Number(extra || 0);
  const total = pack.precio + extraMonto;
  const anticipo = Math.round(total * 0.5);

  const cot = {
    id: 'cot-' + String(sigNum + 1).padStart(3, '0'),
    fecha: hoy(),
    cliente: p.negocio || p.nombre,
    contacto: p.nombre,
    telefono: p.telefono,
    prospectoId: p.id,
    servicio: pack.nombre,
    lineas: [{ descripcion: pack.nombre, precio: pack.precio }]
             .concat(extraMonto ? [{ descripcion: 'Alcance adicional', precio: extraMonto }] : []),
    total,
    anticipo,
    anticipoPagado: 0,
    saldo: total - anticipo,
    saldoPagado: 0,
    estado: 'Emitida',
    diasEntrega: pack.dias,
    incluye: pack.incluye,
    noIncluye: [
      'Hosting despues del primer ano',
      'Dominio a partir del segundo ano',
      'Cambios fuera del alcance (se cobran aparte)',
      'Contenido adicional al pactado',
    ],
    validaHasta: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
  };

  c.cotizaciones.push(cot);
  c.actualizado = ahora();
  escribir('cotizaciones.json', c);

  p.estado = 'Cotizado';
  p.actualizado = ahora();
  d.actualizado = ahora();
  escribir('prospectos.json', d);

  console.log('\n  COTIZACION ' + cot.id + ' CREADA\n');
  console.log('  Cliente      ' + cot.cliente);
  console.log('  Servicio     ' + cot.servicio + ' + ' + mxn(extraMonto) + ' extra');
  console.log('  TOTAL        ' + mxn(total));
  console.log('  Anticipo 50% ' + mxn(anticipo) + '   <- se cobra ANTES de empezar');
  console.log('  Saldo 50%    ' + mxn(cot.saldo) + '   <- se cobra contra entrega');
  console.log('  Valida hasta ' + cot.validaHasta);
  console.log('\n  Estado del prospecto cambiado a: Cotizado\n');
  console.log('  Mensaje para enviar:\n');
  console.log('    Hola ' + p.nombre + ', te paso la cotizacion de ' + pack.nombre +
              '.\n');
  console.log('    Total: ' + mxn(total) + ' MXN');
  console.log('    Anticipo: ' + mxn(anticipo) + ' (50%) para empezar');
  console.log('    Saldo: ' + mxn(cot.saldo) + ' contra entrega');
  console.log('    Entrega: ' + pack.dias + ' dias habiles');
  console.log('\n    Si te parece bien, hago la transferencia y arranco.\n');
}

// ---------------------------------------------------------------------------
// COBRAR — registra pagos
// ---------------------------------------------------------------------------
function cobrar(cotId, tipo) {
  const c = leer('cotizaciones.json');
  const cot = c.cotizaciones.find(x => x.id === cotId);
  if (!cot) { console.error('  No existe ' + cotId); process.exit(1); }

  const monto = tipo === 'saldo' ? cot.saldo : cot.anticipo;
  if (monto <= 0) { console.log('\n  Ya esta pagado.\n'); return; }

  if (tipo === 'saldo') {
    if (!cot.anticipoPagado || cot.anticipoPagado <= 0) { console.error('  ✗ Cobra primero el anticipo de ' + cotId + ' (regla 50/50).'); process.exit(1); }
    cot.saldoPagado = (cot.saldoPagado || 0) + monto; cot.saldo = 0; cot.estado = 'Cobrada';
  }
  else { cot.anticipoPagado = cot.anticipo; cot.saldo = cot.total - cot.anticipo; cot.estado = 'En curso'; }

  c.actualizado = ahora();
  escribir('cotizaciones.json', c);

  const f = leer('finanzas.json');
  const sigM = f.movimientos.reduce((m, x) => {
    const n = parseInt(String(x.id || '').replace(/^m-0*/, ''), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  f.movimientos.push({
    id: 'm-' + String(sigM + 1).padStart(3, '0'),
    fecha: hoy(), tipo: tipo === 'saldo' ? 'saldo' : 'anticipo',
    monto, cotizacion: cot.id, cliente: cot.cliente, nota: '',
  });
  f.actualizado = ahora();
  escribir('finanzas.json', f);

  console.log('\n  COBRADO ' + mxn(monto) + '  —  ' + cot.cliente);
  console.log('  ' + tipo + ' de ' + cot.id + ' registrado en finanzas.json\n');
}

// ---------------------------------------------------------------------------
// RECORDATORIO — mensajes de cobranza
// ---------------------------------------------------------------------------
function recordatorio() {
  const c = leer('cotizaciones.json').cotizaciones;
  const act = c.filter(x => x.estado !== 'Cobrada');
  if (!act.length) {
    console.log('\n  No hay nada que cobrar. Sin cotizaciones abiertas.\n');
    return;
  }

  console.log('\n  A COBRAR HOY\n');
  act.forEach(x => {
    console.log('  --- ' + x.id + '  ' + x.cliente + '  ---');
    if (!x.anticipoPagado) {
      console.log('\n  [Anticipo sin cobrar: ' + mxn(x.anticipo) + ']');
      console.log('    Hola ' + x.contacto + ', buen dia. Para arrancar con el proyecto');
      console.log('    (' + x.servicio + ') necesito el anticipo de ' + mxn(x.anticipo) + '.');
      console.log('    En cuanto me confirmes la transferencia arranco el mismo dia.');
      console.log('    Si quieres lo reviso con calma, me dices y lo ajustamos.\n');
    } else {
      console.log('\n  [Saldo sin cobrar: ' + mxn(x.saldo) + ']');
      console.log('    Hola ' + x.contacto + ', tu proyecto ya esta listo. Para poder');
      console.log('    liberarte el acceso final y las credenciales, faltan ' + mxn(x.saldo) + '.');
      console.log('    En cuanto me confirmes te lo entrego todo.\n');
    }
  });
}

// ---------------------------------------------------------------------------
const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'estado': estado(); break;
  case 'riesgo': riesgo(); break;
  case 'cotizar': cotizar(args[0], args[1], args[2]); break;
  case 'cobrar': cobrar(args[0], args[1]); break;
  case 'recordatorio': recordatorio(); break;
  default:
    console.log(`
  MOTOR DE DINERO — D.Softworks

  node money.js estado                      donde esta tu plata
  node money.js riesgo                      plata que se esta enfriando
  node money.js cotizar <id> <paquete> [extra]
  node money.js cobrar <cotId> anticipo|saldo
  node money.js recordatorio                mensajes de cobranza listos

  Paquetes: ${Object.keys(PAQUETES).join(', ')}
`);
}