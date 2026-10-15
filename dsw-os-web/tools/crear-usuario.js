#!/usr/bin/env node
// DSoftworks OS — H17 · Crear acceso para un miembro nuevo del equipo.
// Uso (desde la raíz del repo):
//   node dsw-os-web/tools/crear-usuario.js --nombre "María López" --email maria@ejemplo.com --rol "Ventas"
//   node dsw-os-web/tools/crear-usuario.js --nombre "María López" --email maria@ejemplo.com --rol "Ventas" --password "ClaveFuerte123"
//   node dsw-os-web/tools/crear-usuario.js --email maria@ejemplo.com --reset --password "NuevaClave123"
//   node dsw-os-web/tools/crear-usuario.js --help
//
// Qué hace:
//   1. Crea el usuario en Supabase Auth (Admin API, con service_role de tools/creds.json).
//      email_confirm=true para que entre de inmediato sin confirmar correo.
//   2. Lo agrega a app/data/puntos.json > equipo (puntos, para pestaña Equipo).
//   3. Imprime las credenciales + mensaje de WhatsApp listo para enviar.
// Después corre: node dsw-os-web/tools/sync-data.js push puntos
// Y la persona entra en: https://dsw-os.netlify.app

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '../..');
const CREDS_FILE = path.join(__dirname, 'creds.json');
const PUNTOS_FILE = path.join(REPO_ROOT, 'app/data/puntos.json');

function help() {
  console.log(`
DSoftworks OS — crear acceso (H17)

  node dsw-os-web/tools/crear-usuario.js --nombre "Nombre Apellido" --email correo@ejemplo.com --rol "Rol"
  node dsw-os-web/tools/crear-usuario.js --email correo@ejemplo.com --reset --password "NuevaClave"

Opciones:
  --nombre    Nombre completo (requerido para crear)
  --email     Correo del nuevo miembro (requerido, minúsculas)
  --rol       Rol visible en Equipo (default: Colaborador)
  --password  Clave a asignar. Si se omite, se genera una segura de 12 caracteres.
  --reset     Solo resetea la clave de un usuario que YA existe (requiere --email y --password o genera una).
  --sin-equipo  No tocar puntos.json (solo crea el login en Supabase).
  --help      Esta ayuda.

Ejemplos:
  node dsw-os-web/tools/crear-usuario.js --nombre "María López" --email maria@ejemplo.com --rol "Community Manager"
  node dsw-os-web/tools/crear-usuario.js --email maria@ejemplo.com --reset
`);
}

function args() {
  const a = process.argv.slice(2);
  const o = {};
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--help' || k === '-h') o.help = true;
    else if (k === '--reset') o.reset = true;
    else if (k === '--sin-equipo') o.sinEquipo = true;
    else if (k.startsWith('--')) {
      const key = k.slice(2);
      o[key] = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true;
    }
  }
  return o;
}

function loadCreds() {
  if (fs.existsSync(CREDS_FILE)) {
    try { return JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8')); } catch (e) { /* sigue */ }
  }
  return {
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_SERVICE_KEY || ''
  };
}

function genPass(n = 12) {
  // Legible: sin 0/O/1/l para dictar por teléfono sin error.
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#%';
  const b = crypto.randomBytes(n);
  return Array.from(b).map(x => abc[x % abc.length]).join('');
}

function slugNombre(nombre) {
  return (nombre || 'miembro').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30)
    + '-' + Date.now().toString(36).slice(-3);
}

