import { create } from "zustand";
import { persist } from "zustand/middleware";
import {jwtDecode} from "jwt-decode";

// Generar la clave dinámica para localStorage
const generateStorageKey = () => {
  const token = localStorage.getItem("token");
  if (!token) return "favoritos-anonimo";
  try {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.sub || decodedToken.username; // Ajusta según el campo del token
    return `favoritos_${username}`;
  } catch {
    return "favoritos-anonimo";
  }
};

const storageKey = generateStorageKey(); // Generar la clave antes de inicializar el store

const useFavoritosStore = create(
  persist(
    (set, get) => ({
      favoritos: [], // Estado inicial vacío

      // Alternar un producto en favoritos
      toggleFavorito: async (productoId) => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        // Decodificar el token para obtener el username
        let username;
        try {
          const decodedToken = jwtDecode(token);
          username = decodedToken.sub || decodedToken.username; // Ajusta según el campo del token
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          return;
        }

        const favoritosUsuario = get().favoritos;

        // Verificar si el producto ya está en favoritos
        const esFavorito = favoritosUsuario.includes(productoId);

        try {
          // Sincronizar con el backend
          const response = await fetch(
            `http://localhost:8080/api/favoritos?username=${username}&productoId=${productoId}`,
            {
              method: esFavorito ? "DELETE" : "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error al sincronizar con el backend");
          }

          // Actualizar los favoritos en el estado solo si la operación fue exitosa
          const nuevosFavoritos = esFavorito
            ? favoritosUsuario.filter((id) => id !== productoId) // Eliminar si ya está en favoritos
            : [...favoritosUsuario, productoId]; // Añadir si no está en favoritos

          set({ favoritos: nuevosFavoritos });

          // Sincronizar con localStorage manualmente
          const storage = localStorage.getItem(storageKey);
          const parsedStorage = storage ? JSON.parse(storage) : {};
          parsedStorage.favoritos = nuevosFavoritos;
          localStorage.setItem(storageKey, JSON.stringify(parsedStorage));
        } catch (err) {
          console.error("Error al sincronizar favoritos con el backend:", err);
        }
      },

      // Cargar favoritos desde el backend
      cargarFavoritos: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        // Decodificar el token para obtener el username
        let username;
        try {
          const decodedToken = jwtDecode(token);
          username = decodedToken.sub || decodedToken.username; // Ajusta según el campo del token
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          return;
        }

        try {
          // Obtener los favoritos del backend
          const response = await fetch(
            `http://localhost:8080/api/favoritos?username=${username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error al cargar favoritos desde el backend");
          }

          const favoritos = await response.json();
          set({ favoritos }); // Actualizar el estado con los favoritos obtenidos

          // Sincronizar con localStorage manualmente
          const storage = localStorage.getItem(storageKey);
          const parsedStorage = storage ? JSON.parse(storage) : {};
          parsedStorage.favoritos = favoritos;
          localStorage.setItem(storageKey, JSON.stringify(parsedStorage));
        } catch (err) {
          console.error("Error al cargar favoritos desde el backend:", err);
        }
      },
    }),
    {
      name: storageKey, // Usar la clave generada dinámicamente
      getStorage: () => localStorage, // Usar localStorage como almacenamiento
      partialize: (state) => ({ favoritos: state.favoritos }), // Persistir solo el estado de favoritos
    }
  )
);

export default useFavoritosStore;