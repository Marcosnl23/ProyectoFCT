import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";

function Welcome() {
  const [username, setUsername] = useState("");
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub || decodedToken.username);
        setNombre(decodedToken.nombre);
        setApellidos(decodedToken.apellidos);
        setEmail(decodedToken.email);

        // Manejar el rol que viene como objeto
        if (
          decodedToken.authorities &&
          Array.isArray(decodedToken.authorities)
        ) {
          // Si authorities es un array, toma el primer rol
          setRol(decodedToken.authorities[0].authority || "USER");
        } else if (typeof decodedToken.role === "string") {
          // Si role es un string, úsalo directamente
          setRol(decodedToken.role);
        } else {
          setRol("USER"); // Valor por defecto
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setRol("USER"); // Valor por defecto en caso de error
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="shadow-sm"
        style={{
          background: "linear-gradient(to right, #8A2BE2, #4B0082)",
        }}
      >
        <Container>
          <Navbar.Brand href="/welcome" className="d-flex align-items-center">
            <img
              src={logo}
              height="40"
              className="d-inline-block align-top me-2"
              alt="Logo"
            />
            <span className="text-white">Tienda de Ropa</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                title={
                  <span className="text-white">
                    <i className="bi bi-person-circle me-2"></i>
                    {username}
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item className="px-4 py-3">
                  <div className="d-flex flex-column">
                    <strong>
                      {nombre} {apellidos}
                    </strong>
                    <small className="text-muted">{email}</small>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 76px)" }}
      >
        <Card style={{ width: "400px" }}>
          <Card.Body>
            <Card.Title className="text-center mb-4">
              ¡Bienvenido, {username}!{rol && <div>Tu rol es: {rol}</div>}
            </Card.Title>
            <Card.Text className="text-center">
              Has iniciado sesión correctamente. Disfruta de tu experiencia en
              nuestra tienda de ropa.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Welcome;
