# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Daniel (ventas/gestión) y su socio (desarrollo/entregas) — los dos roles de D.Softworks. Usan el panel como herramienta operativa diara: Daniel ejecuta prospección y ventas; el socio da seguimiento a entregas. Clientes no usan la app (pueden ver avances en una web existente que se revisará después).

## Product Purpose

El "Sistema Operativo" de D.Softworks: docs de operación + panel local (`app/index.html`) que conecta el cerebro (IA) con las manos (los socios). Éxito = ejecutar la Fase 5 (prospección → 50 contactos/semana → 3 clientes/mes) sin perder el hilo entre sesiones: la IA escribe tareas, ellos ejecutan y marcan, la IA lee los JSON y da el siguiente paso.

## Positioning

Circuito cerrado cerebro ↔ manos: la IA no solo aconseja, opera la empresa a través de `app/tareas.json`, `app/data/prospectos.json` y `app/data/mensajes.json` — un sistema operativo de negocio servido como archivos locales, sin servidores ni costos.

## Operating Context

- Agencia freelance en Guadalajara: páginas web, landings, catálogos y setup de redes para negocios locales.
- Flujo de venta: Prospecto → Contacto → Diagnóstico → Cotización → Cierre → Dev → Entrega → Cobro → Testimonio.
- Ritual: rutina diaria de ventas (30-45 min), métricas los viernes, reunión semanal de socios.
- Canales físicos: WhatsApp, Facebook, Instagram, Google Sheets (prospectos y métricas se reflejan ahí).
- Trabajo en OneDrive + git; la app corre con doble clic (Edge/Chrome), sin servidor.

## Capabilities and Constraints

- Panel local de un solo archivo (`app/index.html`): tareas, pipeline de prospectos, buzón de mensajes a la IA, métricas auto-calculadas, rutina diaria.
- Canales de datos: `app/tareas.json` (la IA escribe tareas; preservar `hecha`), `app/data/prospectos.json`, `app/data/mensajes.json` (`pendiente` → `atendido` + `respuesta`).
- JSON válido UTF-8 sin comas finales; si se rompe, la app muestra caché localStorage silenciosamente.
- Stack: HTML/CSS/JS estático → GitHub → Netlify; dominio Namecheap; Supabase solo si hay DB/login. Costo $0 en esta etapa.
- Precios autoritativos en `01-Empresa/Precios.md` (no copiar de `PLAN-DE-ACCION.md`).
- Existe una web pública de la agencia ya construida: pendiente de revisión/chequeo en una sesión aparte (datos de URL sin registrar aún).

## Brand Commitments

- Nombre: D.Softworks (logo `logo_DSW.jpg`, "@d.softworks").
- Voz: tú, directo, sin jerga corporativa (`07-Marketing/Tono-voz.md`).
- Todo el contenido y la UI en español (México).

## Evidence on Hand

- Portafolio real: 4 proyectos con fichas y capturas (`02-Portafolio/Proyecto-01..04/`), incl. GM Fire Services con URL activa.
- Publicaciones de marketing listas (`07-Marketing/Publicaciones/`), scripts de venta (`04-Ventas/`), plantillas (`03-Plantillas/`).
- Contexto de marketing: `.agents/product-marketing-context-global.md`; contexto ITIL: `09-ITIL/Contexto-ITIL-Unidad-II.md`.
- No inventar: testimonios, clientes, métricas o resultados que no estén en estos archivos.

## Product Principles

1. La IA es el cerebro que decide y entrega listo para ejecutar; los socios son las manos — instrucciones siempre accionables (texto exacto, ruta exacta, clic exacto).
2. Si no está en la hoja/app, no existe: todo pasa por los JSON o Google Sheets.
3. Costo operativo $0 hasta tener clientes pagando; nunca anticipo = no hay trabajo.
4. Ejecución > infraestructura: nada de apps nativas, ads ni herramientas de pago hasta consolidar la prospección orgánica.
5. La IA ofrece siempre mejoras concretas para integrar a la empresa, la web y el panel (principio durable del usuario).
