import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="admin-wrapper">
      <AdminHeader toggleSidebar={() => setShowSidebar(!showSidebar)} />
      <Container fluid>
        <Row>
          <Col xs={2} className={`p-0 ${showSidebar ? '' : 'd-none'}`}>
            <Sidebar />
          </Col>
          <Col xs={showSidebar ? 10 : 12}>
            <main className="py-4 px-3">
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminLayout;