# D.Softworks — Infraestructura Empresarial Completa

**Fecha de creación:** 22 de septiembre de 2026
**Objetivo:** Toda la infraestructura necesaria para operar legalmente y generar ingresos bajo el nombre D.Softworks

---

## RESUMEN: LO QUE FALTA vs LO QUE YA EXISTE

### ✅ LO QUE YA TIENES

| Área | Estado | Archivo |
|------|--------|---------|
| Identidad de marca | ✅ Listo | `01-Empresa/Identidad.md` |
| Servicios definidos | ✅ Listo | `01-Empresa\Servicios.md` |
| Precios | ✅ Listo | `01-Empresa\Precios.md` |
| Stack tecnológico | ✅ Listo | `01-Empresa\Stack-tecnologico.md` |
| Portafolio | ✅ Listo | `02-Portafolio/` |
| Plantilla cotización | ✅ Listo | `03-Plantillas\Cotizacion.md` |
| Plantilla diagnóstico | ✅ Listo | `03-Plantillas\Diagnostico.md` |
| Flujo de ventas | ✅ Listo | `04-Ventas\Flujo-ventas.md` |
| Reglas de cobro | ✅ Listo | `04-Ventas\Reglas-cobro.md` |
| Checklists entrega | ✅ Listo | `06-Clientes\Checklists-entrega.md` |
| Postventa | ✅ Listo | `06-Clientes\Postventa.md` |
| Marketing/Redes | ✅ Listo | `07-Marketing/` |
| Reuniones | ✅ Listo | `08-Reuniones/` |
| Prácticas ITIL | ✅ Listo | `09-ITIL/` |

### ❌ LO QUE FALTA (Infraestructura Legal y Financiera)

| Área | Estado | Prioridad |
|------|--------|-----------|
| **RFC (Registro Federal de Contribuyentes)** | ❌ No existe | CRÍTICA |
| **Constancia de Situación Fiscal** | ❌ No existe | CRÍTICA |
| **Facturación Electrónica (CFDI)** | ❌ No existe | CRÍTICA |
| **Contrato Social / Acta Constitutiva** | ❌ No existe | ALTA |
| **Cuenta Bancaria Empresarial** | ❌ No existe | ALTA |
| **Contrato de Prestación de Servicios** | ❌ No existe | ALTA |
| **Aviso de Inicio de Actividades** | ❌ No existe | ALTA |
| **Registro de Marca** | ❌ No existe | MEDIA |
| **Contabilidad / Registro de Ingresos** | ❌ No existe | ALTA |
| **Métodos de pago adicionales** | ❌ Solo efectivo/transferencia | MEDIA |

---

## FASE 1: LEGALIZACIÓN DE LA EMPRESA (Semana 1-2)

### Paso 1: Definir Régimen Fiscal

**Opciones para D.Softworks:**

| Régimen | Cuándo usarlo | Ventajas | Desventajas |
|---------|---------------|----------|-------------|
| **Régimen Simplificado de Confianza (RESICO)** | Ingresos < $3.5M/año | Tasas bajas (1% a 2.5%), simplificado | Límite de ingresos |
| **Régimen General de Ley** | Sin límite | Más.flexible | Más obligaciones, tasas más altas |
| **Persona Física con Actividades Empresariales** | Freelancer | Simple | Menos credibilidad |

**Recomendación para D.Softworks:** 
- **RESICO** si los ingresos serán < $3.5M MXN/año (lo más probable)
- Alternativa: **Persona Física con Actividades Empresariales** si quieren empezar como freelance

### Paso 2: Obtener RFC

**¿Qué es?** Registro Federal de Contribuyentes — tu identificación fiscal ante el SAT.

**Requisitos:**
- CURP
- Comprobante de domicilio (reciente, a nombre del contribuyente o familiar)
- Identificación oficial vigente (INE/IFE)
- Acta de nacimiento (si es menor de edad)

**Proceso:**
1. Agendar cita en el SAT: https://citas.sat.gob.mx
2. Llenar formato RFC en línea (previo a la cita)
3. Asistir a la cita con documentos
4. Recibir tu RFC y contraseña del SAT

**Costo:** $0 (es gratuito)

