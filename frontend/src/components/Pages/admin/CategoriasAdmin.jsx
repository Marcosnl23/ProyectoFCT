import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" o "edit"
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState(""); // Nuevo estado para el género
  const [error, setError] = useState(null);

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/categorias",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
        setError("No se pudieron cargar las categorías.");
      }
    };

    fetchCategorias();
  }, []);

  // Abrir el modal para agregar o editar
  const handleShowModal = (type, categoria = null) => {
    setModalType(type);
    setSelectedCategoria(categoria);
    setNombre(categoria ? categoria.nombre : "");
    setGenero(categoria ? categoria.genero : ""); // Establecer el género si se edita
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategoria(null);
    setNombre("");
    setGenero(""); // Reiniciar el género
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (modalType === "add") {
        // Agregar categoría
        const response = await axios.post(
          "http://localhost:8080/api/categorias",
          { nombre, genero }, // Enviar nombre y género
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategorias([...categorias, response.data]);
      } else if (modalType === "edit") {
        // Editar categoría
        const response = await axios.put(
          `http://localhost:8080/api/categorias/${selectedCategoria.id}`,
          { nombre, genero }, // Enviar nombre y género
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategorias(
          categorias.map((cat) =>
            cat.id === selectedCategoria.id ? response.data : cat
          )
        );
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar la categoría:", err);
      setError("No se pudo guardar la categoría.");
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/categorias/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorias(categorias.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Error al eliminar la categoría:", err);
      setError("No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gestión de Categorías</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleShowModal("add")}
      >
        Agregar Categoría
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.nombre}</td>
              <td>{categoria.genero}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal("edit", categoria)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(categoria.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar/editar categoría */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Agregar Categoría" : "Editar Categoría"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la categoría"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGenero" className="mt-3">
              <Form.Label>Género</Form.Label>
              <Form.Control
                as="select"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Seleccione un género</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Unisex">Unisex</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoriasAdmin;