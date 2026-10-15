// DSoftworks OS — H17 · Netlify Function: crear acceso desde la web.
//
// POST /.netlify/functions/crear-usuario
//   Headers: Authorization: Bearer <JWT del usuario logueado>
//   Body:    { nombre, email, rol?, password? }
//
// Seguridad:
//   1. Solo acepta POST y exige el JWT de un usuario LOGUEADO (verificado
//      contra Supabase Auth con la anon key). Sin login válido → 401.
//      Por ahora TODO logueado puede crear (acceso total); la fase 2
//      limitará a una lista de admins.
//   2. La service_role NUNCA sale al navegador: vive en variables de entorno
//      de Netlify (Site settings → Environment variables):
//        SUPABASE_URL · SUPABASE_SERVICE_KEY · SUPABASE_ANON_KEY
//
// Responde { ok:true, id, email, password, nombre, rol }.
// La clave se devuelve UNA sola vez para que quien crea la comparta por WhatsApp.

const crypto = require('crypto');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const res = (code, obj) => ({
  statusCode: code,
  headers: CORS,
  body: JSON.stringify(obj)
});

function genPass(n = 12) {
  // Legible por teléfono: sin 0/O/1/l.
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#%';
  return Array.from(crypto.randomBytes(n)).map(x => abc[x % abc.length]).join('');
}

async function sj(url, opts) {
  const r = await fetch(url, opts);
  const t = await r.text();
  let b = null;
  try { b = t ? JSON.parse(t) : null; } catch (e) { b = t; }
  if (!r.ok) {
    const m = typeof b === 'string' ? b.slice(0, 300) : JSON.stringify(b).slice(0, 300);
    const err = new Error(`Supabase ${r.status}: ${m}`);
    err.status = r.status;
    throw err;
  }
  return b;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return res(405, { ok: false, error: 'Solo POST.' });

  const URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const SERVICE = process.env.SUPABASE_SERVICE_KEY || '';
  const ANON = process.env.SUPABASE_ANON_KEY || '';
  if (!URL || !SERVICE || !ANON) {
    return res(500, {
      ok: false,
      error: 'Faltan variables de entorno en Netlify: SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY. (Site settings → Environment variables → agregar → redeploy.)'
    });
  }

  // ── 1. Verificar que quien pide SÍ está logueado ──
  const auth = (event.headers.authorization || event.headers.Authorization || '').trim();
  const jwt = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  if (!jwt) return res(401, { ok: false, error: 'Sin sesión. Entra a la app primero.' });
  try {
    await sj(`${URL}/auth/v1/user`, {
      headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + jwt }
    });
  } catch (e) {
    return res(401, { ok: false, error: 'Sesión inválida o vencida. Sal y entra de nuevo.' });
  }
  // FASE 2 (pendiente): verificar que el JWT sea de un admin antes de seguir.

  // ── 2. Validar datos del nuevo miembro ──
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return res(400, { ok: false, error: 'Body JSON inválido.' }); }
  const nombre = String(body.nombre || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const rol = String(body.rol || 'Colaborador').trim() || 'Colaborador';
  let password = String(body.password || '').trim();
  if (!nombre) return res(400, { ok: false, error: 'Falta el nombre.' });
  if (!email || !email.includes('@')) return res(400, { ok: false, error: 'Correo inválido.' });
  if (!password) password = genPass();
  if (password.length < 8) return res(400, { ok: false, error: 'La clave debe tener mínimo 8 caracteres.' });

  const adminH = {
    'apikey': SERVICE,
    'Authorization': 'Bearer ' + SERVICE,
    'Content-Type': 'application/json'
  };

  // ── 3. ¿Ya existe? (no duplicar) ──
  try {
    for (let page = 1; page <= 5; page++) {
      const u = await sj(`${URL}/auth/v1/admin/users?page=${page}&per_page=100`, { headers: adminH });
      const list = (u && u.users) ? u.users : (Array.isArray(u) ? u : []);
      if (list.some(x => String(x.email || '').toLowerCase() === email)) {
        return res(409, { ok: false, error: `${email} YA tiene acceso. Si olvidó su clave, usa el reseteo desde Supabase o la herramienta del cerebro.` });
      }
      if (!list.length) break;
    }
  } catch (e) {
    return res(500, { ok: false, error: 'No pude revisar usuarios existentes: ' + e.message });
  }

  // ── 4. Crear (confirmado de inmediato, sin correo de invitación) ──
  try {
    const created = await sj(`${URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: adminH,
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { nombre, rol } })
    });
    const id = (created && (created.id || (created.user && created.user.id))) || null;
    return res(200, { ok: true, id, email, password, nombre, rol });
  } catch (e) {
    return res(500, { ok: false, error: 'No pude crear el acceso: ' + e.message });
  }
};
