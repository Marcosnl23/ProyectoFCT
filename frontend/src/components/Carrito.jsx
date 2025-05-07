import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import useCarritoStore from "../components/store/useCarritoStore";
import Footer from "./Footer";
import NavBar from "./Navbar";

function Carrito() {
  const { carrito, removeFromCarrito, clearCarrito, crearPedido } =
    useCarritoStore();

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <Container className="mt-5 pt-5 flex-grow-1">
        <h2>Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p>No tienes productos en el carrito.</p>
        ) : (
          <>
            <Row>
              {carrito.map((producto) => (
                <Col key={producto.id} xs={12} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{producto.nombre}</h5>
                      <p>Precio: {producto.precio.toFixed(2)}€</p>
                      <p>Cantidad: {producto.cantidad}</p>
                    </div>
                    <div>
                      <Button
                        variant="danger"
                        onClick={() => removeFromCarrito(producto.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            <h4>Total: {total.toFixed(2)}€</h4>
            <Button variant="danger" onClick={clearCarrito}>
              Vaciar Carrito
            </Button>
            <Button variant="success" className="ms-3" onClick={crearPedido}>
              Realizar Pedido
            </Button>
          </>
        )}
      </Container>
      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
}

export default Carrito;
