import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Heart, Bag, Search } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import "../css/Navbar.css";
import { Person } from 'react-bootstrap-icons';
import logo from "../assets/logo.png";

function NavBar({username, nombre, apellidos, email, rol, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");

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
              href="/hombre"
              className={`nav-link-custom mx-2 ${isActive("/hombre")}`}
            >
              Hombre
            </Nav.Link>
            <Nav.Link
              href="/mujer"
              className={`nav-link-custom mx-2 ${isActive("/mujer")}`}
            >
              Mujer
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link href="/cart" className={`icon-link ${isActive("/cart")}`}>
              <Bag size={20} />
            </Nav.Link>
            <Nav.Link
              href="/search"
              className={`icon-link ${isActive("/search")}`}
            >
              <Search size={20} />
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
