import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser } from '@fortawesome/free-solid-svg-icons';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const cambiarRol = async (userId, nuevoRol) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: nuevoRol })
      });

      if (response.ok) {
        cargarUsuarios();
      }
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Gestión de Usuarios</h2>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.username}</td>
              <td>{usuario.nombre} {usuario.apellidos}</td>
              <td>{usuario.email}</td>
              <td>
                <Badge bg={usuario.role === 'ADMIN' ? 'danger' : 'primary'}>
                  {usuario.role}
                </Badge>
              </td>
              <td>
                <Button
                  variant={usuario.role === 'ADMIN' ? 'outline-danger' : 'outline-primary'}
                  size="sm"
                  onClick={() => cambiarRol(usuario.id, usuario.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                >
                  <FontAwesomeIcon icon={usuario.role === 'ADMIN' ? faUser : faUserShield} />
                  {' '}
                  {usuario.role === 'ADMIN' ? 'Hacer Usuario' : 'Hacer Admin'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UsuariosAdmin;