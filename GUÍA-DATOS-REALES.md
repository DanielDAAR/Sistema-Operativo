# D.Softworks OS — Guía Completa de Datos Reales

## CÓMO FUNCIONA CADA ARCHIVO JSON

Cada sección de la app lee de un JSON específico. Estos son los archivos que debes mantener actualizados con tus datos reales.

---

## 1. PROSPECTOS → `app/data/prospectos.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "prospectos": [
    {
      "id": "p-001",
      "nombre": "Nombre del contacto",
      "negocio": "Nombre del negocio",
      "telefono": "+52 33 XXXX XXXX",
      "fuente": "Instagram",
      "estado": "Nuevo",
      "monto": 1500,
      "fecha": "2026-09-20",
      "notas": "Quiere página web"
    }
  ]
}
```

### Estados posibles y cuándo usarlos
| Estado | Significado | Cuándo aplicar |
|--------|-------------|----------------|
| `Nuevo` | Acabamos de encontrarlo, no hemos contactado | Lo identificamos hoy |
| `Contactado` | Ya enviamos WhatsApp | Enviamos el mensaje |
| `Respondió` | Contestó, sigue conversación | Respondió nuestro mensaje |
| `Reunión` | Agendamos llamada/meet | Confirmaron reunión |
| `Cotizado` | Enviamos cotización | Cotización entregada |
| `Sin respuesta` | No contestó después de 3 días | Pasaron 3 días sin responder |
| `Cerrado` | Se convirtió en cliente | Firmó contrato o pagó anticipo |

### Reglas de precios por servicio
| Servicio | Precio | Anticipo (50%) |
|----------|--------|-----------------|
| Página web básica | $1,500 MXN | $750 |
| Landing page | $1,200 MXN | $600 |
| Catálogo digital | $800 MXN | $400 |
| Configuración de redes | $600 MXN | $300 |
| Paquete Presencia Digital | $2,000 MXN | $1,000 |
| Paquete Emprendedor | $2,800 MXN | $1,400 |
| Paquete Profesional | $4,500 MXN | $2,250 |
| Sistema a medida | Desde $2,000 MXN | 50% según cotización |

### Cómo llenar un prospecto real
**Ejemplo real — "Farmacia Central":**
1. Identificaste en Google Maps que tienen negocio
2. El dueño se llama "Dr. Martínez" → `nombre`
3. El negocio es "Farmacia Central" → `negocio`
4. Telefono: +52 33 6666 7777 → `telefono`
5. Lo encontraste en Google → `fuente: "Google"`
6. No los has contactado → `estado: "Nuevo"`
7. Crees que quieren sistema a medida → `monto: 4500`
8. Hoy es 2026-09-23 → `fecha`
9. Nota: "Consulta para sistema empresarial" → `notas`

### Cómo actualizar estados
Cuando cambies estado, solo modifica el campo `estado` y la `fecha`:
```json
// Antes
{"estado":"Nuevo","fecha":"2026-09-23"}
// Después de enviar WhatsApp
{"estado":"Contactado","fecha":"2026-09-23"}
// Después de 3 días sin respuesta
{"estado":"Sin respuesta","fecha":"2026-09-26"}
// Cuando aceptan
{"estado":"Cerrado","fecha":"2026-09-25"}
```

---

## 2. CLIENTES → `app/data/clientes.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "clientes": [
    {
      "id": "c-001",
      "cliente": "Laura Martínez",
      "negocio": "Laura's Boutique",
      "servicio": "Página web básica",
      "precio": 1500,
      "anticipo": 750,
      "estado": "Entregado",
      "fechaInicio": "2026-09-01",
      "fechaEntrega": "2026-09-15",
      "notas": "Entregada",
      "fecha": "2026-09-15",
      "actualizado": "2026-09-15"
    }
  ]
}
```

### Flujo completo de un cliente
```
Prospecto (Nuevo → Contactado → ... → Cerrado)
  ↓
Al cerrar, se crea cliente nuevo con:
  - cliente = nombre del prospecto
  - negocio = nombre del negocio
  - servicio = lo que acordaron
  - precio = monto total
  - anticipo = 50% del precio
  - estado = "En desarrollo"
  - fechaInicio = cuando empezaste
  - fechaEntrega = cuando prometiste entregar
  ↓
