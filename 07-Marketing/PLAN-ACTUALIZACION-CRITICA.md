# PLAN DE ACTUALIZACIÓN CRÍTICA — D.Softworks

**Creado:** 10 de octubre de 2026
**Qué es:** la lista de todo lo que está roto, vencido o dejado a la mitad — ordenado por cuánto dinero está en juego. Cada punto tiene evidencia de búsqueda web y una acción exacta.
**Regla:** se actualiza cada vez que el cerebro hace su escaneo de internet. Lo que no está aquí, no existe.

---

## 🔴 NIVEL 1 — DINERO BLOQUEADO (resolver esta semana)

### C1 · Cero cotizaciones = cero ingresos
**El problema:** 21 prospectos, $32,100 en pipeline, **0 cotizaciones**, $0 en caja. El embudo se muere entre "Contactado" y "Cotizado".
**Evidencia:** estado real de `app/data/cotizaciones.json` (vacío) + `money.js estado`.
**Acción exacta:**
1. `node dsw-os-web/tools/dia.js seguimiento` → los 8 prospectos más fríos (16-17 días)
2. Mandar mensaje #2 a cada uno con el ángulo de su rubro
3. El objetivo de cada mensaje NO es "que respondan" — es **"¿te mando la cotización?"**
4. Meta: 3 cotizaciones esta semana. Una cotización de $1,200 = 12% de la meta mensual.

### C2 · 14 prospectos "No registrado" inflan el pipeline
**El problema:** $16,700 del pipeline bruto son fantasmas (números sin WhatsApp confirmado).
**Acción exacta:** `node dsw-os-web/tools/dia.js` → Bloque 2. Buscar en Google Maps los 14, confirmar WhatsApp, marcar Nuevo o Descartado. Meta: bajar el pipeline a ~$16,700 reales.

### C3 · El post de GM Fire nunca se ha publicado
**El problema:** está escrito desde el 10-oct, nunca salió. Es el único contenido de portafolio que existe.
**Acción exacta:** abrir `07-Marketing/Publicaciones/Portafolio-01-GMFire.md`, copiar texto, publicar en FB (10:00) e IG (12:00) con la imagen `Captura de pantalla 2026-09-15 195023.png`. Marcar c-001 como publicado en la app.

---

## 🟠 NIVEL 2 — VENTAS QUE SE ENFRIAN (resolver en 2 días)

### C4 · 8 prospectos con 16-17 días de silencio
**El problema:** Tiny Smiles, Somos Red, Atelback, Vetro, Navajas de Hierro, Frisón, El ZarCortes, Barber Chuy — todos fríos.
**Evidencia:** `dia.js seguimiento` los muestra con 🔥.
**Acción exacta:** mensaje #2 a cada uno (textos en `prospecting/SEGUIMIENTOS-23SEP.md`). Si en 48h no responden → mensaje #3 (cierre elegante) → Descartado.

### C5 · O-12: nueva línea de servicio sin validar
**El problema:** los bloqueos de WhatsApp Business 2026 son noticia (10-oct-2026) y el 63% de empresas chilenas ya migraron a la API oficial — pero D.Softworks aún no ofrece el servicio.
**Evidencia:** Google News 10-oct-2026 "Bloqueos de WhatsApp Business en 2026" + El Ecosistema Startup 14-ago-2026.
**Acción exacta:**
1. Investigar BSP: 360dialog.com o Twilio.com — 30 min
2. Si es viable: agregar "Migración a WhatsApp API oficial — setup $2,500" a `01-Empresa/Servicios.md`
3. Primer pitch: La Matera y Alcalde (restaurantes que contactan masivo)

### C6 · El ángulo "no es para grandes" no está en los mensajes
**El problema:** El Economista (10-oct-2026) confirma que las pymes creen que la tecnología es "para empresas grandes" — pero los mensajes actuales no usan ese ángulo.
**Acción exacta:** agregar al final de cada mensaje: *"No es cosa de empresas grandes: tu competencia de barrio ya lo tiene, y cuesta menos de lo que crees."*

