// Importaciones necesarias para crear el store
import { create } from "zustand"; // Librería de gestión de estado
import { persist } from "zustand/middleware"; // Middleware para persistencia
import { jwtDecode } from "jwt-decode"; // Utilidad para decodificar JWT

// Función para generar una clave única de almacenamiento basada en el usuario
const generateStorageKey = () => {
  const token = localStorage.getItem("token");
  if (!token) return "carrito-anonimo"; // Clave para usuarios no autenticados
  
  try {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.sub || decodedToken.username;
    return `carrito_${username}`; // Clave única por usuario
  } catch {
    return "carrito-anonimo"; // Fallback si hay error al decodificar
  }
};

// Generar la clave de almacenamiento
const storageKey = generateStorageKey();

// Crear el store con persistencia
const useCarritoStore = create(
  persist(
    (set, get) => ({
      // Estado inicial del carrito
      carrito: [],

      // Función para añadir productos al carrito
      addToCarrito: (producto, tallaId) => {
        const carritoActual = get().carrito;
        // Buscar si el producto ya existe con la misma talla
        const productoExistente = carritoActual.find(
          (item) => item.id === producto.id && item.tallaId === tallaId
        );

        if (productoExistente) {
          // Si existe, incrementar cantidad
          const carritoActualizado = carritoActual.map((item) =>
            item.id === producto.id && item.tallaId === tallaId
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
          set({ carrito: carritoActualizado });
        } else {
          // Si no existe, añadir nuevo producto
          set({
            carrito: [
              ...carritoActual,
              { ...producto, tallaId, cantidad: 1 },
            ],
          });
        }
      },

      // Función para eliminar productos del carrito
      removeFromCarrito: (productoId, tallaId) => {
        const carritoActual = get().carrito;
        const carritoActualizado = carritoActual.filter(
          (item) => item.id !== productoId || item.tallaId !== tallaId
        );
        set({ carrito: carritoActualizado });
      },

      // Función para vaciar el carrito
      clearCarrito: () => {
        set({ carrito: [] });
      },

      // Función para crear un pedido
      crearPedido: async () => {
        // Verificar autenticación
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        // Obtener username del token
        let username;
        try {
          const decodedToken = jwtDecode(token);
          username = decodedToken.sub;
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          return;
        }

        // Verificar que hay productos en el carrito
        const carrito = get().carrito;
        if (carrito.length === 0) {
          console.error("El carrito está vacío.");
          return;
        }

        // Calcular total del pedido
        const total = carrito.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );

        // Generar fecha actual en formato ISO
        const now = new Date();
        const fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .replace("Z", "");

        try {
          // Enviar pedido al servidor
          const pedidoResponse = await fetch(
            "http://localhost:8080/api/pedidos",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                username,
                total,
                fecha,
                detalles: carrito.map((producto) => ({
                  productoId: producto.id,
                  tallaId: producto.tallaId,
                  cantidad: producto.cantidad,
                  precio: producto.precio,
                })),
              }),
            }
          );

          // Verificar respuesta
          if (!pedidoResponse.ok) {
            throw new Error("Error al crear el pedido");
          }

          const pedido = await pedidoResponse.json();

          // Limpiar carrito tras pedido exitoso
          set({ carrito: [] });
          console.log("Pedido creado con éxito:", pedido);
        } catch (error) {
          console.error("Error al crear el pedido:", error);
        }
      },
    }),
    {
      // Configuración de persistencia
      name: storageKey, // Clave única por usuario
      getStorage: () => localStorage, // Usar localStorage
    }
  )
);

export default useCarritoStore;