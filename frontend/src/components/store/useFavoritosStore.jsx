import { create } from "zustand";
import {jwtDecode} from "jwt-decode"; // Asegúrate de tener instalada esta librería

const useFavoritosStore = create((set) => ({
  favoritos: [], // Estado inicial vacío
  setFavoritos: (favoritos) => set({ favoritos }), // Establecer favoritos desde el backend
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

    // Obtener los favoritos específicos del usuario desde el localStorage
    const favoritosKey = `favoritos_${username}`;
    const favoritosUsuario =
      JSON.parse(localStorage.getItem(favoritosKey)) || [];

    // Verificar si el producto ya está en favoritos
    const esFavorito = favoritosUsuario.includes(productoId);

    try {
      // Sincronizar con el backend
      const response = await fetch(
        `http://localhost:8080/api/favoritos?username=${username}&productoId=${productoId}`,
        {
          method: esFavorito ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al sincronizar con el backend");
      }

      // Actualizar los favoritos en el localStorage y el estado solo si la operación fue exitosa
      const nuevosFavoritos = esFavorito
        ? favoritosUsuario.filter((id) => id !== productoId) // Eliminar si ya está en favoritos
        : [...favoritosUsuario, productoId]; // Añadir si no está en favoritos

      localStorage.setItem(favoritosKey, JSON.stringify(nuevosFavoritos));
      set({ favoritos: nuevosFavoritos });
    } catch (err) {
      console.error("Error al sincronizar favoritos con el backend:", err);
    }
  },
  cargarFavoritos: () => {
    // Cargar los favoritos específicos del usuario desde el localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicie sesión.");
      return [];
    }

    let username;
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.sub || decodedToken.username; // Ajusta según el campo del token
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return [];
    }

    const favoritosKey = `favoritos_${username}`;
    const favoritosUsuario =
      JSON.parse(localStorage.getItem(favoritosKey)) || [];
    set({ favoritos: favoritosUsuario });
  },
}));

export default useFavoritosStore;