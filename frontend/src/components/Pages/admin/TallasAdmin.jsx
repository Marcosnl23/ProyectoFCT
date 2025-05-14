import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

const TallasAdmin = () => {
  const [tallas, setTallas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" o "edit"
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);

  // Obtener tallas al cargar el componente
  useEffect(() => {
    const fetchTallas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/tallas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTallas(response.data);
      } catch (err) {
        console.error("Error al obtener las tallas:", err);
        setError("No se pudieron cargar las tallas.");
      }
    };

    fetchTallas();
  }, []);

  // Abrir el modal para agregar o editar
  const handleShowModal = (type, talla = null) => {
    setModalType(type);
    setSelectedTalla(talla);
    setNombre(talla ? talla.nombre : "");
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTalla(null);
    setNombre("");
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (modalType === "add") {
        // Agregar talla
        const response = await axios.post(
          "http://localhost:8080/api/tallas",
          { talla: nombre },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTallas([...tallas, response.data]);
      } else if (modalType === "edit") {
        // Editar talla
        const response = await axios.put(
          `http://localhost:8080/api/tallas/${selectedTalla.id}`,
          { talla : nombre },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTallas(
          tallas.map((t) =>
            t.id === selectedTalla.id ? response.data : t
          )
        );
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar la talla:", err);
      setError("No se pudo guardar la talla.");
    }
  };

  // Eliminar talla
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/tallas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTallas(tallas.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error al eliminar la talla:", err);
      setError("No se pudo eliminar la talla.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gestión de Tallas</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleShowModal("add")}
      >
        Agregar Talla
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tallas.map((talla) => (
            <tr key={talla.id}>
              <td>{talla.id}</td>
              <td>{talla.talla}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal("edit", talla)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(talla.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar/editar talla */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Agregar Talla" : "Editar Talla"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la talla"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
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

export default TallasAdmin;