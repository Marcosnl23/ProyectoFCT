// Importaciones principales de React y Router
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importaciones de componentes de autenticación
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Importaciones de componentes para usuarios
import Welcome from "./components/Pages/Users/Welcome";
import CategoriaProductos from "./components/Pages/Users/CategoriaProductos";
import BusquedaProductos from "./components/Pages/Users/BusquedaProductos";
import Favoritos from "./components/Pages/Users/Favoritos";
import Carrito from "./components/Pages/Users/Carrito";
import HistorialPedidos from "./components/Pages/Users/HistorialPedidos";

// Importaciones de componentes administrativos
import AdminLayout from "../src/components/admin/AdminLayout";
import ProductosAdmin from "../src/components/pages/admin/ProductosAdmin";
import UsuariosAdmin from "../src/components/pages/admin/UsuariosAdmin";
import PedidosAdmin from "../src/components/pages/admin/PedidosAdmin";
import CategoriasAdmin from "../src/components/pages/admin/CategoriasAdmin";
import TallasAdmin from "../src/components/pages/admin/TallasAdmin";

// Importaciones para notificaciones
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* Configuración del sistema de notificaciones */}
      <ToastContainer position="top-center" autoClose={2000} />

      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas (requieren autenticación) */}
          <Route element={<ProtectedRoute />}>
            {/* Rutas de usuario */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/categoria/:categoriaId" element={<CategoriaProductos />} />
            <Route path="/buscar" element={<BusquedaProductos />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/cart" element={<Carrito />} />
            <Route path="/historial" element={<HistorialPedidos />} />

            {/* Rutas de administrador (requieren rol de admin) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<ProductosAdmin />} />
                <Route path="productos" element={<ProductosAdmin />} />
                <Route path="usuarios" element={<UsuariosAdmin />} />
                <Route path="pedidos" element={<PedidosAdmin />} />
                <Route path="categorias" element={<CategoriasAdmin />} />
                <Route path="tallas" element={<TallasAdmin />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;