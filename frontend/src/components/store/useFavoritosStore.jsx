// Importaciones necesarias
import { create } from "zustand"; // Librería para gestión de estado
import { persist } from "zustand/middleware"; // Middleware para persistencia
import { jwtDecode } from "jwt-decode"; // Decodificador de JWT

// Función para generar clave única de almacenamiento por usuario
const generateStorageKey = () => {
  const token = localStorage.getItem("token");
  if (!token) return "favoritos-anonimo"; // Clave para usuarios no autenticados
  
  try {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.sub || decodedToken.username;
    return `favoritos_${username}`; // Clave única por usuario
  } catch {
    return "favoritos-anonimo"; // Fallback si hay error
  }
};

// Crear store con persistencia
const useFavoritosStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      favoritos: [], // Array de IDs de productos favoritos
      isLoading: false, // Estado de carga
      error: null, // Estado de error

      // Alternar producto como favorito
      toggleFavorito: async (productoId) => {
        const token = localStorage.getItem("token");
        if (!token) {
          // Manejo local sin autenticación
          const favoritosActuales = get().favoritos;
          const esFavorito = favoritosActuales.includes(productoId);
          const nuevosFavoritos = esFavorito
            ? favoritosActuales.filter((id) => id !== productoId)
            : [...favoritosActuales, productoId];
          set({ favoritos: nuevosFavoritos });
          return;
        }

        // Manejo con autenticación
        set({ isLoading: true, error: null });
        try {
          // Obtener datos del usuario
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub || decodedToken.username;
          const favoritosActuales = get().favoritos;
          const esFavorito = favoritosActuales.includes(productoId);

          // Llamada al backend
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

          if (!response.ok) throw new Error("Error al sincronizar con el backend");

          // Actualizar estado local
          const nuevosFavoritos = esFavorito
            ? favoritosActuales.filter((id) => id !== productoId)
            : [...favoritosActuales, productoId];

          set({ favoritos: nuevosFavoritos, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error("Error en toggleFavorito:", error);
        }
      },

      // Cargar favoritos del servidor
      cargarFavoritos: async () => {
        const token = localStorage.getItem("token");
        if (!token) return; // Mantener favoritos locales sin token

        set({ isLoading: true, error: null });
        try {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub || decodedToken.username;

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

          if (!response.ok) throw new Error("Error al cargar favoritos");

          const favoritos = await response.json();
          set({ favoritos, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error("Error en cargarFavoritos:", error);
        }
      },

      // Limpiar lista de favoritos
      limpiarFavoritos: () => {
        set({ favoritos: [], error: null });
      },

      // Obtener cantidad de favoritos
      getFavoritosCount: () => {
        return get().favoritos.length;
      },

      // Verificar si un producto es favorito
      esFavorito: (productoId) => {
        return get().favoritos.includes(productoId);
      }
    }),
    {
      // Configuración de persistencia
      name: generateStorageKey(), // Clave única por usuario
      getStorage: () => localStorage, // Usar localStorage
      partialize: (state) => ({
        favoritos: state.favoritos // Solo persistir array de favoritos
      })
    }
  )
);

export default useFavoritosStore;