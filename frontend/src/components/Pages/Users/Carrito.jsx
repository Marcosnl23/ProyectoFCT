// Importaciones de React y componentes de React Bootstrap
import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Badge, Alert, Modal } from "react-bootstrap";
// Importaciones de componentes comunes
import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
// Importación del store de carrito
import useCarritoStore from "../../store/useCarritoStore";

function Carrito() {
  // Extraer funciones y estado del store del carrito
  const { 
    carrito,           // Array de productos en el carrito
    removeFromCarrito, // Función para eliminar producto
    clearCarrito,      // Función para vaciar carrito
    crearPedido       // Función para crear pedido
  } = useCarritoStore();

  // Estado local para controlar el modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);

  // Calcular el subtotal sumando precio * cantidad de cada producto
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // Por ahora el total es igual al subtotal (sin impuestos/envío)
  const total = subtotal;

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (id, nuevaCantidad) => {
    // Evitar cantidades negativas
    if (nuevaCantidad < 1) return;

    // Actualizar cantidad del producto específico
    const carritoActualizado = carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );

    // Actualizar el estado en el store
    useCarritoStore.setState({ carrito: carritoActualizado });
  };

  // Manejadores para el modal de confirmación
  const handleConfirmShow = () => setShowConfirm(true);
  const handleConfirmClose = () => setShowConfirm(false);
  const handleConfirmYes = () => {
    crearPedido();
    setShowConfirm(false);
  };

  return (
    // Contenedor principal con flex para footer sticky
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de navegación */}
      <NavBar />

      {/* Contenedor principal */}
      <Container className="mt-5 pt-5 flex-grow-1">
        {/* Encabezado del carrito */}
        <Row className="mb-4">
          <Col>
            <h2 className="border-bottom pb-3 d-flex align-items-center">
              <i className="bi bi-cart3 me-2"></i>
              Carrito de Compras
              {/* Badge que muestra la cantidad total de productos */}
              {carrito.length > 0 && (
                <Badge bg="primary" className="ms-2 rounded-pill">
                  {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                </Badge>
              )}
            </h2>
          </Col>
        </Row>

        {/* Renderizado condicional basado en si hay productos */}
        {carrito.length === 0 ? (
          // Mensaje cuando el carrito está vacío
          <Alert variant="info" className="text-center p-5">
            <i className="bi bi-cart-x fs-1 mb-3 d-block"></i>
            <h4>Tu carrito está vacío</h4>
            <p className="mb-4">No tienes productos en el carrito.</p>
            <Button variant="primary">Seguir comprando</Button>
          </Alert>
        ) : (
          // Vista del carrito con productos
          <Row>
            {/* Columna izquierda: Lista de productos */}
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Productos</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {/* Mapear cada producto en el carrito */}
                  {carrito.map((producto) => (
                    <div
                      key={producto.id}
                      className="p-3 border-bottom d-flex align-items-center"
                    >
                      {/* Imagen del producto */}
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

                      {/* Detalles del producto */}
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{producto.nombre}</h6>
                        <p className="text-muted small mb-1">
                          REF: {producto.id.toString().padStart(6, "0")}
                        </p>
                        {/* Mostrar talla si existe */}
                        {producto.talla && (
                          <p className="text-muted small mb-1">
                            Talla: <strong>{producto.talla}</strong>
                          </p>
                        )}
                        {/* Controles de precio y cantidad */}
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="fw-bold">
                              {producto.precio.toFixed(2)}€
                            </span>
                          </div>

                          {/* Control de cantidad */}
                          <div className="d-flex align-items-center border rounded">
                            <Button
                              variant="light"
                              size="sm"
                              className="border-0"
                              onClick={() =>
                                actualizarCantidad(producto.id, producto.cantidad - 1)
                              }
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <span className="px-3">{producto.cantidad}</span>
                            <Button
                              variant="light"
                              size="sm"
                              className="border-0"
                              onClick={() =>
                                actualizarCantidad(producto.id, producto.cantidad + 1)
                              }
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </div>

                          {/* Subtotal del producto */}
                          <div className="ms-auto fw-bold">
                            {(producto.precio * producto.cantidad).toFixed(2)}€
                          </div>
                        </div>
                      </div>

                      {/* Botón para eliminar producto */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3 flex-shrink-0"
                        onClick={() => removeFromCarrito(producto.id, producto.tallaId)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                </Card.Body>
                {/* Footer con acciones del carrito */}
                <Card.Footer className="bg-white d-flex justify-content-between">
                  <Button variant="outline-secondary" size="sm" onClick={clearCarrito}>
                    <i className="bi bi-trash me-1"></i> Vaciar carrito
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-arrow-left me-1"></i> Seguir comprando
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            {/* Columna derecha: Resumen del pedido */}
            <Col lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Resumen del pedido</h5>
                </Card.Header>
                <Card.Body>
                  {/* Subtotal */}
                  <Row className="mb-2">
                    <Col>Subtotal</Col>
                    <Col className="text-end fw-medium">{subtotal.toFixed(2)}€</Col>
                  </Row>
                  {/* Total */}
                  <Row className="border-top mt-2 pt-2 fw-bold">
                    <Col>Total</Col>
                    <Col className="text-end fs-5">{total.toFixed(2)}€</Col>
                  </Row>
                </Card.Body>
                {/* Footer con botón de finalizar pedido */}
                <Card.Footer className="bg-white p-3">
                  <Button variant="primary" className="w-100 py-2" onClick={handleConfirmShow}>
                    <i className="bi bi-credit-card me-2"></i> Finalizar pedido
                  </Button>
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-shield-lock me-1"></i> Pago seguro con cifrado SSL
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Footer */}
      <div className="mt-5">
        <Footer />
      </div>

      {/* Modal de confirmación de pedido */}
      <Modal show={showConfirm} onHide={handleConfirmClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quiere hacer este pedido?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmYes}>
            Sí, confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Carrito;