function today() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function req(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  if (!res.ok) {
    const msg = typeof body === 'string' ? body.slice(0, 400) : JSON.stringify(body).slice(0, 400);
    const err = new Error(`${res.status} ${res.statusText}: ${msg}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function findUserByEmail(base, headers, email) {
  // Admin list (paginado simple, equipo chico).
  for (let page = 1; page <= 5; page++) {
    const u = await req(`${base}/auth/v1/admin/users?page=${page}&per_page=100`, { headers });
    const list = u && u.users ? u.users : (Array.isArray(u) ? u : []);
    const hit = list.find(x => (x.email || '').toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (!list.length) break;
  }
  return null;
}

async function main() {
  const o = args();
  if (o.help) { help(); process.exit(0); }
  const email = String(o.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    console.error('Correo inválido. Ejemplo: --email maria@ejemplo.com');
    process.exit(1);
  }
  const creds = loadCreds();
  if (!creds.SUPABASE_URL || !creds.SUPABASE_KEY) {
    console.error('Faltan credenciales. Crea tools/creds.json o usa SUPABASE_URL + SUPABASE_SERVICE_KEY.');
    process.exit(1);
  }
  const base = creds.SUPABASE_URL.replace(/\/$/, '');
  const headers = {
    'apikey': creds.SUPABASE_KEY,
    'Authorization': 'Bearer ' + creds.SUPABASE_KEY,
    'Content-Type': 'application/json'
  };

  let password = String(o.password || '').trim();
  if (o.reset && !password) password = genPass();
  if (!o.reset && !password) password = genPass();

  // ── RESET: solo cambia la clave ──
  if (o.reset) {
    const existing = await findUserByEmail(base, headers, email);
    if (!existing) { console.error(`No existe usuario con ${email} en Supabase Auth. Quita --reset para crearlo.`); process.exit(1); }
    await req(`${base}/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT', headers, body: JSON.stringify({ password, email_confirm: true })
    });
    console.log(`\n  ✓ Clave reseteada para ${email}\n`);
    console.log(`  Correo:    ${email}`);
    console.log(`  Clave nueva: ${password}`);
    console.log(`  Entra en:  https://dsw-os.netlify.app\n`);
    console.log('  Mensaje WhatsApp:\n');
    console.log(`  Hola, te reseteé tu acceso a D.Softworks OS.\n  Entra a https://dsw-os.netlify.app\n  Usuario: ${email}\n  Clave nueva: ${password}\n  Avísame cuando entres y la cambiamos.`);
    return;
  }

  // ── CREAR ──
  const nombre = String(o.nombre || '').trim();
  if (!nombre) { console.error('Falta --nombre. Ejemplo: --nombre "María López"'); process.exit(1); }
  const rol = String(o.rol || 'Colaborador').trim() || 'Colaborador';

  const ya = await findUserByEmail(base, headers, email);
  if (ya) {
    console.error(`\n  ✗ ${email} YA tiene acceso (id ${ya.id}).`);
    console.error(`  Si olvidó su clave: node dsw-os-web/tools/crear-usuario.js --email ${email} --reset`);
    console.error(`  Si solo falta en Equipo: agrégalo en la app > Equipo > Agregar trabajador.\n`);
    process.exit(1);
  }

  const created = await req(`${base}/auth/v1/admin/users`, {
    method: 'POST', headers,
    body: JSON.stringify({
      email, password, email_confirm: true,
      user_metadata: { nombre, rol }
    })
  });
  console.log(`\n  ✓ Acceso creado en Supabase Auth: ${email} (id ${(created && (created.id || (created.user && created.user.id))) || 'ok'})`);

  // ── EQUIPO (puntos.json local) ──
  if (!o['sin-equipo'] && fs.existsSync(PUNTOS_FILE)) {
    try {
      const pj = JSON.parse(fs.readFileSync(PUNTOS_FILE, 'utf8'));
      pj.equipo = pj.equipo || [];
      const existe = pj.equipo.some(e => (e.email || '').toLowerCase() === email);
      if (!existe) {
        pj.equipo.push({
          id: slugNombre(nombre), nombre, email, rol,
          puntos: 0, tareasHechas: 0, ultimaActividad: null,
          racha: 0, mejorRacha: 0, historial: [], logros: [], ventas: 0,
          fechaIngreso: today()
        });
        fs.writeFileSync(PUNTOS_FILE, JSON.stringify(pj, null, 2) + '\n', 'utf8');
        console.log('  ✓ Agregado a Equipo (puntos.json local). Falta subirlo:');
        console.log('    node dsw-os-web/tools/sync-data.js push puntos');
      } else {
        console.log('  • Ya estaba en Equipo (puntos.json). No se duplicó.');
      }
    } catch (e) {
      console.log('  ⚠ No pude actualizar puntos.json local: ' + e.message);
      console.log('    Agrégalo a mano en la app > Equipo > Agregar trabajador.');
    }
  }

  console.log('\n  ═══ CREDENCIALES (pásalas por WhatsApp, NO por aquí si hay más gente) ═══');
  console.log(`  URL:     https://dsw-os.netlify.app`);
  console.log(`  Usuario: ${email}`);
  console.log(`  Clave:   ${password}`);
  console.log(`  Nombre:  ${nombre} · Rol: ${rol}\n`);
  console.log('  Mensaje WhatsApp listo:\n');
  console.log(`  Hola ${nombre.split(' ')[0]}, ya tienes acceso a D.Softworks OS.`);
  console.log(`  Entra a https://dsw-os.netlify.app`);
  console.log(`  Usuario: ${email}`);
  console.log(`  Clave: ${password}`);
  console.log(`  Al entrar pulsa Sincronizar. Tu avance suma puntos en Equipo. ¡Bienvenido! 🎉\n`);
  console.log('  Siguiente paso del cerebro: node dsw-os-web/tools/sync-data.js push puntos');
  console.log('  La persona debe cambiar su clave en: Supabase → Authentication → Users → ... → Reset password');
  console.log('  (o pídele que te avise y usa --reset para ponérsela tú).\n');
}

main().catch(e => { console.error('\n  ✗ Error: ' + e.message); process.exit(1); });
