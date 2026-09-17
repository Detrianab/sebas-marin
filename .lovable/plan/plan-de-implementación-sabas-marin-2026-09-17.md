# Plan de implementación — Sabas Marin

## Objetivo
Crear una web móvil primero, moderna, tecnológica y corporativa de lujo para Sabas Marin, orientada a convertir visitas en solicitudes de cotización, con asesor virtual 24/7, formularios por ramo y seguimiento por correo y WhatsApp.

## Dirección visual
- Usar la identidad oficial: azul vívido `#0915af`, índigo `#090076`, azul profundo `#07014d`, blanco y acentos metálicos discretos.
- Incorporar los logotipos entregados según el fondo, además de favicon y precargador animado con la marca.
- Adaptar la referencia HTML a Sabas Marin: composición editorial, grandes titulares, navegación compacta, bloques de confianza y transiciones de scroll, sin copiar su contenido.
- Crear una secuencia principal cinematográfica con imágenes premium generadas y movimiento por capas, evitando el costo de generar video.
- Aplicar animaciones de entrada, texto, parallax y desplazamiento con GSAP, con versión reducida para usuarios que prefieran menos movimiento.
- Adaptar el pie de página cinematográfico solicitado a la marca, corrigiendo el código incompleto recibido, eliminando imports remotos incompatibles y manteniendo efectos magnéticos, marquesina, llamada a cotizar y datos regulatorios.

## Página principal orientada a ventas
- Navegación fija con accesos a Protección, Trayectoria, Aseguradoras, Cotizador, Preguntas frecuentes y Asesor 24/7.
- Primera pantalla con propuesta clara, más de 25 años de trayectoria, registro CAA-002911 y llamadas a “Cotizar ahora” y “Hablar con el asesor”.
- Secciones de confianza: misión, visión, propuesta de valor, proceso de asesoría y alianzas con Seguros Caracas, Oceánica, La Internacional y Mercantil Seguros.
- Catálogo visual y persuasivo para Salud, Automóvil, Hogar, Empresa, Accidentes, Vida y Gastos Funerarios, con mensajes específicos por necesidad y acceso directo al formulario correspondiente.
- Preguntas frecuentes en acordeón con todas las respuestas entregadas, redactadas y ordenadas para lectura rápida.
- Llamadas a la acción distribuidas sin saturar la página, WhatsApp visible y datos de contacto verificables.

## Cotizador multirramo
- Crear un flujo por pasos que primero seleccione el ramo y luego muestre únicamente los datos y coberturas aplicables.
- Incluir validación, selección múltiple de coberturas, datos familiares repetibles y comentarios.
- Mostrar un resumen antes de enviar y una confirmación clara después del envío.
- Guardar cada solicitud en Lovable Cloud con acceso restringido.
- Enviar la solicitud a `atencionalcliente@sabasmarin.com`, con copia a `gerencia@sabasmarin.com`.
- Al finalizar, ofrecer WhatsApp al `0412-2715331` con el resumen preparado; mantener el `0414-8697158` como contacto de copia/seguimiento interno indicado.
- Añadir consentimiento de contacto y aviso de que la solicitud no constituye emisión ni cobertura inmediata.

## Asesor virtual 24/7
- Activar Lovable Cloud para acceso por correo, historial seguro, cotizaciones y conversaciones.
- Crear registro/inicio de sesión por correo y proteger cada conversación por cliente.
- Implementar conversaciones separadas, cada una con URL propia, lista de conversaciones, creación, cambio, eliminación y restauración al recargar.
- Usar componentes oficiales de AI Elements para conversación, mensajes con Markdown, razonamiento visible, indicador “Pensando…”, controles de detener y compositor enfocado.
- Entrenar el comportamiento del asesor con misión, propuesta de valor, métodos de pago, clínicas/emergencias, siniestros, requisitos y todas las preguntas frecuentes entregadas.
- Limitar sus respuestas al contexto autorizado; cuando falte información, derivar a un asesor humano sin inventar coberturas, precios, clínicas o condiciones.
- Conectar el chat por streaming a Lovable AI, enviando el historial completo y mostrando errores reales de servicio o créditos.
- Guardar mensajes y conversaciones en Cloud con políticas de privacidad por usuario.

## Estructura y seguridad
- Crear tablas para perfiles mínimos, conversaciones, mensajes y solicitudes de cotización, con permisos explícitos y políticas que restrinjan cada registro a su propietario; las solicitudes también quedarán disponibles para el proceso interno de atención.
- Mantener claves y envío de correo exclusivamente del lado seguro del servidor.
- Añadir protección contra envíos duplicados, validación de datos y estados de error recuperables.
- Configurar títulos y descripciones sociales propios para cada página pública, acceso y conversación.

## Rendimiento y accesibilidad
- Priorizar móvil, imágenes optimizadas, carga diferida y animaciones activadas solo cuando sean visibles.
- Mantener alto contraste, navegación por teclado, etiquetas accesibles, áreas táctiles amplias y formularios legibles.
- Usar un banco visual pequeño y coherente para no saturar ni elevar innecesariamente los créditos.

## Validación final
- Probar página principal, navegación, precargador, cotizador completo de los siete ramos, envío por correo y apertura de WhatsApp.
- Probar registro, inicio de sesión, dos conversaciones independientes, persistencia tras recargar, respuestas FAQ, cancelación de una respuesta y separación de datos entre usuarios.
- Revisar visualmente en teléfono y escritorio, reducir movimiento, corregir desbordes y confirmar que no existan errores de carga ni compilación.

## Alcance acordado
- Conversaciones separadas con historial en Lovable Cloud.
- Acceso de clientes mediante correo.
- Cotizaciones enviadas por correo y continuadas por WhatsApp.
- Secuencia animada premium en lugar de video generado, para reducir créditos.
