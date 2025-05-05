# 🔍 Investigación de Estudios y Proyectos Similares

Antes de desarrollar la aplicación de tienda de ropa, se realizó una investigación sobre proyectos y plataformas similares ya existentes en el mercado. El objetivo fue identificar buenas prácticas, tecnologías utilizadas y características comunes que puedan servir de inspiración o referencia para nuestro propio desarrollo.

## 🛍️ Aplicaciones y plataformas similares

### 1. **Shein**
- **Descripción**: Tienda de moda en línea globalmente reconocida por sus precios accesibles.
- **Características clave**:
  - Navegación por categorías de ropa.
  - Filtro avanzado por talla, color, tipo, etc.
  - Carrito de compras y proceso de pago integrado.
  - Aplicación móvil nativa para Android e iOS.
- **Tecnologías conocidas**: React Native para la app y microservicios en el backend.
- **Lo que aprendemos**:
  - Importancia de una experiencia móvil fluida.
  - Recomendaciones personalizadas según preferencias.

### 2. **Zalando**
- **Descripción**: Gran plataforma europea de venta de ropa y accesorios.
- **Características clave**:
  - Perfil de usuario completo con historial de pedidos.
  - Gestión de devoluciones y métodos de pago diversos.
  - Panel administrativo complejo con herramientas analíticas.
- **Tecnologías conocidas**: Arquitectura basada en microservicios; React en frontend.
- **Lo que aprendemos**:
  - Gestión de usuarios y roles.
  - Sistema robusto de autenticación y administración.


---

## 🧠 Conclusiones de la investigación

- Casi todas las aplicaciones exitosas integran **login social (Google, Facebook)**, además del tradicional con email.
- Los sistemas de **carrito, pago y gestión de usuarios** son estándar en todas las plataformas.
- La mayoría cuenta con un **panel de administración exclusivo** para gestionar productos, usuarios y estadísticas.
- En cuanto a tecnologías, se repite el uso de:
  - **React o React Native** en el frontend.
  - **Spring Boot / Node.js** en el backend.
  - Bases de datos **relacionales (MySQL, PostgreSQL)**.
- La **seguridad** es un factor clave: se usan JWT, OAuth2 y roles de usuario.

---

## 🧭 Aplicación de lo aprendido

Nuestro proyecto se basa en las mejores prácticas de estas plataformas:
- Uso de **JWT** para autenticación segura.
- Login tradicional y con **Google**.
- Interfaz desarrollada en **React Native**, optimizada para móviles.
- Panel de administración con funcionalidades diferenciadas por **roles** (admin/user).
- Backend robusto con **Spring Boot** y base de datos **MySQL**.

