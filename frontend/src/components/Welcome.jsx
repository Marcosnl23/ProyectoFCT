import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./NavBar";
import Footer from "./Footer"; 
import logo from "../assets/logo.png";
import ImageCarousel from "./Carousel";
import imagen1 from "../assets/image1.jpg";
import imagen2 from "../assets/image2.jpg";
import imagen3 from "../assets/image3.jpg";
import "../css/ProductoStyles.css";

function Welcome() {
  const [username, setUsername] = useState("");
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const images = [imagen1, imagen2, imagen3];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || decodedToken.username);
        setNombre(decodedToken.nombre || "");
        setApellidos(decodedToken.apellidos || "");
        setEmail(decodedToken.email || "");

        if (
          decodedToken.authorities &&
          Array.isArray(decodedToken.authorities)
        ) {
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
        const response = await axios.get(
          "http://localhost:8080/api/productos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProductos(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los productos:", err);
        setError(
          "Error al cargar los productos. Por favor, intente más tarde."
        );
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
    <div className="d-flex flex-column min-vh-100">
      <NavBar
        logo={logo}
        username={username}
        nombre={nombre}
        apellidos={apellidos}
        email={email}
        rol={rol}
        onLogout={handleLogout}
      />
      <ImageCarousel
        images={images}
        autoPlay={true}
        showButtons={true}
      />
      <Container className="py-5 flex-grow-1">
        <h2 className="text-center mb-4 productos-titulo">Nuestros Productos</h2>
        <div className="productos-filtros mb-4">
          <Badge pill bg="primary" className="filtro-badge me-2">Todos</Badge>
          <Badge pill bg="light" text="dark" className="filtro-badge me-2">Populares</Badge>
          <Badge pill bg="light" text="dark" className="filtro-badge me-2">Nuevos</Badge>
          <Badge pill bg="light" text="dark" className="filtro-badge">Ofertas</Badge>
        </div>
        <Row xs={1} md={2} lg={3} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.id}>
              <Card className="producto-card">
                <div className="producto-img-container">
                  <span className="producto-badge">{producto.categoria}</span>
                  <Card.Img
                    variant="top"
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="producto-imagen"
                  />
                  <div className="producto-overlay">
                    <button className="btn btn-primary btn-sm me-2">
                      <i className="bi bi-cart-plus"></i> Añadir
                    </button>
                    <button className="btn btn-outline-light btn-sm">
                      <i className="bi bi-eye"></i> Ver
                    </button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="producto-titulo">{producto.nombre}</Card.Title>
                  <div className="producto-rating mb-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star text-warning"></i>
                  </div>
                  <Card.Text className="producto-descripcion">
                    {producto.descripcion}
                  </Card.Text>
                  <div className="producto-footer">
                    <span className="producto-precio">{producto.precio}€</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Welcome;