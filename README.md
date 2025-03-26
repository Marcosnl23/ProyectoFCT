# 🛍️ Tienda de Ropa - Proyecto DAM

Este es un proyecto de una tienda de ropa desarrollado con **React Native** para el frontend y **Spring Boot** para el backend.  
La autenticación de usuarios se maneja con **JWT**, y los roles de usuario incluyen **admin** y **user**.

---

## 🚀 Tecnologías utilizadas

### **Frontend** (📂 `/frontend`)
- **React Native** + Expo (para desarrollo móvil)
- Zustand (para manejar el estado global, carrito de compras)
- React Navigation (para navegación entre pantallas)
- Axios (para comunicación con la API)
- Styled Components o Tailwind para estilos

### **Backend** (📂 `/backend`)
- **Spring Boot** (Java 17)
- Spring Data JPA (para persistencia en MySQL)
- Spring Security + JWT (para autenticación)
- Lombok (para reducir código repetitivo)
- Maven (gestión de dependencias)

### **Base de datos**
- **MySQL** (📂 `/backend/src/main/resources/application.properties` contiene la configuración)

---

## 📌 Funcionalidades

### **Usuarios**
- Registro e inicio de sesión con JWT
- Roles: **admin** y **user**
- Admin puede gestionar productos y usuarios
- User puede explorar productos y comprar

### **Productos**
- Listado de productos con filtros
- Detalle de producto
- Agregar al carrito (estado gestionado con Zustand)
- Proceso de compra

### **Administración**
- Crear, editar y eliminar productos (Admin)
- Gestión de usuarios (Admin)

---
