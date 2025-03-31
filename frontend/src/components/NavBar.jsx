import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Heart, Bag, Search } from 'react-bootstrap-icons';
import '../css/Navbar.css'; // Asegúrate de crear este archivo CSS

function NavBar({ logo, username, nombre, apellidos, email, rol, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para cambiar estilo del navbar
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
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
            <Nav.Link href="/hombre" className="nav-link-custom mx-2">Hombre</Nav.Link>
            <Nav.Link href="/mujer" className="nav-link-custom mx-2">Mujer</Nav.Link>
          </Nav>
          
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link href="/cart" className="icon-link">
              <Bag size={20} />
            </Nav.Link>
            
            <NavDropdown 
              align="end"
              title={
                <span className="user-dropdown">
                  {username}
                </span>
              } 
              id="basic-nav-dropdown"
              className="user-dropdown-container"
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