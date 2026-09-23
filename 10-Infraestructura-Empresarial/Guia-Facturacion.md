# D.Softworks — Plantilla de Facturación

---

## GUÍA PARA EMITIR FACTURAS (CFDI 4.0)

### Datos del Emisor (D.Softworks)

| Campo | Valor |
|-------|-------|
| **RFC** | [Tu RFC] |
| **Nombre** | [Tu nombre completo o Razón Social] |
| **Régimen Fiscal** | 612 — Personas Físicas con Actividades Empresariales y Profesionales (o 621 si RESICO) |
| **Domicilio Fiscal** | [Tu dirección] |
| **Código Postal** | [Tu CP] |

### Datos que Necesitas del Cliente

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **RFC** | RFC del cliente (o "XAXX010101000" si no tiene) | ABCD850101XX1 |
| **Nombre** | Razón social o nombre completo | Juan Pérez García |
| **Régimen Fiscal** | Régimen del cliente | 612 (Persona Física) |
| **Domicilio Fiscal** | Dirección del cliente | Calle #, Col, CP |
| **Código Postal** | CP del cliente | 44100 |
| **Uso de CFDI** | Para qué usa la factura | G03 — Gastos en general |

### Usos de CFDI Comunes

| Código | Uso | Cuándo aplicarlo |
|--------|-----|------------------|
| **G01** | Adquisición de mercancías | No aplica (servicios) |
| **G03** | Gastos en general | La mayoría de tus clientes |
| **I01** | Construcciones | No aplica |
| **I02** | Mobilario y equipo de oficina | Si el cliente compra equipo |
| **I03** | Equipo de cómputo | Si vendes equipo |
| **D01** | Honorarios médicos | No aplica |
| **P01** | Por definir | Cuando el cliente no sabe |

---

## PROCESO PASO A PASO

### Opción 1: Usando FacturAPI

1. **Crear cuenta** en https://facturapi.io
2. **Configurar** tu RFC y datos fiscales
3. **Agregar clientes** con sus datos fiscales
4. **Crear factura:**
   - Seleccionar cliente
   - Agregar concepto: "Servicio de desarrollo web"
   - Clave SAT: 81112100 — Desarrollo de software bajo contrato
   - Unidad: E48 — Servicio
   - Cantidad: 1
   - Precio unitario: $[monto]
   - IVA: 16% (si aplica)
5. **Generar** CFDI 4.0
6. **Descargar** XML y PDF
7. **Enviar** al cliente

### Opción 2: Usando Factura Directa (Gratis limitado)

1. **Crear cuenta** en https://facturadirecta.com
2. **Configurar** datos fiscales
3. **Generar factura** igual que FacturAPI
4. **Descargar** y enviar

---

## ESTRUCTURA DE UNA FACTURA

```
═══════════════════════════════════════════
         FACTURA ELECTRÓNICA (CFDI 4.0)
═══════════════════════════════════════════

Folio fiscal: [UUID único]
Serie: A
Folio: 001
Fecha de emisión: ___/___/______ ___:____
Lugar de expedición: [CP del emisor]

───────────────────────────────────────────
EMISOR
───────────────────────────────────────────
RFC: [Tu RFC]
Nombre: [Tu nombre]
Régimen fiscal: 612

───────────────────────────────────────────
RECEPTOR
───────────────────────────────────────────
RFC: [RFC del cliente]
Nombre: [Nombre del cliente]
Régimen fiscal: [Régimen del cliente]
Domicilio fiscal: [CP del cliente]
Uso de CFDI: G03

───────────────────────────────────────────
CONCEPTOS
───────────────────────────────────────────
| Qty | Descripción | Precio Unit. | Importe |
|-----|-------------|--------------|---------|
| 1   | Servicio de desarrollo web — [proyecto] | $______ | $______ |

───────────────────────────────────────────
SUBTOTAL: $______ MXN
IVA (16%): $______ MXN
TOTAL: $______ MXN

───────────────────────────────────────────
Forma de pago: 03 — Transferencia electrónica
Método de pago: PUE — Pago en una sola exhibición
Tipo de cambio: 1 (si es en MXN)
Moneda: MXN

═══════════════════════════════════════════
       D.Softworks — Soluciones Digitales
═══════════════════════════════════════════
```

---

## CUÁNDO FACTURAR

| Momento | Qué facturar | Ejemplo |
|---------|--------------|---------|
| **Al recibir anticipo** | Solo el anticipo | $750 MXN (50% de $1,500) |
| **Al recibir saldo** | Solo el saldo | $750 MXN (50% restante) |
| **O factura completa** | Monto total | $1,500 MXN |

**Recomendación:** Facturar por cada pago recibido para mejor control.

---

## EJEMPLO PRÁCTICO

**Servicio:** Página web básica — $1,500 MXN

**Paso 1: Anticipo**
- Cliente paga: $750 MXN
- Facturar: $750 MXN
- Concepto: "Anticipo por servicios de desarrollo web — Página web [nombre del negocio]"

**Paso 2: Saldo**
- Cliente paga: $750 MXN
- Facturar: $750 MXN
- Concepto: "Saldo por servicios de desarrollo web — Página web [nombre del negocio]"

**O factura completa al inicio:**
- Facturar: $1,500 MXN
- Concepto: "Servicios de desarrollo web — Página web [nombre del negocio]"

---

## ERRORES COMUNES A EVITAR

| Error | Cómo evitarlo |
|-------|---------------|
| Facturar sin datos del cliente | Siempre pedir RFC antes de facturar |
| Usar clave de producto incorrecta | 81112100 para servicios de software |
| No incluir IVA | Verificar si el cliente requiere factura con IVA |
| Facturar con fecha incorrecta | Usar la fecha real de pago |
| No guardar XML | Guardar siempre el XML en la carpeta del cliente |

---

## CHECKLIST ANTES DE ENVIAR FACTURA

- [ ] Datos del emisor correctos
- [ ] RFC del cliente correcto
- [ ] Nombre del cliente correcto
- [ ] Régimen fiscal del cliente correcto
- [ ] Descripción clara del servicio
- [ ] Monto correcto
- [ ] IVA incluido (si aplica)
- [ ] Forma de pago correcta
- [ ] Método de pago correcto
- [ ] XML descargado y guardado
- [ ] PDF descargado y listo para enviar

---

**D.Softworks — Soluciones Digitales**
**Guadalajara, Jalisco, México**
**@d.softworks**