import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

const generateStorageKey = () => {
  const token = localStorage.getItem("token");
  if (!token) return "favoritos-anonimo";
  try {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.sub || decodedToken.username;
    return `favoritos_${username}`;
  } catch {
    return "favoritos-anonimo";
  }
};

const useFavoritosStore = create(
  persist(
    (set, get) => ({
      favoritos: [],
      isLoading: false,
      error: null,

      toggleFavorito: async (productoId) => {
        const token = localStorage.getItem("token");
        if (!token) {
          // Manejar favoritos localmente si no hay token
          const favoritosActuales = get().favoritos;
          const esFavorito = favoritosActuales.includes(productoId);
          const nuevosFavoritos = esFavorito
            ? favoritosActuales.filter((id) => id !== productoId)
            : [...favoritosActuales, productoId];
          set({ favoritos: nuevosFavoritos });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub || decodedToken.username;
          const favoritosActuales = get().favoritos;
          const esFavorito = favoritosActuales.includes(productoId);

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

          const nuevosFavoritos = esFavorito
            ? favoritosActuales.filter((id) => id !== productoId)
            : [...favoritosActuales, productoId];

          set({ favoritos: nuevosFavoritos, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          console.error("Error en toggleFavorito:", error);
        }
      },

      cargarFavoritos: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          // Si no hay token, mantener los favoritos locales
          return;
        }

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

      limpiarFavoritos: () => {
        set({ favoritos: [], error: null });
      },

      getFavoritosCount: () => {
        return get().favoritos.length;
      },

      esFavorito: (productoId) => {
        return get().favoritos.includes(productoId);
      }
    }),
    {
      name: generateStorageKey(),
      getStorage: () => localStorage,
      partialize: (state) => ({
        favoritos: state.favoritos
      })
    }
  )
);

export default useFavoritosStore;