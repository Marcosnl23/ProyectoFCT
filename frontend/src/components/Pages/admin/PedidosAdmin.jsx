import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pedidos/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const verDetalles = (pedido) => {
    setPedidoSeleccionado(pedido);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Gestión de Pedidos</h2>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.usuario?.username}</td>
              <td>{formatDate(pedido.fecha)}</td>
              <td>{pedido.total.toFixed(2)}€</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => verDetalles(pedido)}
                >
                  <FontAwesomeIcon icon={faEye} /> Ver Detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido #{pedidoSeleccionado?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoSeleccionado && (
            <>
              <p><strong>Usuario:</strong> {pedidoSeleccionado.usuario?.username}</p>
              <p><strong>Fecha:</strong> {formatDate(pedidoSeleccionado.fecha)}</p>
              <p><strong>Total:</strong> {pedidoSeleccionado.total.toFixed(2)}€</p>
              
              <h5 className="mt-4">Productos:</h5>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoSeleccionado.detalles?.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.producto?.nombre}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.precio}€</td>
                      <td>{(detalle.cantidad * detalle.precio).toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PedidosAdmin;