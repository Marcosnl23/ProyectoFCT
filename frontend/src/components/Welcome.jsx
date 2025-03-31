import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./NavBar"; 
import logo from '../assets/logo.png';


function Welcome() {
  const [username, setUsername] = useState("");
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || decodedToken.username);
        setNombre(decodedToken.nombre || '');
        setApellidos(decodedToken.apellidos || '');
        setEmail(decodedToken.email || '');

        if (decodedToken.authorities && Array.isArray(decodedToken.authorities)) {
          setRol(decodedToken.authorities[0].authority || "USER");
        } else if (typeof decodedToken.role === "string") {
          setRol(decodedToken.role);
        } else {
          setRol("USER");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setRol("USER");
      }
    }
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await axios.get('http://localhost:8080/api/productos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProductos(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los productos:', err);
        setError('Error al cargar los productos. Por favor, intente más tarde.');
        setLoading(false);
      
      }
    };

    fetchProductos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <NavBar 
        logo={logo} 
        username={username} 
        nombre={nombre} 
        apellidos={apellidos} 
        email={email} 
        rol={rol} 
        onLogout={handleLogout} 
      />
      <Container className="py-4" style={{ marginBottom: '60px' }}>
        <Row xs={1} md={2} lg={3} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.id}>
              <Card className="h-100 shadow-sm hover-effect">
                <div className="card-img-container" style={{ height: '300px', overflow: 'hidden' }}>
                  <Card.Img 
                    variant="top" 
                    src={producto.imagenUrl} 
                    alt={producto.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fs-5 mb-2">{producto.nombre}</Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    {producto.descripcion}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0 text-primary">{producto.precio}€</span>
                    <span className="badge bg-secondary">
                      {producto.categoria}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Welcome;