// Importaciones necesarias
import { useState } from 'react'; // Para manejar el estado del sidebar
import { Container, Row, Col } from 'react-bootstrap'; // Componentes de layout de Bootstrap
import { Outlet } from 'react-router-dom'; // Para renderizar rutas anidadas
import Sidebar from './Sidebar'; // Barra lateral de navegación
import AdminHeader from './AdminHeader'; // Cabecera del panel admin

function AdminLayout() {
  // Estado para controlar la visibilidad del sidebar
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="admin-wrapper">
      {/* Cabecera con función para alternar sidebar */}
      <AdminHeader toggleSidebar={() => setShowSidebar(!showSidebar)} />
      
      {/* Contenedor principal fluido (ocupa todo el ancho) */}
      <Container fluid>
        <Row>
          {/* Columna del sidebar (2/12 del ancho) */}
          <Col xs={2} className={`p-0 ${showSidebar ? '' : 'd-none'}`}>
            <Sidebar />
          </Col>
          
          {/* Columna del contenido principal (10/12 o 12/12 según sidebar) */}
          <Col xs={showSidebar ? 10 : 12}>
            <main className="py-4 px-3">
              {/* Outlet renderiza las rutas hijas */}
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminLayout;