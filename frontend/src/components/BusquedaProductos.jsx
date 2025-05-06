import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Alert, Form } from "react-bootstrap";
import Footer from "./Footer";
import Navbar from "./Navbar";
import useFavoritosStore from "../components/store/useFavoritosStore"; // Importar el store de Zustand

function BusquedaProductos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Zustand: Obtener favoritos y función para alternar favoritos
  const { favoritos, toggleFavorito } = useFavoritosStore();

  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token. Por favor, inicie sesión.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/productos?nombre=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProductos(response.data);
        setFilteredProductos(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Token inválido o expirado. Redirigiendo al inicio de sesión...");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/"), 3000);
        } else {
          setError("Error al cargar los productos. Intente más tarde.");
        }
        setLoading(false);
      }
    };

    if (query) {
      fetchProductos();
    } else {
      setError("No se proporcionó un término de búsqueda.");
      setLoading(false);
    }
  }, [query, navigate]);

  const handleFilter = () => {
    const filtered = productos.filter((producto) => {
      const precio = producto.precio || 0;
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return precio >= min && precio <= max;
    });
    setFilteredProductos(filtered);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="mt-5 pt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="mt-5 pt-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="mt-5 pt-5 flex-grow-1">
        <h2 className="mb-4">Resultados para "{query}"</h2>

        {/* Filtros de precio */}
        <Form className="mb-4">
          <Row>
            <Col xs={12} md={4}>
              <Form.Group controlId="minPrice">
                <Form.Label>Precio mínimo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ej: 10"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="maxPrice">
                <Form.Label>Precio máximo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ej: 100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4} className="d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleFilter}
              >
                Filtrar
              </button>
            </Col>
          </Row>
        </Form>

        {filteredProductos.length === 0 ? (
          <Alert variant="info">No se encontraron productos.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredProductos.map((producto) => (
              <Col key={producto.id}>
                <Card className="h-100 shadow-sm">
                  <div style={{ height: "300px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={producto.imagen || "default-image.jpg"}
                      alt={producto.nombre}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text>{producto.descripcion}</Card.Text>
                    {producto.precio && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold">{producto.precio.toFixed(2)}€</span>
                        <button className="btn btn-sm btn-outline-primary">
                          Añadir al carrito
                        </button>
                      </div>
                    )}
                    {/* Botón de favoritos */}
                    <button
                      className={`btn btn-sm mt-3 ${
                        favoritos.includes(producto.id)
                          ? "btn-danger"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => toggleFavorito(producto.id)}
                    >
                      {favoritos.includes(producto.id)
                        ? "Eliminar de Favoritos"
                        : "Añadir a Favoritos"}
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
}

export default BusquedaProductos;