import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown, Form, Button, InputGroup, ListGroup } from "react-bootstrap";
import { Heart, Bag, Search, Person } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import logo from "../assets/logo.png";

function NavBar({ username, nombre, apellidos, email, rol, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const isActive = (path) => (activePath === path ? "active" : "");

  // 🟢 LLAMADA A LA API cuando cambia el searchQuery
  useEffect(() => {
    const fetchSuggestions = async () => {
      const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token. Por favor, inicie sesión.");
          setLoading(false);
          return;
        }
      if (searchQuery.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/productos?nombre=${encodeURIComponent(searchQuery)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // máximo 5 sugerencias
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setSuggestions([]);
      }
    };

    // pequeño debounce (opcional) para no llamar en cada letra
    const timeoutId = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.nombre); 
    navigate(`/buscar?q=${encodeURIComponent(suggestion.nombre)}`);
    setSuggestions([]);
  };

  return (
    <Navbar expand="lg" fixed="top" className={`custom-navbar ${isScrolled ? "scrolled" : ""}`}>
      <Container>
        <Navbar.Brand href="/welcome" className="d-flex align-items-center">
          <img src={logo} height="36" className="d-inline-block align-top me-2" alt="Logo" />
          <span className="brand-text">Marcos Streetwear</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/welcome" className={`nav-link-custom mx-2 ${isActive("/welcome")}`}>Home</Nav.Link>
            <Nav.Link href="/Contacto" className={`nav-link-custom mx-2 ${isActive("/Contacto")}`}>Contacto</Nav.Link>

            <Form onSubmit={handleSearch} className="d-flex mx-2 position-relative">
              <InputGroup className="rounded-pill border overflow-hidden bg-light">
                <Form.Control
                  type="search"
                  placeholder="Buscar productos..."
                  aria-label="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent shadow-none"
                  autoComplete="off"
                />
                <Button variant="transparent" type="submit" className="d-flex align-items-center justify-content-center">
                  <Search size={16} />
                </Button>
              </InputGroup>

              {suggestions.length > 0 && (
                <ListGroup
                  className="position-absolute top-100 start-0 w-100 shadow-sm zindex-tooltip"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {suggestions.map((suggestion, idx) => (
                    <ListGroup.Item
                      key={suggestion.id || idx}
                      action
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.nombre}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form>
          </Nav>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link href="/cart" className={`icon-link ${isActive("/cart")}`}><Bag size={20} /></Nav.Link>

            <NavDropdown
              align="end"
              title={<span className="user-dropdown"><Person size={20} className="person-icon" /></span>}
              id="basic-nav-dropdown"
              className="user-dropdown-container"
            >
              <NavDropdown.Item className="px-4 py-3" style={{ minWidth: "250px" }}>
                <div className="d-flex flex-column">
                  <strong>{nombre} {apellidos}</strong>
                  <small className="text-muted">{email}</small>
                </div>
              </NavDropdown.Item>
              {rol === "ADMIN" && (
                <NavDropdown.Item href="/admin" className={isActive("/admin")}>
                  <i className="bi bi-gear me-2"></i> Panel Admin
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout} className="logout-item">
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
