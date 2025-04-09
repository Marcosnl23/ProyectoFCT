import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Welcome from './components/Welcome'
import Register from './components/auth/Register'
import CategoriaProductos from './components/CategoriaProductos'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/categoria/:categoriaId" element={<CategoriaProductos />} />
      </Routes>
    </Router>
  )
}

export default App