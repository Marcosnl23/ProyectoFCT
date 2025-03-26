import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Welcome from './components/Welcome'
import Register from './components/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App