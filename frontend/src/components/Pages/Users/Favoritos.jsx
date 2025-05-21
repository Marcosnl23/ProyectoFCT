import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button, Spinner } from "react-bootstrap";
import Navbar from "../../common/NavBar";
import Footer from "../../common/Footer";
import  useFavoritosStore  from "../../store/useFavoritosStore"; 
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

function Favoritos() {
  const { favoritos, toggleFavorito } = useFavoritosStore(); // Usar Zustand para manejar favoritos
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga

  // Obtener el username del token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token. Por favor, inicie sesión.");
      return null;
    }
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub || decodedToken.username; // Ajusta según el campo del token
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      setError("Token inválido. Por favor, inicie sesión.");
      return null;
    }
  };

  // Obtener los productos favoritos desde la API
  useEffect(() => {
    const fetchFavoritos = async () => {
      setLoading(true); // Mostrar el indicador de carga
      const token = localStorage.getItem("token");
      const username = getUsernameFromToken();
      if (!token || !username) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/favoritos/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en los headers
          },
        });
        setProductos(response.data); // Asume que el backend devuelve los productos favoritos directamente
      } catch (err) {
        console.error("Error al obtener los favoritos:", err);
        setError("Error al cargar los favoritos. Por favor, intente más tarde.");
      } finally {
        setLoading(false); // Ocultar el indicador de carga
      }
    };

    fetchFavoritos();
  }, []);

  // Manejar la eliminación de un producto de favoritos
  const handleEliminarFavorito = (productoId) => {
    toggleFavorito(productoId); // Actualizar Zustand y el backend
    setProductos((prevProductos) =>
      prevProductos.filter((producto) => producto.id !== productoId) // Eliminar del estado local
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="mt-5 pt-5 flex-grow-1">
        <h2 className="mb-4">Mis Favoritos</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
            <span className="ms-2">Cargando tus favoritos...</span>
          </div>
        ) : productos.length === 0 ? (
          <Alert variant="info">No tienes productos en favoritos.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {productos.map((producto) => (
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
                      </div>
                    )}
                    {/* Botón para eliminar de favoritos */}
                    <Button
                      variant="danger"
                      className="mt-3"
                      onClick={() => handleEliminarFavorito(producto.id)} // Llamar a la función de eliminación
                    >
                      Eliminar de Favoritos
                    </Button>
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

export default Favoritos;