**Tiempo:** 1 día (con cita previa)

### Paso 3: Obtener Constancia de Situación Fiscal

**¿Qué es?** Documento que comprueba tu situación fiscal ante el SAT.

**Proceso:**
1. Entrar a Portal del SAT: https://www.sat.gob.mx
2. Iniciar sesión con RFC y contraseña
3. Seleccionar "Constancia de Situación Fiscal"
4. Descargar en PDF

**Costo:** $0

### Paso 4: Inscribirse en Régimen Fiscal

**Proceso:**
1. Entrar al portal del SAT
2. Ir a "Actualización de Datos"
3. Seleccionar régimen fiscal (RESCO o General)
4. Registrar actividad económica (Servicios de desarrollo de software)
5. Guardar cambios

**Clave de actividad económica:** 62011000 — Servicios de desarrollo de software para otros

---

## FASE 2: FACTURACIÓN ELECTRÓNICA (Semana 2-3)

### ¿Por qué necesitas facturar?

1. **Legalidad:** Es obligatorio facturar todos los ingresos
2. **Deducción:** Los clientes pueden deducir impuestos
3. **Credibilidad:** Empresas grandes te pedirán factura
4. **Control:** Registro de todos tus ingresos

### Opciones de Facturación Electrónica

| Opción | Costo | Ventajas | Desventajas |
|--------|-------|----------|-------------|
| **FacturAPI (por uso)** | ~$5 por factura | Sin mensualidad, pagar solo cuando factures | Costo por factura |
| **FacturAPI (mensual)** | ~$200 MXN/mes | Facturas ilimitadas | Costo fijo mensual |
| **Swizz** | ~$100 MXN/mes | Fácil de usar | Limitado en funciones |
| **Factura Directa** | Gratis (limitado) | Sin costo | 10 facturas/mes gratis |
| **Contpaq iFactura** | ~$300 MXN/mes | Profesional | Caro para empezar |

**Recomendación:** **FacturAPI** por uso — pagas solo cuando factures (~$5 por CFDI)

### Proceso de Facturación

```
1. RECIBIR PAGO
   - Cliente paga (anticipo o saldo)
   - Confirmar monto y método

2. GENERAR FACTURA
   - Entrar a plataforma de facturación
   - Datos del cliente: RFC, nombre, régimen fiscal, domicilio
   - Concepto: Servicio de desarrollo web / Landing page / etc.
   - Importe: Monto pagado
   - Generar CFDI 4.0

3. ENVIAR AL CLIENTE
   - Descargar XML y PDF
   - Enviar por email o WhatsApp
   - Guardar copia

4. REGISTRAR
   - Anotar en hoja de contabilidad
   - Guardar XML en carpeta del cliente
```

### Datos que necesitas para facturar

**De ti (emisor):**
- RFC
- Nombre completo o Razón Social
- Régimen fiscal
- Domicilio fiscal
- Código postal

**Del cliente (receptor):**
- RFC
- Nombre completo o Razón Social
- Régimen fiscal
- Domicilio fiscal
- Código postal
- Uso de CFDI (G03 — Gastos en general)

---

## FASE 3: CUENTA BANCARIA EMPRESARIAL (Semana 2-3)

### ¿Por qué necesitas una cuenta bancaria separada?

1. **Separación:** Dinero personal ≠ dinero de la empresa
2. **Control:** Saber exactamente cuánto ingresas y gastas
3. **Profesionalismo:** Los clientes pueden transferir a nombre de la empresa
4. **Fiscal:** Obligación de llevar registro de ingresos

### Opciones de Cuenta Bancaria

| Banco | Tipo de cuenta | Costo mensual | Requisitos |
|-------|----------------|---------------|------------|
| **Nu Business** | Empresarial | $0 | RFC, CURP, comprobante domicilio |
| **Stori Business** | Empresarial | $0 | RFC, CURP |
| **Banregio** | Empresarial | $0 (primer año) | RFC, acta constitutiva |
| **BBVA** | Empresarial | ~$150/mes | RFC, acta constitutiva |
| **Banorte** | Empresarial | ~$100/mes | RFC, acta constitutiva |

