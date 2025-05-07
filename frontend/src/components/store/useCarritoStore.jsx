import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

// Generar la clave dinámica para localStorage
const generateStorageKey = () => {
  const token = localStorage.getItem("token");
  if (!token) return "carrito-anonimo";
  try {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.sub || decodedToken.username;
    return `carrito_${username}`;
  } catch {
    return "carrito-anonimo";
  }
};

const storageKey = generateStorageKey();

const useCarritoStore = create(
  persist(
    (set, get) => ({
      carrito: [],

      // Añadir un producto al carrito
      addToCarrito: (producto) => {
        const carritoActual = get().carrito;
        const productoExistente = carritoActual.find(
          (item) => item.id === producto.id
        );

        if (productoExistente) {
          const carritoActualizado = carritoActual.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
          set({ carrito: carritoActualizado });
        } else {
          set({ carrito: [...carritoActual, { ...producto, cantidad: 1 }] });
        }
      },

      // Eliminar un producto del carrito
      removeFromCarrito: (productoId) => {
        const carritoActual = get().carrito;
        const carritoActualizado = carritoActual.filter(
          (item) => item.id !== productoId
        );
        set({ carrito: carritoActualizado });
      },

      // Vaciar el carrito
      clearCarrito: () => {
        set({ carrito: [] });
      },

      // Crear un pedido
      crearPedido: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        let username;
        try {
          const decodedToken = jwtDecode(token);
          username = decodedToken.sub; // Usar el campo `sub` como el username
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          return;
        }

        const carrito = get().carrito;
        if (carrito.length === 0) {
          console.error("El carrito está vacío.");
          return;
        }

        // Calcular el total del pedido
        const total = carrito.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );

      
        const now = new Date();
        const fecha = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
          .toISOString()
          .replace('Z', '');

        try {
          // Crear el pedido
          const pedidoResponse = await fetch(
            "http://localhost:8080/api/pedidos",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ username, total, fecha }),
            }
          );

          if (!pedidoResponse.ok) {
            throw new Error("Error al crear el pedido");
          }

          const pedido = await pedidoResponse.json();


          for (const producto of carrito) {
            await fetch("http://localhost:8080/api/detalles-pedido", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                pedido: { id: pedido.id },
                producto: { id: producto.id },
                cantidad: producto.cantidad,
                precio: producto.precio,
              }),
              
            });
            
          }

          // Vaciar el carrito después de realizar el pedido
          set({ carrito: [] });
          console.log("Pedido creado con éxito:", pedido);
        } catch (error) {
          console.error("Error al crear el pedido:", error);
        }
      },
    }),
    {
      name: storageKey,
      getStorage: () => localStorage,
    }
  )
);

export default useCarritoStore;
