import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const rol = decodedToken.role?.[0]?.authority || 'USER';

    if (rol.toLowerCase() !== 'admin') {
      return <Navigate to="/welcome" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;