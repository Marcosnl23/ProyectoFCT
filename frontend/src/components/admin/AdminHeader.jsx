import { Navbar, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function AdminHeader({ toggleSidebar }) {
  const handleLogout = () => {
    window.location.href = '/welcome';
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Button variant="outline-light" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Navbar.Brand className="ms-2">Marcos Streetwear Admin</Navbar.Brand>
        <Button variant="outline-light" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Salir
        </Button>
      </Container>
    </Navbar>
  );
}

export default AdminHeader;