**Recomendación:** **Nu Business** o **Stori Business** — sin comisiones, rápido de abrir

### Proceso para Abrir Cuenta

1. Descargar app del banco
2. Seleccionar "Cuenta Empresarial"
3. Capturar RFC
4. Subir documentos (INE, comprobante domicilio)
5. Esperar aprobación (1-3 días)
6. ¡Listo para recibir transferencias!

---

## FASE 4: CONTRATOS Y DOCUMENTOS LEGALES (Semana 3-4)

### Contrato de Prestación de Servicios

**¿Por qué lo necesitas?**
- Protege a ambas partes
- Define alcance, tiempos y pagos
- Evita malentendidos
- Base legal en caso de conflicto

### Estructura del Contrato

```
CONTRATO DE PRESTACIÓN DE SERVICIOS DE DESARROLLO WEB

ENTRE:

EL PRESTADOR: [Tu nombre completo], con domicilio en [dirección], 
con RFC [tu RFC], en adelante "D.Softworks"

EL CLIENTE: [Nombre del cliente], con domicilio en [dirección], 
con RFC [si lo tiene], en adelante "EL CLIENTE"

CLÁUSULAS:

PRIMERA — OBJETO DEL CONTRATO
D.Softworks se compromete a desarrollar [descripción del servicio] 
según las especificaciones descritas en el Anexo A (Alcance del Proyecto).

SEGUNDA — PRECIO Y FORMA DE PAGO
El precio total es de $[monto] MXN, pagadero así:
- 50% anticipo ($[monto] MXN) al firmar este contrato
- 50% contra entrega ($[monto] MXN) antes de entregar el producto final

TERCERA — PLAZO DE ENTREGA
El tiempo estimado de entrega es de [número] días hábiles, 
a partir de la recepción del anticipo y de toda la información 
necesaria por parte de EL CLIENTE.

CUARTA — CAMBIOS Y ADICIONES
Cualquier cambio fuera del alcance descrito en el Anexo A será 
cotizado por separado y deberá ser aprobado por escrito por 
ambas partes antes de su ejecución.

QUINTA — PROPIEDAD INTELECTUAL
Una vez realizado el pago total, EL CLIENTE será propietario del 
producto entregado. D.Softworks se reserva el derecho de mostrar 
el proyecto en su portafolio.

SEXTA — CONFIDENCIALIDAD
Ambas partes se comprometen a mantener confidencial la información 
compartida durante la relación comercial.

SÉPTIMA — GARANTÍA
D.Softworks ofrece garantía de [7/15/30] días contra defectos 
de desarrollo. No cubre daños por uso indebido o modificaciones 
realizadas por terceros.

OCTAVA — CANCELACIÓN
En caso de cancelación por parte de EL CLIENTE, el anticipo no 
será reembolsable. Si la cancelación es por parte de D.Softworks, 
se reembolsará el 100% de lo cobrado.

NOVENA — LEY APLICABLE
Este contrato se rige por las leyes de los Estados Unidos Mexicanos.

DÉCIMA — JURISDICCIÓN
Para la interpretación y cumplimiento de este contrato, ambas partes 
se someten a la jurisdicción de los tribunales de [ciudad], Jalisco.

FIRMAS:

_________________________          _________________________
D.Softworks                        EL CLIENTE

Fecha: ___/___/______              Fecha: ___/___/______
```

### Anexo A — Alcance del Proyecto

```
ANEXO A — ALCANCE DEL PROYECTO

Servicio: [Página web / Landing / Catálogo / Config. Redes]

Descripción detallada:
- [Lista de funcionalidades incluidas]
- [Número de páginas/secciones]
- [Características específicas]

Tecnologías:
- [Stack a utilizar]

Contenido del cliente:
- [Logo]
- [Fotos]
- [Textos]
- [Información de contacto]

Entregables:
- [Producto final]
- [Credenciales]
- [Capacitación]

Cronograma:
- Día 1-2: Recopilar información
- Día 3-5: Desarrollo
- Día 6: Revisión interna
- Día 7: Entrega al cliente
```

---

## FASE 5: CONTABILIDAD Y REGISTRO (Semana 3-4)

### Hoja de Registro de Ingresos

