import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

function NavBar({ logo, username, nombre, apellidos, email, rol, onLogout }) {
  return (
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
              align="end"
              title={
                <span className="text-white">
                  <i className="bi bi-person-circle me-2"></i>
                  {username}
                </span>
              } 
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item className="px-4 py-3" style={{ minWidth: '250px' }}>
                <div className="d-flex flex-column">
                  <strong>{nombre} {apellidos}</strong>
                  <small className="text-muted">{email}</small>
                </div>
              </NavDropdown.Item>
              {rol === 'ADMIN' && (
                <NavDropdown.Item href="/admin">
                  <i className="bi bi-gear me-2"></i>
                  Panel Admin
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>
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