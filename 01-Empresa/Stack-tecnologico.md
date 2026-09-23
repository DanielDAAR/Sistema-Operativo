# D.Softworks — Stack Tecnológico

## REFERENCIA RÁPIDA

### Nuestras Herramientas

| Herramienta | Para qué la usamos | Costo |
|-------------|-------------------|-------|
| **GitHub** | Guardar código, historial, trabajo en equipo | GRATIS |
| **Netlify** | Hosting, despliegue, SSL | GRATIS |
| **Supabase** | Base de datos, auth, almacenamiento | GRATIS (plan básico) |
| **Namecheap** | Comprar dominios | ~$150 MXN/año |
| **VS Code** | Editor de código | GRATIS |
| **Canva** | Imágenes para redes | GRATIS |

---

## FLUJO DE TRABAJO

```
CÓDIGO → GitHub → Netlify → SITIO WEB EN PRODUCCIÓN
```

### Paso a paso:
1. **Escribir código** en VS Code
2. **Subir a GitHub** (commit + push)
3. **Netlify detecta el cambio** y publica automáticamente
4. **El sitio está online** con SSL incluido

---

## CUÁNDO USAR CADA HERRAMIENTA

### Para páginas web estáticas (informativas):
```
GitHub + Netlify
```
- Páginas de negocios
- Landing pages
- Portafolios
- Sitios informativos

**NO necesitan Supabase**

### Para aplicaciones con base de datos:
```
GitHub + Netlify + Supabase
```
- Tiendas en línea
- Sistemas de reservación
- Portales de clientes
- Blogs con administración
- Formularios avanzados

**SÍ necesitan Supabase**

---

## COSTOS REALES

### Proyecto típico: Página web ($1,500 MXN)

| Concepto | Costo para nosotros | Costo para cliente |
|----------|---------------------|-------------------|
| Hosting (Netlify) | $0 | $0 (año 1) |
| Dominio (Namecheap) | ~$150 MXN | ~$150 MXN (después del año 1) |
| SSL (Netlify) | $0 | $0 |
| **Total** | **~$150 MXN** | **~$150 MXN** |

### Ganancia por proyecto:
- Ingreso: $1,500 MXN
- Costo dominio: ~$150 MXN
- **Ganancia neta: ~$1,350 MXN**

---

## VENTAJAS PARA EL CLIENTE

1. **Hosting GRATIS** el primer año (Netlify)
2. **SSL GRATIS** (certificado de seguridad)
3. **Velocidad excelente** (Netlify tiene CDN global)
4. **Despliegue automático** (cambios se publican al instante)
5. **Dominio propio** (~$150 MXN/año en Namecheap)

---

## QUÉ DECIRLE AL CLIENTE

### Sobre hosting:
> "Tu página web se aloja en Netlify, una de las plataformas más rápidas y seguras del mundo. El hosting está incluido el primer año."

### Sobre dominio:
> "El dominio (tunegocio.com) cuesta aproximadamente $150 MXN al año. Después del primer año, solo pagas eso para mantener tu sitio online."

### Sobre SSL:
> "Tu sitio tiene certificado de seguridad SSL incluido, eso significa que aparece con el candado verde y los datos de tus clientes están protegidos."

---

## CUÁNDO USAR SUPABASE

### SÍ usar para:
- Catálogo de productos que se actualiza frecuentemente
- Sistema de login (usuarios registrados)
- Formularios que guardan datos en base de datos
- Reservaciones en línea
- Contenido que el cliente puede editar

### NO usar para:
- Página web informativa básica
- Landing page simple
- Sitio que solo muestra información

---

## EJEMPLOS DE PROYECTOS

### Con GitHub + Netlify (sin Supabase):
- Página de barbería
- Landing page de dentist
- Portafolio de fotógrafo
- Sitio informativo de empresa

### Con GitHub + Netlify + Supabase:
- Tienda en línea con catálogo
- Sistema de reservación de citas
- Portal de clientes
- Blog con panel de administración
- Formulario de contacto que guarda datos

---

## COMANDOS ÚTILES

### Git básico:
```bash
git init                    # Iniciar repositorio
git add .                   # Agregar todos los archivos
git commit -m "mensaje"     # Guardar cambios
git push                    # Subir a GitHub
```

### Netlify CLI:
```bash
npm install -g netlify-cli
netlify init                # Conectar con Netlify
netlify deploy --prod       # Desplegar
```

---

## RECURSOS

- **GitHub:** github.com
- **Netlify:** netlify.com
- **Supabase:** supabase.com
- **Namecheap:** namecheap.com
- **VS Code:** code.visualstudio.com
- **Canva:** canva.com
