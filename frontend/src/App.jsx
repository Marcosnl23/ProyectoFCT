import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Welcome from './components/Welcome';
import Register from './components/auth/Register';
import CategoriaProductos from './components/CategoriaProductos';
import BusquedaProductos from './components/BusquedaProductos';
import Favoritos from './components/Favoritos';
import Carrito from './components/Carrito';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HistorialPedidos from '../src/components/HistorialPedidos';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/categoria/:categoriaId" element={<CategoriaProductos />} />
          <Route path="/buscar" element={<BusquedaProductos />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/cart" element={<Carrito />} />
          <Route path="/historial" element={<HistorialPedidos/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;