Durante el proyecto, cambias estado:
  - "En desarrollo" → trabajando
  - "En revisión" → cliente revisando
  - "Esperando pago" → entregado, falta saldo
  - "Entregado" → completado
```

### Estados de proyecto
| Estado | Significado | Cuándo |
|--------|-------------|--------|
| `En desarrollo` | Estás trabajando | Empezaste el proyecto |
| `En revisión` | Cliente está revisando | Entregaste, espera feedback |
| `Esperando pago` | Entregado, falta saldo 50% | Entregaste el trabajo |
| `Entregado` | Completado, todo pagado | Cliente confirmó y pagó |

### Ejemplo real
**Cliente "Dulces María":**
- Servicio: Tienda en línea → precio $800
- Anticipo: $400 (ya pagó)
- Saldo: $400 (pendiente)
- Estado: Esperando pago
- Inicio: 2026-09-20
- Entrega estimada: 2026-10-10
- Nota: "Falta cobrar saldo"

---

## 3. COTIZACIONES → `app/data/cotizaciones.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "cotizaciones": [
    {
      "id": "cot-001",
      "prospecto": "Dulces María",
      "servicio": "Tienda en línea",
      "precio": 800,
      "folio": "COT-2026-001",
      "fechaEnvio": "2026-09-23",
      "respuesta": "Pendiente",
      "items": [{"descripcion": "Tienda en línea", "precio": 800}]
    }
  ]
}
```

### Flujo de cotización
```
Prospecto interesado → Creas cotización → Estado: Pendiente
  ↓
Prospecto responde:
  - "Aceptada" → Cerrar prospecto, crear cliente
  - "Rechazada" → Prospecto "Perdido"
  - "Sin respuesta" → Esperar 3 días, luego "Sin respuesta"
