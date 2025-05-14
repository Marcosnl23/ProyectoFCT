import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import Footer from "./Footer";
import Navbar from "./Navbar";
import useFavoritosStore from "../components/store/useFavoritosStore"; // Importar el store de favoritos
import useCarritoStore from "../components/store/useCarritoStore"; // Importar el store del carrito

function CategoriaProductos() {
  const { categoriaId } = useParams(); // Obtener el ID de la categoría de la URL
  const { favoritos, toggleFavorito } = useFavoritosStore(); // Obtener los IDs de favoritos y la función para alternar favoritos
  const { addToCarrito } = useCarritoStore(); // Obtener la función para añadir productos al carrito
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreCategoria, setNombreCategoria] = useState(""); // Para almacenar el nombre de la categoría
  const navigate = useNavigate(); // Para redirigir al usuario si es necesario
  const [tallasPorProducto, setTallasPorProducto] = useState({});
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState({}); // Estado para las tallas seleccionadas por producto

  // Obtener las tallas del producto
  const obtenerTallas = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token. Por favor, inicie sesión.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/tallas/producto/${productoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTallasPorProducto((prevState) => ({
        ...prevState,
        [productoId]: response.data,
      }));
    } catch (err) {
      console.error(
        `Error al obtener las tallas para el producto ${productoId}:`,
        err
      );
    }
  };

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

        // Obtener el nombre de la categoría
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
        }

        setProductos(response.data);

        // Obtener las tallas para cada producto
        response.data.forEach((producto) => {
          obtenerTallas(producto.id);
        });

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError(
            "Token inválido o expirado. Redirigiendo al inicio de sesión..."
          );
          localStorage.removeItem("token");
          setTimeout(() => navigate("/"), 3000);
        } else {
          setError("Error al cargar los productos. Intente más tarde.");
        }
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoriaId, navigate]);

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

  const handleTallaSeleccionada = (productoId, talla) => {
    setTallasSeleccionadas((prevState) => ({
      ...prevState,
      [productoId]: prevState[productoId] === talla.id ? null : talla.id, // Deseleccionar si ya está seleccionada
    }));
  };

  const handleAñadirAlCarrito = (producto) => {
    const tallaSeleccionadaId = tallasSeleccionadas[producto.id];
    if (tallasPorProducto[producto.id] && !tallaSeleccionadaId) {
      alert("Por favor, selecciona una talla antes de añadir al carrito.");
      return;
    }

    addToCarrito(producto, tallaSeleccionadaId); // Pasar el producto y el tallaId
    alert("Producto añadido al carrito.");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="mt-5 pt-5 flex-grow-1">
        <h2 className="mb-4">
          {nombreCategoria || "Productos de la Categoría"}
        </h2>

        {productos.length === 0 ? (
          <Alert variant="info">
            No hay productos disponibles en esta categoría.
          </Alert>
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
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text>{producto.descripcion}</Card.Text>
                    {producto.precio && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold">
                          {producto.precio.toFixed(2)}€
                        </span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleAñadirAlCarrito(producto)}
                        >
                          Añadir al carrito
                        </button>
                      </div>
                    )}
                    {/* Mostrar las tallas */}
                    {tallasPorProducto[producto.id] && (
                      <div className="mt-3">
                        <strong>Tallas disponibles:</strong>
                        <div className="d-flex flex-wrap mt-2">
                          {tallasPorProducto[producto.id].map((talla) => (
                            <button
                              key={talla.id}
                              className={`btn btn-sm me-2 mb-2 ${
                                tallasSeleccionadas[producto.id] === talla.id
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() =>
                                handleTallaSeleccionada(producto.id, talla)
                              }
                            >
                              {talla.talla}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Botón para añadir/eliminar de favoritos */}
                    <Button
                      variant={
                        favoritos.includes(producto.id)
                          ? "danger"
                          : "outline-danger"
                      }
                      className="mt-3"
                      onClick={() => toggleFavorito(producto.id)}
                    >
                      {favoritos.includes(producto.id)
                        ? "Eliminar de Favoritos"
                        : "Añadir a Favoritos"}
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

export default CategoriaProductos;
