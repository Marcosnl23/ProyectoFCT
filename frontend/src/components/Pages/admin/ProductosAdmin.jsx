import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/productos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = productoActual 
        ? `http://localhost:8080/api/productos/${productoActual.id}`
        : 'http://localhost:8080/api/productos';
      
      const response = await fetch(url, {
        method: productoActual ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        cargarProductos();
        setFormData({ nombre: '', precio: '', stock: '', descripcion: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          cargarProductos();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Productos</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => {
            setProductoActual(null);
            setFormData({ nombre: '', precio: '', stock: '', descripcion: '' });
            setShowModal(true);
          }}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Nuevo Producto
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-2"
                      onClick={() => {
                        setProductoActual(producto);
                        setFormData(producto);
                        setShowModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {productoActual ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {productoActual ? 'Actualizar' : 'Crear'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProductosAdmin;