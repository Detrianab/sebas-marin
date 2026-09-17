# Rediseño luxury y asesor flotante — Sabas Marin

## Resultado
Transformar la portada actual en una experiencia editorial y cinematográfica, más rápida y claramente premium, manteniendo el cotizador y el acceso por correo existentes.

## Cambios visuales
- Replantear la portada como una narrativa de desplazamiento: hero inmersivo, títulos de gran escala, capas fotográficas, transiciones entre secciones y bloques de servicio con mayor jerarquía visual.
- Añadir animación de texto y movimiento ligado al scroll con GSAP, con una versión reducida para personas que prefieren menos movimiento.
- Mejorar el precargador con una secuencia corta de marca y progreso visual; no retrasará artificialmente la entrada ni aparecerá de nuevo durante la misma visita.
- Refinar navegación, llamadas a cotizar, alianzas, trayectoria, preguntas y pie de página para que compartan una estética corporativa de lujo.

## Asesor virtual sin registro
- Añadir una burbuja flotante en toda la web pública que abra un panel de conversación y permita preguntar inmediatamente, sin cuenta.
- Mantener la página de acceso por correo existente para quien quiera conversaciones privadas con historial.
- Adaptar el servicio de IA para consultas anónimas sin guardar datos personales ni conversaciones, conservando el historial privado solo para usuarios registrados.
- Incluir límites y validación para evitar abuso, mensajes demasiado largos y solicitudes inválidas.

## Mapa de ubicación
- Crear el componente de mapa expandible solicitado dentro del sistema visual existente, usando la librería de animación ya instalada para evitar duplicar peso.
- Integrarlo como una sección moderna de ubicación con inclinación sutil, expansión y acceso directo al enlace de Google Maps suministrado.
- En móvil se mantendrá táctil, legible y sin efectos que dificulten el desplazamiento.

## Rendimiento y validación
- Cargar las imágenes y animaciones secundarias únicamente cuando hagan falta, eliminar retrasos artificiales y reducir trabajo durante el scroll.
- Evitar nuevas imágenes innecesarias: reutilizar el banco visual actual y recursos vectoriales ligeros.
- Validar portada, asesor anónimo, cotizador, mapa y navegación en móvil y escritorio; corregir desbordes y comprobar que no existan errores de carga.

## Nota técnica
El componente de mapa recibido está incompleto en su marcado. Se reconstruirá fielmente a su intención —mapa abstracto, expansión, perspectiva y estado “Live”— usando `motion/react`, que ya está incluido, en vez de instalar otra copia de la misma librería.
