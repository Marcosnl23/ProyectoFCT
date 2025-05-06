import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Nav, Tab, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
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
import { FaShippingFast, FaExchangeAlt, FaHeadset, FaClock } from "react-icons/fa";
import "../css/CategoriaStyles.css";

function Welcome() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const images = [
    {
      src: imagen1,
      title: "Envío Gratis",
      subtitle: "En todas las compras superiores a 50€"
    },
    {
      src: imagen2,
      title: "Nueva Colección",
      subtitle: "Descubre las tendencias de esta temporada"
    },
    {
      src: imagen3,
      title: "30% de Descuento",
      subtitle: "En productos seleccionados"
    }
  ];

  const testimonios = [
    {
      id: 1,
      nombre: "María López",
      comentario: "¡Excelente calidad! Me encantaron los productos y el envío fue muy rápido.",
      rating: 5
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      comentario: "Gran variedad de productos y un servicio al cliente excepcional.",
      rating: 4
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      comentario: "El mejor sitio para comprar ropa. Calidad superior y precios razonables.",
      rating: 5
    }
  ];


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch categorías
        const categoriasResponse = await axios.get(
          "http://localhost:8080/api/categorias",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCategorias(categoriasResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Error al cargar los datos. Por favor, intente más tarde.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);





  const handleCategoriaClick = (categoriaId) => {
    setSelectedCategory(categoriaId);
    navigate(`/categoria/${categoriaId}`); 
  };

  // Filtrar categorías por género
  const categoriasTodas = categorias;
  const categoriasHombre = categorias.filter(cat => cat.genero === 'Hombre');
  const categoriasMujer = categorias.filter(cat => cat.genero === 'Mujer');

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

  // Renderiza las categorías según el filtro seleccionado
  const renderCategorias = (categoriasToRender) => {
    return (
      <Row xs={1} md={2} lg={3} className="g-4">
        {categoriasToRender.map((categoria) => (
          <Col key={categoria.id}>
            <Card 
              className="categoria-card"
              onClick={() => handleCategoriaClick(categoria.id)}
            >
              <div className="categoria-img-container">
                <Card.Img
                  variant="top"
                  src={categoria.imagen || imagen1}
                  alt={categoria.nombre}
                  className="categoria-imagen"
                />
                <div className="categoria-overlay">
                  <button className="btn-explorar">
                    Ver Productos
                  </button>
                </div>
              </div>
              <div className="categoria-content">
                <Card.Title className="categoria-titulo">
                  {categoria.nombre}
                </Card.Title>
                <Card.Text className="categoria-descripcion">
                  {categoria.descripcion || `Explora nuestra colección de ${categoria.nombre}`}
                </Card.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };



  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      <ImageCarousel
        images={images}
        autoPlay={true}
        showButtons={true}
        withText={true}
      />

      <Container className="py-5 flex-grow-1">
        {/* Sección de beneficios */}
        <Row className="text-center mb-5 py-4 benefits-section">
          <Col md={4} sm={6} className="mb-3 mb-md-0">
            <div className="benefit-item">
              <FaShippingFast size={30} className="mb-3 text-primary" />
              <h5 className="mb-2">Envío Rápido</h5>
              <p className="small">Entrega en 24/48 horas</p>
            </div>
          </Col>
          <Col md={4} sm={6} className="mb-3 mb-md-0">
            <div className="benefit-item">
              <FaExchangeAlt size={30} className="mb-3 text-primary" />
              <h5 className="mb-2">Devolución Fácil</h5>
              <p className="small">30 días para cambios</p>
            </div>
          </Col>
          <Col md={4} sm={6} className="mb-3 mb-md-0">
            <div className="benefit-item">
              <FaHeadset size={30} className="mb-3 text-primary" />
              <h5 className="mb-2">Atención 24/7</h5>
              <p className="small">Siempre disponibles</p>
            </div>
          </Col>
        </Row>


        {/* Categorías */}
        <h2 className="categorias-titulo">Nuestras Categorías</h2>
        
        <Tab.Container id="categorias-tabs" defaultActiveKey="todos">
          <Nav className="categoria-tabs justify-content-center mb-4">
            <Nav.Item>
              <Nav.Link eventKey="todos" className="tab-link">
                Todos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="hombre" className="tab-link">
                Hombre
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mujer" className="tab-link">
                Mujer
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          <Tab.Content>
            <Tab.Pane eventKey="todos">
              {renderCategorias(categoriasTodas)}
            </Tab.Pane>
            <Tab.Pane eventKey="hombre">
              {renderCategorias(categoriasHombre)}
            </Tab.Pane>
            <Tab.Pane eventKey="mujer">
              {renderCategorias(categoriasMujer)}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        
        {/* Sección de Testimonios */}
        <div className="my-5 py-4">
          <h2 className="categorias-titulo mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <Row xs={1} md={3} className="g-4">
            {testimonios.map((testimonio) => (
              <Col key={testimonio.id}>
                <Card className="h-100 testimonio-card">
                  <Card.Body>
                    <div className="mb-3">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <i 
                          key={idx} 
                          className={`bi bi-star${idx < testimonio.rating ? '-fill' : ''} text-warning me-1`}
                        ></i>
                      ))}
                    </div>
                    <Card.Text className="mb-3">"{testimonio.comentario}"</Card.Text>
                    <Card.Title className="mb-0 h5">- {testimonio.nombre}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Sección de consejos de moda */}
        <div className="my-5 bg-light p-4 rounded fashion-tips-section">
          <h2 className="categorias-titulo mb-4">Tendencias & Estilo</h2>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img 
                src={imagen2} 
                alt="Tendencias de moda" 
                className="img-fluid rounded" 
                style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
              />
            </Col>
            <Col md={6}>
              <h3>Cómo Combinar Nuestras Prendas</h3>
              <p>Descubre las últimas tendencias y aprende a crear looks increíbles con nuestras prendas. Nuestros estilistas comparten consejos para cada ocasión.</p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i> Combina sudaderas oversize con pantalones ajustados</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i> Utiliza accesorios para elevar looks básicos</li>
                <li className="mb-2"><i className="bi bi-check2-circle text-primary me-2"></i> Mezcla estilos formal e informal para un look contemporáneo</li>
              </ul>
            </Col>
          </Row>
        </div>
        
      </Container>

      <Footer />
    </div>
  );
}

export default Welcome;