Crear un Google Sheet con esta estructura:

| Fecha | Cliente | Servicio | Monto | Método Pago | Tipo | Factura # | Estado |
|-------|---------|----------|-------|-------------|------|-----------|--------|
| | | | | Transferencia / Efectivo | Anticipo / Saldo | | Pagado / Pendiente |

### Hoja de Registro de Gastos

| Fecha | Concepto | Proveedor | Monto | Método Pago | Categoría | Factura |
|-------|----------|-----------|-------|-------------|-----------|---------|
| | | | | | Hosting / Dominio / Herramienta / Otro | |

### Categorías de Gastos

| Categoría | Ejemplos |
|-----------|----------|
| **Hosting/Dominio** | Namecheap, Netlify (si pagas) |
| **Herramientas** | Canva Pro, VS Code extensions |
| **Marketing** | Publicidad, impresiones |
| **Educación** | Cursos, libros |
| **Transporte** | Uber, gasolina (reuniones con clientes) |
| **Equipo** | Computadora, celular, internet |

### Reporte Mensual

```
REPORTE FINANCIERO — MES ___/2026

INGRESOS
| Cliente | Servicio | Monto | Estado |
|---------|----------|-------|--------|
| | | | |
| | | | |
TOTAL INGRESOS: $______ MXN

GASTOS
| Concepto | Monto | Categoría |
|----------|-------|-----------|
| | | |
| | | |
TOTAL GASTOS: $______ MXN

RESULTADO
Ingresos: $______ MXN
Gastos: $______ MXN
UTILIDAD: $______ MXN

FACTURACIÓN PENDIENTE
| Cliente | Monto | Estado |
|---------|-------|--------|
| | | |

IMPPUESTOS ESTIMADOS (RESICO)
Ingresos gravables: $______ MXN
Tasa estimada (2%): $______ MXN
```

---

## FASE 6: PROCESOS DE COBRO MEJORADOS (Semana 4)

### Métodos de Pago Actualizados

| Método | Estado | Cómo recibirlo | Cuándo usarlo |
|--------|--------|----------------|---------------|
| **Transferencia bancaria** | ✅ Activo | Cuenta personal o empresarial | Siempre |
| **Efectivo** | ✅ Activo | En persona | Solo en reuniones |
| **PayPal** | ⏳ Pendiente | Crear cuenta de negocio | Clientes internacionales |
| **Stripe** | ⏳ Pendiente | Integrar con plataforma | Pagos con tarjeta |
| **Mercado Pago** | ⏳ Pendiente | Crear cuenta | Clientes que pagan con tarjeta |
| **OXXO** | ⏳ Pendiente | Vía plataforma de cobro | Clientes sin banco |

### Proceso de Cobro con Factura

```
1. ENVIAR COTIZACIÓN
   - Cotización con factura incluida
   - "El precio incluye factura electrónica"

2. RECIBIR PAGO
   - Transferencia a cuenta bancaria
   - Confirmar pago

3. GENERAR FACTURA
   - Emitir CFDI 4.0
   - Enviar XML y PDF al cliente

4. REGISTRAR
   - Actualizar hoja de ingresos
   - Guardar copia de factura

5. CONFIRMAR
   - Mensaje al cliente: "Pago recibido, factura enviada"
```

### Plantilla de Confirmación de Pago

```
¡Hola [Nombre]! 👋

Recibimos tu pago de $[monto] MXN por [servicio].

📄 Tu factura electrónica está adjunta a este mensaje.

Gracias por tu preferencia. 🤝

D.Softworks — Soluciones Digitales
```

---

## FASE 7: HERRAMIENTAS EMPRESARIALES (Semana 4)

### Herramientas Recomendadas

| Categoría | Herramienta | Costo | Para qué |
|-----------|-------------|-------|----------|
| **Facturación** | FacturAPI | ~$5/factura | Emitir CFDI |
| **Contabilidad** | Google Sheets | $0 | Registro de ingresos/gastos |
| **CRM** | Google Sheets | $0 | Seguimiento de clientes |
| **Proyectos** | Trello/Notion | $0 | Control de avance |
| **Contratos** | Google Docs | $0 | Firmar y guardar |
| **Cobro** | PayPal/Stripe | Variable | Pagos en línea |
| **Comunicación** | WhatsApp Business | $0 | Atención a clientes |

