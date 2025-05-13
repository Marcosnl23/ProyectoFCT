import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: "",
    categoriaId: "",
    tallas: [],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    await Promise.all([cargarProductos(), cargarCategorias(), cargarTallas()]);
  };

  const cargarTallas = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tallas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setTallas(data);
    } catch (error) {
      console.error("Error al cargar tallas:", error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categorias", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/productos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = productoActual
        ? `http://localhost:8080/api/productos/${productoActual.id}`
        : "http://localhost:8080/api/productos";

      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        categoriaId: parseInt(formData.categoriaId),
        tallas: formData.tallas.filter((t) => t.stock > 0),
      };

      const response = await fetch(url, {
        method: productoActual ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productoData),
      });

      if (response.ok) {
        setShowModal(false);
        cargarProductos();
        resetFormData();
      } else {
        const error = await response.text();
        alert("Error: " + error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const resetFormData = () => {
    setFormData({
      nombre: "",
      precio: "",
      descripcion: "",
      imagen: "",
      categoriaId: "",
      tallas: tallas.map((t) => ({ tallaId: t.id, stock: 0 })),
    });
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/productos/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          cargarProductos();
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleShowModal = (producto = null) => {
    if (producto) {
      setProductoActual(producto);
      setFormData({
        ...producto,
        categoriaId: producto.categoria?.id,
        tallas: tallas.map((t) => {
          const productoTalla = producto.tallas?.find(
            (pt) => pt.talla.id === t.id
          );
          return {
            tallaId: t.id,
            stock: productoTalla ? productoTalla.stock : 0,
          };
        }),
      });
    } else {
      setProductoActual(null);
      resetFormData();
    }
    setShowModal(true);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Productos</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
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
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Stock por Talla</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{ height: "50px", objectFit: "contain" }}
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio.toFixed(2)}</td>
                  <td>{producto.categoria?.nombre}</td>
                  <td>
                    {producto.tallas?.map((t) => (
                      <div key={t.id}>
                        {t.talla?.talla || "N/A"}: {t.stock}
                      </div>
                    ))}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(producto)}
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {productoActual ? "Editar Producto" : "Nuevo Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) =>
                      setFormData({ ...formData, precio: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={formData.categoriaId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoriaId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Stock por Talla</Form.Label>
                  <Table size="sm">
                    <thead>
                      <tr>
                        <th>Talla</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tallas.map((talla, index) => (
                        <tr key={talla.id}>
                          <td>{talla.talla}</td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              value={formData.tallas[index]?.stock || 0}
                              onChange={(e) => {
                                const newTallas = [...formData.tallas];
                                newTallas[index] = {
                                  tallaId: talla.id,
                                  stock: parseInt(e.target.value) || 0,
                                };
                                setFormData({ ...formData, tallas: newTallas });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de la imagen</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.imagen}
                    onChange={(e) =>
                      setFormData({ ...formData, imagen: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                {formData.imagen && (
                  <div className="text-center mb-3">
                    <img
                      src={formData.imagen}
                      alt="Vista previa"
                      style={{
                        maxHeight: "200px",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              {productoActual ? "Actualizar" : "Crear"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProductosAdmin;
