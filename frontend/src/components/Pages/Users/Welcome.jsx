import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Nav,
  Tab,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import logo from "../../../assets/logo.png";
import ImageCarousel from "../../common/Carousel";
import imagen1 from "../../../assets/image1.jpg";
import imagen2 from "../../../assets/image2.jpg";
import imagen3 from "../../../assets/image3.jpg";
import { FaShippingFast, FaExchangeAlt, FaHeadset } from "react-icons/fa";
import "../../../css/CategoriaStyles.css";

function Welcome() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [miValoracion, setMiValoracion] = useState({
    comentario: "",
    puntuacion: 5,
  });
  const [username, setUsername] = useState(null);
  const [yaValorado, setYaValorado] = useState(false);
  const navigate = useNavigate();

  const images = [
    {
      src: imagen1,
      title: "Envío Gratis",
      subtitle: "En todas las compras superiores a 50€",
    },
    {
      src: imagen2,
      title: "Nueva Colección",
      subtitle: "Descubre las tendencias de esta temporada",
    },
    {
      src: imagen3,
      title: "30% de Descuento",
      subtitle: "En productos seleccionados",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró token de autenticación.");
        setLoading(false);
        return;
      }
      try {
        // Decodificar token para obtener username
        const decoded = jwtDecode(token);
        setUsername(decoded.sub);

        // Obtener categorías
        const categoriasRes = await axios.get(
          "http://localhost:8080/api/categorias",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategorias(categoriasRes.data);

        // Obtener valoraciones
        const valoracionesRes = await axios.get(
          "http://localhost:8080/api/valoraciones",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setValoraciones(valoracionesRes.data);

        // Verificar si usuario ya ha valorado
        const yaExiste = valoracionesRes.data.some(
          (v) => v.usuario.username === decoded.sub
        );
        setYaValorado(yaExiste);

        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Error al cargar los datos.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoriaClick = (categoriaId) => {
    navigate(`/categoria/${categoriaId}`);
  };

  const renderCategorias = (categoriasToRender) => (
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
                <button className="btn-explorar">Ver Productos</button>
              </div>
            </div>
            <div className="categoria-content">
              <Card.Title className="categoria-titulo">
                {categoria.nombre}
              </Card.Title>
              <Card.Text className="categoria-descripcion">
                {categoria.descripcion ||
                  `Explora nuestra colección de ${categoria.nombre}`}
              </Card.Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

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

  const categoriasHombre = categorias.filter((cat) => cat.genero === "Hombre");
  const categoriasMujer = categorias.filter((cat) => cat.genero === "Mujer");

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
        {/* Beneficios */}
        <Row className="text-center mb-5 py-4 benefits-section">
          <Col md={4}>
            <FaShippingFast size={30} className="mb-2 text-primary" />
            <h5>Envío Rápido</h5>
          </Col>
          <Col md={4}>
            <FaExchangeAlt size={30} className="mb-2 text-primary" />
            <h5>Devolución Fácil</h5>
          </Col>
          <Col md={4}>
            <FaHeadset size={30} className="mb-2 text-primary" />
            <h5>Atención 24/7</h5>
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
            <Tab.Pane eventKey="todos">{renderCategorias(categorias)}</Tab.Pane>
            <Tab.Pane eventKey="hombre">
              {renderCategorias(categoriasHombre)}
            </Tab.Pane>
            <Tab.Pane eventKey="mujer">
              {renderCategorias(categoriasMujer)}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Valoraciones */}
        <div className="my-5 py-4">
          <h2 className="categorias-titulo mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <Row xs={1} md={3} className="g-4">
            {valoraciones.map((valoracion) => (
              <Col key={valoracion.id}>
                <Card className="h-100 testimonio-card">
                  <Card.Body>
                    <div className="mb-3">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <i
                          key={idx}
                          className={`bi bi-star${
                            idx < valoracion.puntuacion ? "-fill" : ""
                          } text-warning me-1`}
                        ></i>
                      ))}
                    </div>
                    <Card.Text className="mb-3">
                      "{valoracion.comentario}"
                    </Card.Text>
                    <Card.Title className="mb-0 h5">
                      - {valoracion.usuario.nombre}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Formulario de nueva valoración */}
        <div className="my-5">
          <h2 className="categorias-titulo mb-4">Tu Opinión Nos Importa</h2>

          {yaValorado ? (
            <div className="alert alert-info">
              Ya has enviado tu valoración. ¡Gracias!
            </div>
          ) : (
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("No estás autenticado.");
                  return;
                }

                try {
                  // Decodificamos el token para obtener el username actual en el momento del envío
                  const decoded = jwtDecode(token);

                  // Enviamos la valoración con los datos necesarios
                  const response = await axios.post(
                    "http://localhost:8080/api/valoraciones/crear",
                    {
                      comentario: miValoracion.comentario,
                      puntuacion: miValoracion.puntuacion,
                      username: decoded.sub, // Usamos directamente el username decodificado
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  // Actualizamos el estado del frontend tras enviar
                  setValoraciones([...valoraciones, response.data]);
                  setYaValorado(true);
                  setMiValoracion({ comentario: "", puntuacion: 5 }); // Reinicia el formulario
                } catch (err) {
                  console.error("Error al enviar valoración:", err);
                  alert("Error al enviar la valoración.");
                }
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={miValoracion.comentario}
                  onChange={(e) =>
                    setMiValoracion({
                      ...miValoracion,
                      comentario: e.target.value,
                    })
                  }
                  required
                  placeholder="Escribe tu opinión sobre la tienda..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Puntuación</Form.Label>
                <Form.Select
                  value={miValoracion.puntuacion}
                  onChange={(e) =>
                    setMiValoracion({
                      ...miValoracion,
                      puntuacion: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>
                      {val} estrella{val !== 1 && "s"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit">
                Enviar Valoración
              </Button>
            </Form>
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default Welcome;
