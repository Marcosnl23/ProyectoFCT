import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
} from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/pedidos/usuario",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.trim()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el historial de pedidos.");
        }

        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <Container className="mt-5 pt-5 flex-grow-1">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Historial de Pedidos</h1>
            <p className="text-center text-muted">
              Aquí puedes ver todos los pedidos que has realizado.
            </p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : pedidos.length === 0 ? (
          <Alert variant="info" className="text-center">
            No tienes pedidos en tu historial.
          </Alert>
        ) : (
          <Row>
            {pedidos.map((pedido, index) => (
              <Col md={12} key={pedido.id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="mb-3">
                      Pedido #{index + 1}
                    </Card.Title>
                    <Card.Text>
                      <strong>Fecha:</strong>{" "}
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Total:</strong> {pedido.total.toFixed(2)}€
                    </Card.Text>
                    <Card.Text>
                      <strong>Productos:</strong>
                    </Card.Text>
                    <ListGroup variant="flush">
                      {pedido.detalles.map((detalle) => (
                        <ListGroup.Item
                          key={detalle.id}
                          className="d-flex align-items-center"
                        >
                          <Image
                            src={detalle.producto.imagen}
                            alt={detalle.producto.nombre}
                            rounded
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                            className="me-3"
                          />
                          <div>
                            <strong>{detalle.producto.nombre}</strong>
                            <p className="mb-0 text-muted">
                              Talla: {detalle.talla?.talla || "N/A"} |
                              Cantidad: {detalle.cantidad} | Precio:{" "}
                              {detalle.precio.toFixed(2)}€
                            </p>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default HistorialPedidos;
