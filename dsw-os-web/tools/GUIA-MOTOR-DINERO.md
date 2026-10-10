# MOTOR DE DINERO — Guía de uso

**Archivo:** `dsw-os-web/tools/money.js`
**Costo:** $0
**Qué hace:** sabe dónde está tu plata, detecta la que se enfría, emite cotizaciones en 60 segundos y genera los mensajes de cobranza.

---

## Los 5 comandos

Correlos desde `dsw-os-web/tools/`:

### 1. `node money.js estado` — ¿dónde está mi plata?

```
  PIPELINE
    No registrado    14     $16,700  #####################
    Contactado        6      $9,400  ############
    Sin respuesta     1      $6,000  ########

  COTIZACIONES
    (ninguna — por eso no hay ingresos)

  CAJA
    Recibido total               $0
    Por cobrar (saldos)          $0
    Clientes activos             0
    Ingreso recurrente           $0
```

**Úsalo:** antes de hablar con cualquier persona. Si la línea de cotizaciones dice "(ninguna)", sabes exactamente por qué no hay ingresos.

---

### 2. `node money.js riesgo` — ¿qué plata se está enfriando?

Ordena por monto y te dice exactamente qué hacer con cada uno.

```
    p-001  Dr. Oscar Raygoza     $6,000  16d
           Cierre elegante o descartar
    p-007  Dra. Kimberley Pineda  $4,500  16d
           Seguimiento #2 obligatorio
```

**Úsalo:** las mañanas. Esto **es** tu lista de trabajo. El #1 es el de mayor monto.

---

### 3. `node money.js cotizar <id> <paquete>` — emitir cotización

```bash
node money.js cotizar p-007 profesional
```

**Qué hace automáticamente:**
- Crea la cotización con el precio correcto
- Calcula anticipo 50% / saldo 50%
- Pone fecha de vencimiento a 15 días
- Cambia el prospecto a estado **"Cotizado"**
- **Te imprime el mensaje exacto para enviarle por WhatsApp**

**Paquetes disponibles:**

| Comando | Servicio | Precio |
|---|---|---|
| `landing` | Landing Page | $1,200 |
| `web` | Página Web Básica | $1,500 |
| `catalogo` | Catálogo Digital | $800 |
| `redes` | Configuración de Redes | $600 |
| `presencia` | Paquete Presencia Digital | $2,000 |
| `emprendedor` | Paquete Emprendedor | $2,800 |
| `profesional` | Paquete Profesional | $4,500 |
| `mantenimiento` | Mantenimiento Mensual | $300 |
| `sistema` | Sistema a Medida | $8,000 |

**Agregar alcance extra (ej. "son 2 sucursales"):**
```bash
node money.js cotizar p-007 sistema 3000
```
→ Sistema a Medida $8,000 + $3,000 extra = **$11,000 total**

---

### 4. `node money.js cobrar <cotId> anticipo|saldo` — registrar pago

```bash
node money.js cobrar cot-001 anticipo
```

**Qué hace:** registra el dinero en `finanzas.json`, actualiza la cotización y marca el estado (`Cotizada` → `En curso` → `Cobrada`).

**Regla:** cuando entre dinero, se registra. Si no está en finanzas.json, no existe.

---

### 5. `node money.js recordatorio` — qué cobrar hoy

Genera los mensajes de cobranza listos para copiar-pegar.

```
  --- cot-001  Dental Magaña  ---

  [Saldo sin cobrar: $2,250]
    Hola Dra. Kimberley, tu proyecto ya está listo. Para poder
    liberarte el acceso final y las credenciales, faltan $2,250.
    En cuanto me confirmes te lo entrego todo.
```

**Úsalo:** antes de entregar. Este comando es la razón por la que cada cliente te paga los $1,000–$6,000 que hoyuffed trabajarías gratis.

---

## El flujo completo (lo que haces cuando alguien dice "sí")

```
1.  node money.js cotizar p-007 profesional     → genera cotización + mensaje
2.  Copiar el mensaje → WhatsApp                 → 60 segundos
3.  Cliente transfiere anticipo
4.  node money.js cobrar cot-001 anticipo        → registrado en finanzas
5.  Haces el trabajo
6.  node money.js recordatorio                   → mensaje del saldo listo
7.  node money.js cobrar cot-001 saldo           → proyecto cerrado
8.  node money.js estado                         → ves la caja real
```

**Tiempo total de administración: 5 minutos.** Antes eran 30 con papel.

---

## Por qué esto es "automatización de dinero"

| Antes | Ahora |
|---|---|
| "¿Cuánto tengo de plata?" → buscar en 4 archivos | `node money.js estado` |
| "¿A quién escribo hoy?" → mi memoria | `node money.js riesgo` |
| Cotización → abrir Word → llenar 20 campos → 20 min | `node money.js cotizar` → 60 seg |
| "¿Ya me pagó el saldo?" → hope | `node money.js recordatorio` |
| Olvidar cobrar → perder $2,250 | Automático |

**Lo que este motor nunca va a hacer:**究竟替你 vender. Eso sigues siendo tú.

**Lo que sí hace:** que cada peso que entre y cada peso que te deben quede registrado, y que no se te escape ni un saldo.

---

## Nota sobre sincronización

Los cambios los escribe en `app/data/`. Después de correr cualquier comando, dale **⟳ Sincronizar** en `https://dsw-os.netlify.app` para que aparezcan en la nube.

---

**Creado:** 10 de octubre de 2026 · **Costo:** $0 · **Precios:** `01-Empresa/Precios.md` y `Servicios.md` (fuente autoritativa)