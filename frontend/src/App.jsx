import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Welcome from './components/Welcome';
import Register from './components/auth/Register';
import CategoriaProductos from './components/CategoriaProductos';
import BusquedaProductos from './components/BusquedaProductos';
import Favoritos from './components/Favoritos';
import axios from 'axios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/categoria/:categoriaId" element={<CategoriaProductos />} />
        <Route path="/buscar" element={<BusquedaProductos />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </Router>
  );
}

export default App;