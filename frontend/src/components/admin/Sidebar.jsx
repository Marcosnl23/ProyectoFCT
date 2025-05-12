import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faUsers, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar bg-dark text-white min-vh-100">
      <div className="sidebar-header p-3">
        <h4 className="text-white">Panel Admin</h4>
      </div>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/admin" 
          className={`text-white ${location.pathname === '/admin' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faHome} className="me-2" /> Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/productos" 
          className={`text-white ${location.pathname === '/admin/productos' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faBox} className="me-2" /> Productos
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/usuarios" 
          className={`text-white ${location.pathname === '/admin/usuarios' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faUsers} className="me-2" /> Usuarios
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/admin/pedidos" 
          className={`text-white ${location.pathname === '/admin/pedidos' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Pedidos
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;