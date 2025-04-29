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
  const [nombreCategoria, setNombreCategoria] = useState(""); // Para almacenar el nombre de la categoría
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

        // También podríamos obtener el nombre de la categoría si la API lo proporciona
        // Si no, puedes agregar otra llamada para obtener los detalles de la categoría
        try {
          const categoriaResponse = await axios.get(
            `http://localhost:8080/api/categorias/${categoriaId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (categoriaResponse.data && categoriaResponse.data.nombre) {
            setNombreCategoria(categoriaResponse.data.nombre);
          }
        } catch (catErr) {
          console.error("Error al obtener el nombre de la categoría:", catErr);
          // No establecemos error aquí para no interrumpir la carga de productos
        }

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
          <Alert variant="danger">
            {error}
          </Alert>
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
      
      {/* Añadido className mt-5 pt-5 para dar más espacio en la parte superior */}
      <Container className="mt-5 pt-5 flex-grow-1">
        <h2 className="mb-4">{nombreCategoria || "Productos de la Categoría"}</h2>
        
        {productos.length === 0 ? (
          <Alert variant="info">No hay productos disponibles en esta categoría.</Alert>
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
                        <span className="fw-bold">${producto.precio.toFixed(2)}</span>
                        <button className="btn btn-sm btn-outline-primary">
                          Añadir al carrito
                        </button>
                      </div>
                    )}
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

export default CategoriaProductos;