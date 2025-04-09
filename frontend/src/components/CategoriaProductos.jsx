import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import Footer from "./Footer";
import Navbar from "./Navbar";

function CategoriaProductos() {
  const { categoriaId } = useParams(); // Obtener el ID de la categoría de la URL
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Para redirigir al usuario si es necesario

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token. Por favor, inicie sesión.");
          setLoading(false);
          return;
        }

        // Hacer la solicitud con el token en el encabezado
        const response = await axios.get(
          `http://localhost:8080/api/productos/categoria/${categoriaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProductos(response.data);
        setLoading(false);
      } catch (err) {
        // Si el error es de autenticación o no se encuentra la categoría
        if (err.response && err.response.status === 401) {
          setError("Token inválido o expirado. Redirigiendo al inicio de sesión...");
          localStorage.removeItem("token"); // Eliminar el token expirado
          setTimeout(() => navigate("/"), 3000); // Redirigir a la página de inicio después de 3 segundos
        } else {
          setError("Error al cargar los productos. Intente más tarde.");
        }
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoriaId, navigate]); // Dependencia de navigate para que funcione correctamente en caso de redirección

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <Navbar /> {/* Muestra el Navbar siempre */}
        <Alert variant="danger">
          {error}
        </Alert>
        <Footer /> {/* Muestra el Footer siempre */}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar /> 
      <Container>
        <h2>Productos de la Categoría</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={producto.imagen || "default-image.jpg"}
                  alt={producto.nombre}
                />
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>{producto.descripcion}</Card.Text>
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

export default CategoriaProductos;
