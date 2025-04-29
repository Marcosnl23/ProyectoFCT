import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown, Form, Button, InputGroup } from "react-bootstrap";
import { Heart, Bag, Search, Person } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import logo from "../assets/logo.png";

function NavBar({username, nombre, apellidos, email, rol, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Actualizar la ruta activa cuando cambia la ubicación
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return activePath === path ? "active" : "";
  };

  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navegar a la página de resultados de búsqueda con el parámetro de consulta
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${isScrolled ? "scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand href="/welcome" className="d-flex align-items-center">
          <img
            src={logo}
            height="36"
            className="d-inline-block align-top me-2"
            alt="Logo"
          />
          <span className="brand-text">Marcos Streetwear</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              href="/welcome"
              className={`nav-link-custom mx-2 ${isActive("/welcome")}`}
            >
              Home
            </Nav.Link>
           
            
            <Nav.Link
              href="/Contacto"
              className={`nav-link-custom mx-2 ${isActive("/Contacto")}`}
            >
              Contacto
            </Nav.Link>

             
            {/* Buscador con clases de Bootstrap */}
            <Form onSubmit={handleSearch} className="d-flex mx-2">
              <InputGroup className="rounded-pill border overflow-hidden bg-light">
                <Form.Control
                  type="search"
                  placeholder="Buscar productos..."
                  aria-label="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent shadow-none"
                />
                <Button 
                  variant="transparent" 
                  type="submit"
                  className="d-flex align-items-center justify-content-center"
                >
                  <Search size={16} />
                </Button>
              </InputGroup>
            </Form>
          </Nav>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link href="/cart" className={`icon-link ${isActive("/cart")}`}>
              <Bag size={20} />
            </Nav.Link>

            <NavDropdown
              align="end"
              title={
                <span className="user-dropdown">
                  <Person size={20} className="person-icon" />
                </span>
              }
              id="basic-nav-dropdown"
              className="user-dropdown-container"
            >
              <NavDropdown.Item
                className="px-4 py-3"
                style={{ minWidth: "250px" }}
              >
                <div className="d-flex flex-column">
                  <strong>
                    {nombre} {apellidos}
                  </strong>
                  <small className="text-muted">{email}</small>
                </div>
              </NavDropdown.Item>
              {rol === "ADMIN" && (
                <NavDropdown.Item href="/admin" className={isActive("/admin")}>
                  <i className="bi bi-gear me-2"></i>
                  Panel Admin
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout} className="logout-item">
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;