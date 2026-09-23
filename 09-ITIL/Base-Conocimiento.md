# D.Softworks — Base de Conocimiento

**Propósito:** Documentar soluciones a problemas comunes, guías y mejores prácticas para acceso rápido.

---

## ESTRUCTURA

```
📁 Base de Conocimiento/
├── 📁 Problemas Conocidos/
│   ├── Sitio-caido-Netlify.md
│   ├── SSL-vencido.md
│   ├── Formulario-no-funciona.md
│   └── Dominio-no-apunta.md
├── 📁 Soluciones/
│   ├── Configurar-Netlify.md
│   ├── Configurar-SSL.md
│   ├── Configurar-dominio.md
│   └── Configurar-Supabase.md
└── 📁 Guias/
    ├── Checklist-pre-entrega.md
    ├── Guia-Despliegue.md
    └── Guia-Postventa.md
```

---

## PROBLEMAS CONOCIDOS

### Sitio caído en Netlify

**Síntomas:**
- El sitio no carga
- Error 404 o 502
- El cliente reporta que "no funciona"

**Causas posibles:**
1. Límite de bandwidth excedido (plan gratuito: 100GB/mes)
2. Build fallido en GitHub
3. Configuración de dominio incorrecta
4. Archivos corruptos en el repositorio

**Solución paso a paso:**
1. Entrar a Netlify → Seleccionar sitio → Deploys
2. Verificar si hay builds fallidos (aparecen en rojo)
3. Si hay build fallido: revisar logs, corregir error, redeploy
4. Si no hay build fallido: revisar configuración de dominio
5. Verificar que el dominio apunta a Netlify (DNS)
6. Probar en diferentes dispositivos

**Prevención:**
- Monitorear builds semanalmente
- Mantener repositorio limpio
- Usar Netlify CLI para deploys locales antes de push

---

### SSL vencido o no funciona

**Síntomas:**
- Navegador muestra "No seguro"
- Certificado con errores
- Formularios no funcionan en HTTPS

**Causas posibles:**
1. SSL no configurado en Netlify
2. Dominio no verificado
3. Configuración DNS incorrecta
4. Cache del navegador

**Solución paso a paso:**
1. Netlify → Site settings → Domain management
2. Verificar que SSL está habilitado (Let's Encrypt)
3. Si no está: clic en "Verify DNS configuration"
4. Esperar 5-15 minutos para propagación
5. Limpiar cache del navegador
6. Probar en modo incógnito

---

### Formulario no funciona

**Síntomas:**
- El formulario no envía datos
- No se reciben emails de contacto
- Error al enviar

**Causas posibles:**
1. Configuración de Netlify Forms incorrecta
2. Campo `netlify` no está en el tag form
3. Nombre del campo incorrecto
4. JavaScript bloqueando el envío

**Solución paso a paso:**
1. Verificar que el tag `<form>` tiene `data-netlify="true"`
2. Verificar que el campo `name` está presente
3. Revisar que los campos tienen `name` attribute
4. Probar el formulario en producción
5. Revisar Netlify → Forms para ver envíos

---

### Dominio no apunta

**Síntomas:**
- El sitio no carga con el dominio personalizado
- Error "This site can't be reached"
- El dominio muestra contenido diferente

**Causas posibles:**
1. DNS no propagado (puede tardar hasta 48h)
2. Nameserver incorrecto
3. Registro A o CNAME mal configurado
4. Dominio expirado

**Solución paso a paso:**
1. Verificar en Namecheap que el dominio está activo
2. Revisar DNS: debe apuntar a Netlify (CNAME o A record)
3. Si usa CNAME: `www` → `tu-sitio.netlify.app`
4. Si usa A records: apuntar a IPs de Netlify
5. Esperar propagación (usar https://dnschecker.org)
6. Verificar en Netlify que el dominio está agregado

---

## SOLUCIONES

### Configurar Netlify para un proyecto

1. Crear cuenta en Netlify (si no existe)
2. Conectar repositorio de GitHub
3. Seleccionar rama principal (main)
4. Configurar build command (generalmente vacío para HTML estático)
5. Configurar publish directory (raíz o /dist)
6. Activar deploy automático
7. Probar en la URL generada

### Configurar dominio en Namecheap

1. Entrar a Namecheap → Domain List
2. Seleccionar dominio → Advanced DNS
3. Agregar registro:
   - Tipo: CNAME
   - Host: www
   - Value: tu-sitio.netlify.app
   - TTL: Automatic
4. Guardar cambios
5. Esperar propagación

### Configurar Supabase

1. Crear proyecto en Supabase
2. Obtener URL y anon key
3. Configurar variables de entorno
4. Crear tablas necesarias
5. Configurar Row Level Security (RLS)
6. Probar conexión

---

## GUÍAS

### Checklist Pre-Entrega

- [ ] Código revisado (sin errores evidentes)
- [ ] Responsive probado (móvil, tablet, desktop)
- [ ] Formulario funcionando
- [ ] Enlace a WhatsApp funcionando
- [ ] SSL activo (https://)
- [ ] Velocidad de carga aceptable (< 3s)
- [ ] Imágenes optimizadas
- [ ] Textos revisados (sin errores)
- [ ] Links internos funcionando
- [ ] Google Analytics instalado (si aplica)

### Guía de Despliegue

1. Crear rama feature/ o fix/
2. Desarrollar cambios
3. Probar localmente
4. Hacer push a GitHub
5. Verificar deploy automático en Netlify
6. Probar en producción
7. Si todo está bien: merge a main
8. Documentar cambio

### Guía de Postventa

1. **Día 0:** Entregar, cobrar, capacitar
2. **Día 7:** Seguimiento rápido (¿funciona?)
3. **Día 30:** Seguimiento + oportunidad de servicio
4. **Día 60:** Ofrecer mantenimiento
5. **Mes 3+:** Revisión trimestral, ofrecer mejoras

---

**D.Softworks — Soluciones Digitales**
**Última actualización:** 22 de septiembre de 2026