# ⚙️ Métodos Seguidos en el Proceso, Metodologías y Tecnologías

## 📌 Metodología de Trabajo

Para organizar y estructurar el desarrollo del proyecto, se ha seguido una metodología ágil basada en **Scrum**, adaptada al contexto académico. Esta metodología permite trabajar de forma iterativa, dividiendo el proyecto en fases (sprints) semanales, con entregas parciales y revisiones frecuentes.

### Ventajas de aplicar Scrum:

- Flexibilidad para adaptar requisitos según el avance.
- Mejor gestión del tiempo mediante tareas semanales.
- Revisión continua del progreso.
- Mayor claridad en los objetivos y responsabilidades.

## 🔧 Tecnologías Utilizadas

Se ha realizado una selección cuidadosa de tecnologías con base en su robustez, documentación, comunidad y compatibilidad con el propósito del proyecto.

### Backend: `Spring Boot (Java)`
**Justificación:**

- Permite crear APIs REST de manera estructurada y eficiente.
- Es compatible con JWT y OAuth2 (para login seguro).
- Alta escalabilidad, ideal para aplicaciones empresariales.
- Gran comunidad de soporte y documentación.

### Base de Datos: `MySQL`
**Justificación:**

- Base de datos relacional ampliamente utilizada.
- Integración directa y fluida con Spring Boot.
- Ideal para estructuras de datos con relaciones como productos, usuarios y roles.

### Autenticación: `JWT + OAuth2 (Google)`
**Justificación:**

- JWT permite autenticación sin necesidad de sesiones en el servidor.
- OAuth2 ofrece la opción de iniciar sesión con Google, mejorando la experiencia del usuario.
- Seguridad moderna y estándar en desarrollo web.

### Frontend: `React Native`
**Justificación:**

- Permite desarrollar apps móviles para Android e iOS con una sola base de código.
- Basado en JavaScript, con gran documentación y comunidad.
- Excelente rendimiento para aplicaciones móviles simples e interactivas.
- Integración sencilla con APIs REST mediante `axios` u otras librerías.

## 🔁 Flujo General del Desarrollo

1. **Planificación del proyecto:** análisis de viabilidad, selección tecnológica, definición de objetivos.
2. **Diseño de arquitectura:** esquemas de base de datos, flujo de navegación, wireframes de la app.
3. **Desarrollo Backend:** creación de endpoints REST, implementación de seguridad (JWT, roles).
4. **Desarrollo Frontend:** diseño de pantallas móviles, integración con la API.
5. **Pruebas:** verificación de funcionalidad con Postman y dispositivos/emuladores móviles.
6. **Documentación:** redacción estructurada en Markdown, incluyendo capturas y explicaciones.

## 🧠 Decisiones Clave

- Se eligió **React Native** en lugar de Flutter o Kotlin para facilitar el desarrollo con conocimientos previos en JavaScript.
- Se usó **Spring Boot** por su fiabilidad y modularidad, en vez de alternativas como Node.js.
- La base de datos **MySQL** fue preferida sobre MongoDB por requerimientos relacionales del sistema (usuarios-productos).