```

### Cómo crear una cotización real
**Ejemplo — Cotizar a "Farmacia Central":**
1. Prospecto: "Farmacia Central" (del listado)
2. Servicio: "Sistema empresarial a medida"
3. Precio: $4,500 (o lo que cotices)
4. Folio: se genera automático: COT-2026-002
5. FechaEnvio: hoy → "2026-09-23"
6. Respuesta: "Pendiente" (todavía no contestó)
7. Items: [{descripcion: "Sistema empresarial", precio: 4500}]

### Regla de seguimiento
- Si `respuesta === "Pendiente"` y `fechaEnvio` tiene ≥ 3 días → alerta roja en Dashboard
- Si ≥ 7 días → probablemente perdido, considera "Sin respuesta"

---

## 4. FINANZAS → `app/data/finanzas.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "metaMes": 10000,
  "movimientos": [
    {
      "id": "m-001",
      "tipo": "ingreso",
      "concepto": "Anticipo Laura's Boutique",
      "monto": 750,
      "fecha": "2026-09-15",
      "notas": "50% anticipo de proyecto entregado"
    }
  ]
}
```

### Ingresos vs Egresos
| Tipo | Cuándo registrar | Ejemplo |
|------|-----------------|---------|
| `ingreso` | Cuando recibes dinero | Anticipo de cliente, pago final |
| `egreso` | Cuando gastas dinero | Hosting, dominio, herramientas |

### Meta mensual
- `metaMes`: tu objetivo de ingresos del mes
- Meta realista mes 1-2: **$10,000 MXN**
- Si `ingresos/metaMes < 0.4` con ≥ 20 días → alerta roja

### Cómo registrar ingresos reales
**Ejemplo — Recibiste anticipo de Laura:**
```json
{
  "id": "m-001",
  "tipo": "ingreso",
  "concepto": "Anticipo Laura's Boutique",
  "monto": 750,
  "fecha": "2026-09-15",
  "notas": "50% de $1,500"
}
```

**Ejemplo — Pagaste hosting:**
```json
{
  "id": "m-003",
  "tipo": "egreso",
  "concepto": "Hosting mensual",
  "monto": 500,
  "fecha": "2026-09-01",
  "notas": "Servicio de hosting"
}
```

### Cálculo de avance
- Ingresos del mes = suma de `tipo: "ingreso"` donde `fecha` está en el mes actual
- Avance = ingresos / metaMes × 100%
- Meta: al menos 40% para el día 20 del mes

---

## 5. CONTENIDO → `app/data/contenido.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "publicaciones": [
    {
      "id": "k-001",
      "titulo": "Portafolio-01-GMFire",
      "estado": "Pendiente",
      "fecha": "2026-09-25",
      "enlace": "",
      "archivo": "",
      "notas": "Publicación del portafolio de GMFire"
    }
  ]
}
```

### Estados de publicación
| Estado | Significado |
|--------|-------------|
| `Borrador` | No publicada aún |
| `Pendiente` | Lista para publicar hoy |
| `Publicada` | Ya se publicó |

### Regla de publicación
- Regla de oro: **1 publicación cada 2 días**
- Nunca hacer rafagas de varias en un día
- Los martes: FB a las 10am, IG a las 12pm
- Si `estado === "Pendiente"` y `fecha === today()` → alerta en Dashboard

### Ejemplo real
**Publicar Portafolio GMFire:**
```json
{
  "id": "k-001",
  "titulo": "Portafolio-01-GMFire",
  "estado": "Pendiente",
  "fecha": "2026-09-25",
  "enlace": "",
  "archivo": "Captura_de_pantalla_2026-09-15.png",
  "notas": "Carrusel 3-5 capturas del sitio"
}
```

---

## 6. TAREAS → `app/tareas.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "tareas": [
    {
      "id": "t-001",
      "titulo": "Publicar Portafolio-01-GMFire",
      "detalle": "Subir la publicación al blog y redes",
      "categoria": "Marketing",
      "vence": "2026-09-25",
      "hecha": false,
      "origen": "cerebro"
    }
  ]
}
```

### Cómo crear una tarea real
```json
{
  "id": "t-001",
  "titulo": "Enviar propuesta a Farmacia Central",
  "detalle": "Preparar y enviar cotización por WhatsApp",
  "categoria": "Ventas",
  "vence": "2026-09-25",
  "hecha": false,
  "origen": "cerebro"
}
```

### Origen de tareas
| origen | Significado |
|--------|-------------|
| `cerebro` | La IA te generó esta tarea |
| `tu` | Tú la creaste manualmente |

### Reglas de vencimiento
- Si `hecha: false` y `vence < today()` → tarea vencida
- Contador de vencidas en Dashboard
- Si tienes ≥ 3 tareas vencidas → alerta en Dashboard

---

## 7. AGENDA → `app/data/agenda.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "reuniones": [
    {
      "id": "a-reunion-socios-1",
      "titulo": "Reunión semanal de socios",
      "tipo": "Socios",
      "fecha": "2026-09-27",
      "hora": "10:00",
      "duracionMin": 30,
      "participante": "Daniel + compañero",
      "notas": "Métricas, proyectos, próxima semana",
      "estado": "Próximamente",
      "resultado": ""
    }
  ]
}
```

### Estados de reunión
| Estado | Significado |
|--------|-------------|
| `Próximamente` | Aún no se hace |
| `Realizada` | Ya se llevó a cabo |
| `Cancelada` | Se canceló |

### Al marcar como Realizada
- App pide `resultado` obligatorio
- El resultado se guarda en el campo `resultado`
- Se registra en la bitácora

---

## 8. MENSAJES → `app/data/mensajes.json`

### Estructura de datos
```json
{
  "actualizado": "2026-09-23",
  "mensajes": [
    {
      "id": "msg-001",
      "texto": "Tu mensaje aquí",
      "fecha": "2026-09-23",
      "estado": "pendiente",
      "respuesta": ""
    }
  ]
}
```

### Flujo
```
Tú envías mensaje → estado: "pendiente"
  ↓
Diles "revisa la app" o "ya terminé"
  ↓
IA responde → estado: "atendido", respuesta: <texto>
  ↓