### Estructura de Carpetas en Google Drive

```
📁 D.Softworks — Empresa/
├── 📁 01-Fiscal/
│   ├── RFC.pdf
│   ├── Constancia Situación Fiscal.pdf
│   ├── Acta Constitutiva.pdf (si aplica)
│   └── Contrato Social.pdf (si aplica)
├── 📁 02-Facturas/
│   ├── 📁 2026/
│   │   ├── 📁 Septiembre/
│   │   ├── 📁 Octubre/
│   │   └── ...
│   └── Plantilla Factura.md
├── 📁 03-Contratos/
│   ├── Plantilla Contrato.md
│   ├── 📁 Contratos Firmados/
│   └── 📁 Anexos/
├── 📁 04-Contabilidad/
│   ├── Registro Ingresos.xlsx
│   ├── Registro Gastos.xlsx
│   └── Reportes Mensuales/
├── 📁 05-Clientes/
│   ├── [Nombre Cliente]/
│   │   ├── Contrato.pdf
│   │   ├── Facturas/
│   │   ├── Proyecto/
│   │   └── Comunicación/
│   └── ...
└── 📁 06-Empresa/
    ├── Identidad/
    ├── Logos/
    └── Documentos Legales/
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### SEMANA 1 — Legalización
- [ ] Agendar cita en el SAT
- [ ] Obtener RFC
- [ ] Obtener Constancia de Situación Fiscal
- [ ] Inscribirse en régimen fiscal (RESICO recomendado)

### SEMANA 2 — Facturación y Cuenta
- [ ] Crear cuenta en FacturAPI (u otra plataforma)
- [ ] Generar primera factura de prueba
- [ ] Abrir cuenta bancaria empresarial (Nu/Stori)
- [ ] Configurar datos bancarios para cobros

### SEMANA 3 — Contratos y Contabilidad
- [ ] Crear plantilla de contrato
- [ ] Crear Anexo A (alcance de proyecto)
- [ ] Crear hoja de registro de ingresos
- [ ] Crear hoja de registro de gastos
- [ ] Crear estructura de carpetas en Drive

### SEMANA 4 — Integración
- [ ] Actualizar cotización con datos de factura
- [ ] Actualizar reglas de cobro con nuevos métodos
- [ ] Crear template de confirmación de pago
- [ ] Probar flujo completo: prospecto → factura
- [ ] Crear primer reporte mensual

### MES 2 — Optimización
- [ ] Evaluar si necesitas PayPal/Stripe
- [ ] Primer cierre mensual
- [ ] Pago de impuestos (si aplica)
- [ ] Ajustar procesos según aprendizaje

---

## COSTOS DE IMPLEMENTACIÓN

| Concepto | Costo | Notas |
|----------|-------|-------|
| RFC | $0 | Gratuito |
| Constancia Situación Fiscal | $0 | Gratuito |
| FacturAPI (10 facturas) | ~$50 MXN | Solo cuando factures |
| Cuenta bancaria empresarial | $0 | Nu/Stori sin comisiones |
| Google Workspace (opcional) | $0-200 MXN/mes | Para email profesional |
| **TOTAL INICIAL** | **~$50 MXN** | Mínimo para empezar |

---

## FLUJO COMPLETO ACTUALIZADO

```
PROSPECTO → CONTACTO → DIAGNÓSTICO → COTIZACIÓN (con factura) 
    → CIERRE → ANTICIPO → FACTURA → DESARROLLO 
    → ENTREGA → SALDO → FACTURA → TESTIMONIO
```

### Cada paso ahora incluye:

1. **Cotización:** Incluye monto + nota de que se factura
2. **Cierre:** Se firma contrato (opcional pero recomendado)
3. **Anticipo:** Se recibe transferencia + se factura
4. **Desarrollo:** Se registra avance
5. **Entrega:** Se cobra saldo + se factura
6. **Testimonio:** Se pide reseña

---

**D.Softworks — Soluciones Digitales**
**Documento creado:** 22 de septiembre de 2026
**Versión:** 1.0