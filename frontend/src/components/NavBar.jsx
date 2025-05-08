import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  Button,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { Heart, Bag, Search, Person } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import useFavoritosStore from "../components/store/useFavoritosStore"; // Importar el store de favoritos
import useCarritoStore from "../components/store/useCarritoStore"; // Importar el store del carrito
import "../css/Navbar.css";
import logo from "../assets/logo.png";

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const { favoritos } = useFavoritosStore();
  const { carrito } = useCarritoStore(); // Obtener el carrito desde el store

  // Calcular el número total de productos en el carrito
  const totalProductosCarrito = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  // Estado para los datos del usuario
  const [user, setUser] = useState({
    username: "",
    nombre: "",
    apellidos: "",
    email: "",
    rol: "",
  });

  // Decodificar el token y obtener los datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tiempo actual en segundos
        if (decodedToken.exp < currentTime) {
          console.warn(
            "El token ha expirado. Redirigiendo al inicio de sesión..."
          );
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setUser({
            username: decodedToken.sub || decodedToken.username || "",
            nombre: decodedToken.nombre || "",
            apellidos: decodedToken.apellidos || "",
            email: decodedToken.email || "",
            rol:
              decodedToken.authorities?.[0]?.authority ||
              decodedToken.role ||
              "USER",
          });
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  // Manejar el scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Actualizar la ruta activa
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const isActive = (path) => (activePath === path ? "active" : "");

  // Llamada a la API cuando cambia el searchQuery
  useEffect(() => {
    const fetchSuggestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token. Por favor, inicie sesión.");
        return;
      }
      if (searchQuery.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/productos?nombre=${encodeURIComponent(
            searchQuery
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // máximo 5 sugerencias
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setSuggestions([]);
      }
    };

    // Pequeño debounce para no llamar en cada letra
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

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("token");

      // Llamar al endpoint de logout
      await axios.post(
        "http://localhost:8080/auth/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Eliminar el token del localStorage
      localStorage.removeItem("token");

      // Redirigir a la página de inicio
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, limpiamos el localStorage y redirigimos
      localStorage.removeItem("token");
      window.location.href = "/";
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

            <Form
              onSubmit={handleSearch}
              className="d-flex mx-2 position-relative"
            >
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
                <Button
                  variant="transparent"
                  type="submit"
                  className="d-flex align-items-center justify-content-center"
                >
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
            {/* Ícono de Favoritos */}
            <Nav.Link
              href="/favoritos"
              className={`icon-link ${isActive("/favoritos")}`}
              title="Favoritos"
            >
              <Heart size={20} />
              <span className="badge bg-danger text-white ms-1">
                {favoritos.length}
              </span>
            </Nav.Link>

            {/* Ícono del Carrito */}
            <Nav.Link
              href="/cart"
              className={`icon-link ${isActive("/cart")}`}
              title="Carrito"
            >
              <Bag size={20} />
              {totalProductosCarrito > 0 && (
                <span className="badge bg-primary text-white ms-1">
                  {totalProductosCarrito}
                </span>
              )}
            </Nav.Link>

            {/* Menú de Usuario */}
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
                    {user.nombre} {user.apellidos}
                  </strong>
                  <small className="text-muted">{user.email}</small>
                </div>
              </NavDropdown.Item>
              {user.rol === "ADMIN" && (
                <NavDropdown.Item href="/admin" className={isActive("/admin")}>
                  <i className="bi bi-gear me-2"></i> Panel Admin
                </NavDropdown.Item>
              )}
              <NavDropdown.Item
                href="/historial"
                className={isActive("/historial")}
              >
                <i className="bi bi-clock-history me-2"></i> Historial de
                Pedidos
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="logout-item">
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
