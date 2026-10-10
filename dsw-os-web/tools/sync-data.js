#!/usr/bin/env node
// DSoftworks OS — puente cerebro ↔ nube (sin dependencias, Node 18+ con fetch global).
//
// Uso (desde la raíz del repo):
//   node dsw-os-web/tools/sync-data.js push               // sube TODAS las colecciones (local gana empates)
//   node dsw-os-web/tools/sync-data.js pull               // baja TODAS las colecciones a los JSON locales
//   node dsw-os-web/tools/sync-data.js push tareas prospectos   // solo esas colecciones
//   node dsw-os-web/tools/sync-data.js pull mensajes
//
// Credenciales (primer nivel en tools/creds.json, ignorado por git; o variables de entorno):
//   { "SUPABASE_URL": "https://xxxx.supabase.co", "SUPABASE_KEY": "<service_role key>" }
//   o bien SUPABASE_URL + SUPABASE_SERVICE_KEY en el entorno.
// La key service_role (Settings → API → service_role) ignora RLS y es la del cerebro.

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..'); // raíz del repo (donde vive app/)
const CREDS_FILE = path.join(__dirname, 'creds.json');
const COLLECTIONS = [
  { key: 'tareas',       arr: 'tareas',        file: 'app/tareas.json' },
  { key: 'prospectos',   arr: 'prospectos',    file: 'app/data/prospectos.json' },
  { key: 'mensajes',     arr: 'mensajes',      file: 'app/data/mensajes.json' },
  { key: 'clientes',     arr: 'clientes',      file: 'app/data/clientes.json' },
  { key: 'cotizaciones', arr: 'cotizaciones',  file: 'app/data/cotizaciones.json' },
  { key: 'finanzas',     arr: 'movimientos',   file: 'app/data/finanzas.json' },
  { key: 'contenido',    arr: 'publicaciones', file: 'app/data/contenido.json' },
  { key: 'agenda',       arr: 'reuniones',     file: 'app/data/agenda.json' },
  { key: 'bitacora',     arr: 'eventos',       file: 'app/data/bitacora.json' },
  { key: 'reportes',     arr: 'reportes',      file: 'app/data/reportes.json' },
  { key: 'radar',        arr: 'oportunidades', file: 'app/data/radar.json' }
];

function loadCreds() {
  if (fs.existsSync(CREDS_FILE)) {
    try { return JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8')); } catch (e) { /* sigue */ }
  }
  return {
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_SERVICE_KEY || ''
  };
}

function tsVal(r) {
  const v = r && typeof r.actualizado === 'string' ? r.actualizado.replace(' ', 'T') : '';
  const t = v ? Date.parse(v) : 0;
  return isNaN(t) ? 0 : t;
}

function mergeArr(serverArr, clientArr) {
  const map = {};
  let n = 0;
  const keyFn = r => {
    if (r && r.id !== undefined && r.id !== null) return String(r.id);
    return '__ni' + (n++);
  };
  (serverArr || []).forEach(r => { if (r) map[keyFn(r)] = JSON.parse(JSON.stringify(r)); });
  (clientArr || []).forEach(r => {
    if (!r) return;
    const k = keyFn(r);
    const cur = map[k];
    if (cur === undefined) { map[k] = JSON.parse(JSON.stringify(r)); return; }
    if (tsVal(r) >= tsVal(cur)) map[k] = JSON.parse(JSON.stringify(r));
  });
  return Object.keys(map).map(k => map[k]);
}

function mergeBucket(server, client, arr) {
  const serverArr = server && Array.isArray(server[arr]) ? server[arr] : [];
  const clientArr = client && Array.isArray(client[arr]) ? client[arr] : [];
  const out = {};
  if (client) Object.keys(client).forEach(k => { if (k !== arr) out[k] = client[k]; });
  if (server) Object.keys(server).forEach(k => { if (k !== arr && out[k] === undefined) out[k] = server[k]; });
  out[arr] = mergeArr(serverArr, clientArr);
  out.actualizado = (client && client.actualizado) || stamp();
  return out;
}

function stamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

async function req(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300)}`);
  return body;
}

const COLS = {
  proxy: url => `${url}/rest/v1/buckets?select=name,data`,
  one: (url, name) => `${url}/rest/v1/buckets?name=eq.${encodeURIComponent(name)}&select=data`,
  put: url => `${url}/rest/v1/buckets?on_conflict=name`
};

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  if (action !== 'push' && action !== 'pull') {
    console.error('Uso: node dsw-os-web/tools/sync-data.js push|pull [colecciones...]');
    process.exit(1);
  }
  const wanted = args.slice(1);
  const cols = COLLECTIONS.filter(c => !wanted.length || wanted.includes(c.key));
  if (!cols.length) { console.error('Colección no reconocida. Válidas: ' + COLLECTIONS.map(c => c.key).join(', ')); process.exit(1); }

  const creds = loadCreds();
  if (!creds.SUPABASE_URL || !creds.SUPABASE_KEY) {
    console.error('Faltan credenciales. Crea tools/creds.json o usa SUPABASE_URL + SUPABASE_SERVICE_KEY.');
    process.exit(1);
  }
  const u = creds.SUPABASE_URL.replace(/\/$/, '');
  const headers = {
    'apikey': creds.SUPABASE_KEY,
    'Authorization': 'Bearer ' + creds.SUPABASE_KEY,
    'Content-Type': 'application/json'
  };

  let cloud = {};
  try { cloud = await req(COLS.proxy(u), { headers }); }
  catch (e) { console.error('No pude leer la nube: ' + e.message); process.exit(1); }
  const cloudMap = {};
  (cloud || []).forEach(d => { if (d && d.name) cloudMap[d.name] = d.data; });

  let ok = true;
  for (const c of cols) {
    const localPath = path.join(REPO_ROOT, c.file);
    let local = null;
    try { local = JSON.parse(fs.readFileSync(localPath, 'utf8')); }
    catch (e) { local = null; }

    const server = cloudMap[c.key] || null;
    let result = server;

    if (action === 'push') {
      if (!local) { console.log(`  ⚠ ${c.key}: sin archivo local (${c.file}) — omitido`); continue; }
      result = mergeBucket(server, local, c.arr);
    } else { // pull
      if (!server) { console.log(`  ⚠ ${c.key}: no existe en la nube — omitido`); continue; }
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, JSON.stringify(server, null, 2) + '\n', 'utf8');
    }

    try {
      await req(COLS.put(u), {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify([{ name: c.key, data: result, updated_at: new Date().toISOString() }])
      });
      const n = (result[c.arr] || []).length;
      console.log(`  ✓ ${c.key}: ${action === 'push' ? 'subido' : 'bajado'} (${n} registros)`);
    } catch (e) {
      ok = false;
      console.error(`  ✗ ${c.key}: ` + e.message);
    }
  }
  console.log(action === 'push' ? 'Push terminado.' : 'Pull terminado.');
  process.exit(ok ? 0 : 1);
}

main();