---

## 🟡 NIVEL 3 — SISTEMA DE EQUIPO (resolver esta semana)

### C7 · No hay forma de saber quién está trabajando
**El problema:** Daniel y César no tienen un sistema de puntos ni visibilidad de actividad.
**Solución construida:** pestaña **Equipo** en la app (local y nube) con:
- Puntos por tarea: Ventas=10 · Marketing=5 · Sistema=3 · Personal=1
- Indicador 🟢/🟡/🔴 de actividad
- Meta semanal: 50 pts por persona
- Reporte por correo a danielaldanarubioalejandro2005@gmail.com y a24110110@ceti.mx
**Acción exacta:** abrir la app → pestaña Equipo → marcar la primera tarea como hecha → ver el modal "¿Quién lo hizo?".

### C8 · Las notificaciones por correo no están configuradas
**El problema:** el reporte por correo existe pero requiere configuración.
**Acción exacta (elige una):**
- **Opción A (cero setup):** pestaña Equipo → botón "Enviar reporte por correo" → abre el cliente de correo con todo precargado
- **Opción B (envío automático):** generar app password de Gmail → ponerla en `dsw-os-web/tools/creds.json` → `node dsw-os-web/tools/notificar.js smtp`

---

## 🔵 NIVEL 4 — CRECIMIENTO (resolver este mes)

### C9 · TikTok local: la ventana sigue abierta
**Evidencia:** 65% de usuarios de TikTok descubren negocios locales; la competencia en GDL es cero.
**Acción exacta:** filmar el primer video antes/después (guiones en `07-Marketing/PLAYBOOK-TIKTOK-LOCAL.md`). Decir en voz alta: *"[servicio] en [colonia], Zapopan"*.

### C10 · LinkedIn B2B sin usar
**Evidencia:** 29M miembros en México (+16%), era creativa (video 3x seguidores).
**Acción exacta:** perfil de Daniel con titular "Ayudo a negocios de GDL a vender más con web, sistemas y presencia digital". 2 posts/semana.

### C11 · Optimización para búsquedas por IA (O-02)
**Evidencia:** 40% de búsquedas locales en LatAm pasan por IA antes de Google Maps.
**Acción exacta:** agregar "Optimización para Búsquedas por IA" ($1,500-3,000) a `01-Empresa/Servicios.md`. Incluye: Google Business Profile 100%, schema LocalBusiness, Bing Places, Apple Business Connect.

---

## 📊 EVIDENCIA WEB QUE SOSTIENE ESTE PLAN

| Hallazgo | Fuente | Fecha | Conecta con |
|---|---|---|---|
| Bloqueos de WhatsApp Business 2026 | Google News / Tus Buenas Noticias | 10-oct-2026 | C5 · O-12 |
| 63% empresas chilenas migran a API | El Ecosistema Startup | 14-ago-2026 | C5 · O-12 |
| Mito "es para empresas grandes" | El Economista | 10-oct-2026 | C6 |
| Google IA para PyMEs mexicanas | blog.google | 10-ago-2026 | C11 · O-02 |
| Restaurantes jaliscienses crecen | La Crónica de Hoy | 30-sep-2026 | C1 (más prospectos) |
| Gamificación en equipos | Gestión / Educación Futura | 2025-2026 | C7 |
| WhatsApp deja de ser gratis (1-oct) | InfoNegocios | 01-ago-2026 | O-04 |

---

## ✅ CÓMO SE MIDE EL PROGRESO

Cada viernes:
1. `node dsw-os-web/tools/dia.js` → ¿cuántas tareas se hicieron?
2. Pestaña Equipo → ¿quién tiene más puntos? ¿alguien está 🔴?
3. `node dsw-os-web/tools/notificar.js` → enviar reporte por correo
4. Actualizar este archivo: tachar lo resuelto, agregar lo nuevo

**La regla de oro:** si un punto de este plan no tiene fecha y responsable, no existe.