Si respondió → aparece en la lista como "Atendido"
Si no → sigue como "Pendiente"
```

---

## 9. CALENDARIO DE CONTENIDO

### Cada 2 días publicar (nunca rafaga)
| Día | Acción |
|-----|--------|
| Lunes | Publicar en FB 10am, IG 12pm |
| Martes | Publicar en FB 10am, IG 12pm |
| Miércoles | Descansar |
| Jueves | Publicar en FB 10am, IG 12pm |
| Viernes | Publicar en FB 10am, IG 12pm + Review métricas |

### Tipos de publicación
| Tipo | Frecuencia | Contenido |
|------|-----------|-----------|
| Portafolio | Cada 4 publicaciones | Foto de proyecto entregado |
| Educativo | Cada 2 publicaciones | Tip, consejo, dato del rubro |
| Oferta | Cada 2 semanas | Promoción especial |

---

## 10. MÉTRICAS SEMANALES — HOJA DE CÁLCULO

### Llenar cada viernes
| Semana | Prospectos | Mensajes | Respuestas | Reuniones | Cotizaciones | Cierres | Ingresos |
|--------|------------|----------|------------|-----------|--------------|---------|----------|
| Sem 1 | 10 | 10 | ? | ? | ? | ? | ? |
| Meta | 50 | 50 | 10 (20%) | 5 (50%) | 3 | 1-2 | $10,000 |

### Fórmulas clave
- Tasa de respuesta = Respuestas / Mensajes enviados
- Tasa de reunión = Reuniones / Respuestas
- Tasa de cierre = Cierres / Cotizaciones
- Ticket promedio = Ingresos / Cierres

### Meta mensual de prospectos
- **50 contactos por semana** (10/día × 5 días)
- Si tienes menos de 10/día → necesitas más fuentes
- Si tienes menos de 50/semana → necesitas más disciplina

---

## REGLAS DE ORO PARA TUS DATOS REALES

1. **Si no está en el JSON, no existe.** Si no lo escribiste, no pasó.
2. **Actualizar después de cada acción.** No esperes al final del día.
3. **Nunca inventar datos.** Si no sabes la fecha, pon `"fecha": ""`.
4. **Guardar en localStorage.** La app guarda automáticamente en local mode.
5. **Conectar carpeta para persistencia.** Los datos en localStorage se pierden si borras caché. Conectar carpeta los guarda en archivos JSON reales.
6. **Llenar Google Sheets cada viernes.** Copia los totales de la app a la hoja.

---

## CHECKLIST — TUS DATOS REALES HOY

- [ ] Verificar que los 10 prospectos en `prospectos.json` son correctos
- [ ] Verificar que los 2 clientes en `clientes.json` tienen datos reales
- [ ] Verificar que las 4 cotizaciones en `cotizaciones.json` están actualizadas
- [ ] Verificar que `finanzas.json` tiene los movimientos correctos
- [ ] Verificar que las 5 tareas en `tareas.json` son las correctas
- [ ] Verificar que la meta de $10,000 es correcta para ti
- [ ] Verificar que los 2 posts en `contenido.json` están correctos
- [ ] Verificar que la reunión en `agenda.json` es correcta
- [ ] Verificar que `mensajes.json` está vacío (recién empieza)

---

## RESUMEN DE ARCHIVOS Y DÓNDE SE GUARDAN

| Archivo | Ubicación | Qué contiene |
|---------|-----------|--------------|
| `tareas.json` | `app/tareas.json` | Tareas diarias |
| `prospectos.json` | `app/data/prospectos.json` | Lista de prospectos |
| `clientes.json` | `app/data/clientes.json` | Clientes activos |
| `cotizaciones.json` | `app/data/cotizaciones.json` | Cotizaciones enviadas |
| `finanzas.json` | `app/data/finanzas.json` | Ingresos, egresos, meta |
| `contenido.json` | `app/data/contenido.json` | Publicaciones en calendario |
| `agenda.json` | `app/data/agenda.json` | Reuniones |
| `mensajes.json` | `app/data/mensajes.json` | Mensajes con la IA |
| `bitacora.json` | `app/data/bitacora.json` | Historial de acciones |
| `reportes.json` | `app/data/reportes.json` | Reportes semanales |
| `seed.js` | `app/seed.js` | Datos embebidos (funciona sin servidor) |
| `app.js` | `app/app.js` | Lógica de la aplicación |
| `index.html` | `app/index.html` | Interfaz visual |
| `styles.css` | `app/styles.css` | Estilos del panel |
