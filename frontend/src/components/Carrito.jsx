import React from "react";
import { Container, Row, Col, Button, Card, Badge, Alert } from "react-bootstrap";
import useCarritoStore from "../components/store/useCarritoStore";
import Footer from "./Footer";
import NavBar from "./Navbar";

function Carrito() {
  const { carrito, removeFromCarrito, clearCarrito, crearPedido } = useCarritoStore();

  // Calcular subtotal
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  
  // Calcular total final (sin cupones ni gastos de envío)
  const total = subtotal;

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const carritoActualizado = carrito.map(item => 
      item.id === id ? {...item, cantidad: nuevaCantidad} : item
    );
    
    useCarritoStore.setState({ carrito: carritoActualizado });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <Container className="mt-5 pt-5 flex-grow-1">
        <Row className="mb-4">
          <Col>
            <h2 className="border-bottom pb-3 d-flex align-items-center">
              <i className="bi bi-cart3 me-2"></i>
              Carrito de Compras
              {carrito.length > 0 && (
                <Badge bg="primary" className="ms-2 rounded-pill">
                  {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                </Badge>
              )}
            </h2>
          </Col>
        </Row>

        {carrito.length === 0 ? (
          <Alert variant="info" className="text-center p-5">
            <i className="bi bi-cart-x fs-1 mb-3 d-block"></i>
            <h4>Tu carrito está vacío</h4>
            <p className="mb-4">No tienes productos en el carrito.</p>
            <Button variant="primary">Seguir comprando</Button>
          </Alert>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Productos</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {carrito.map((producto) => (
                    <div 
                      key={producto.id} 
                      className="p-3 border-bottom d-flex align-items-center"
                    >
                      {/* Imagen del producto (placeholder) */}
                      <div className="flex-shrink-0 me-3">
                        <div 
                          className="bg-light rounded" 
                          style={{ width: "80px", height: "80px" }}
                        >
                          <img 
                            src={producto.imagen || "/placeholder.jpg"} 
                            alt={producto.nombre}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Información del producto */}
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{producto.nombre}</h6>
                        <p className="text-muted small mb-1">
                          REF: {producto.id.toString().padStart(6, '0')}
                        </p>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="fw-bold">{producto.precio.toFixed(2)}€</span>
                          </div>
                          
                          <div className="d-flex align-items-center border rounded">
                            <Button 
                              variant="light" 
                              size="sm"
                              className="border-0"
                              onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <span className="px-3">{producto.cantidad}</span>
                            <Button 
                              variant="light" 
                              size="sm"
                              className="border-0"
                              onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </div>
                          
                          <div className="ms-auto fw-bold">
                            {(producto.precio * producto.cantidad).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                      
                      {/* Botón eliminar */}
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="ms-3 flex-shrink-0"
                        onClick={() => removeFromCarrito(producto.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                </Card.Body>
                <Card.Footer className="bg-white d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={clearCarrito}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Vaciar carrito
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-arrow-left me-1"></i>
                    Seguir comprando
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* Resumen de compra */}
            <Col lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Resumen del pedido</h5>
                </Card.Header>
                <Card.Body>
                  {/* Detalles del coste */}
                  <div>
                    <Row className="mb-2">
                      <Col>Subtotal</Col>
                      <Col className="text-end fw-medium">{subtotal.toFixed(2)}€</Col>
                    </Row>
                    <Row className="border-top mt-2 pt-2 fw-bold">
                      <Col>Total</Col>
                      <Col className="text-end fs-5">{total.toFixed(2)}€</Col>
                    </Row>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white p-3">
                  <Button 
                    variant="primary" 
                    className="w-100 py-2"
                    onClick={crearPedido}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Finalizar pedido
                  </Button>
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-shield-lock me-1"></i>
                      Pago seguro con cifrado SSL
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
}

export default Carrito;