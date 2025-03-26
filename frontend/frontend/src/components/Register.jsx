import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Enviar datos al backend
      await axios.post("http://localhost:8080/auth/api/register", {
        username,
        password,
        nombre,
        apellidos,
        email,
        rol: "USER",
      });

      setSuccess(
        "Usuario registrado exitosamente. Ahora puedes iniciar sesión."
      );
      setUsername("");
      setPassword("");
      setNombre("");
      setApellidos("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data || "Error al registrar el usuario.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
        padding: "20px 0",
      }}
    >
      <div
        className="bg-white rounded-4 overflow-hidden shadow-lg"
        style={{ width: "500px" }}
      >
        <div
          className="text-center text-white p-4"
          style={{
            background: "linear-gradient(to right, #8A2BE2, #4B0082)",
          }}
        >
          <h2 className="mb-0">Crear Cuenta</h2>
        </div>

        {error && (
          <div className="alert alert-danger mx-4 mt-3 text-center rounded-3">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success mx-4 mt-3 text-center rounded-3">
            {success}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="p-4">
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <div className="position-relative">
                  <i
                    className="bi bi-person position-absolute"
                    style={{ left: "15px", top: "12px", color: "#8A2BE2" }}
                  ></i>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="ps-5"
                    style={{
                      borderRadius: "20px",
                      border: "1px solid #8A2BE2",
                      height: "45px",
                    }}
                  />
                </div>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <div className="position-relative">
                  <i
                    className="bi bi-person-plus position-absolute"
                    style={{ left: "15px", top: "12px", color: "#8A2BE2" }}
                  ></i>
                  <Form.Control
                    type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                    className="ps-5"
                    style={{
                      borderRadius: "20px",
                      border: "1px solid #8A2BE2",
                      height: "45px",
                    }}
                  />
                </div>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <div className="position-relative">
              <i
                className="bi bi-envelope position-absolute"
                style={{ left: "15px", top: "12px", color: "#8A2BE2" }}
              ></i>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="ps-5"
                style={{
                  borderRadius: "20px",
                  border: "1px solid #8A2BE2",
                  height: "45px",
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="position-relative">
              <i
                className="bi bi-person-circle position-absolute"
                style={{ left: "15px", top: "12px", color: "#8A2BE2" }}
              ></i>
              <Form.Control
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="ps-5"
                style={{
                  borderRadius: "20px",
                  border: "1px solid #8A2BE2",
                  height: "45px",
                }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <div className="position-relative">
              <i
                className="bi bi-lock position-absolute"
                style={{ left: "15px", top: "12px", color: "#8A2BE2" }}
              ></i>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="ps-5"
                style={{
                  borderRadius: "20px",
                  border: "1px solid #8A2BE2",
                  height: "45px",
                }}
              />
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 mb-3 py-2"
            style={{
              background: "linear-gradient(to right, #8A2BE2, #4B0082)",
              border: "none",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "500",
              height: "45px",
            }}
          >
            Registrarse
          </Button>

          <div className="text-center">
            <a
              href="/"
              className="text-decoration-none fw-bold"
              style={{ color: "#8A2BE2" }}
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
