// Importaciones de React Router para navegación y rutas anidadas
import { Navigate, Outlet } from 'react-router-dom';
// Importación para decodificar tokens JWT
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
  // Obtener el token de autenticación del localStorage
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir al login
  if (!token) {
    // replace: true evita que el usuario pueda volver atrás
    return <Navigate to="/" replace />;
  }

  try {
    // Decodificar el token JWT para obtener la información del usuario
    const decodedToken = jwtDecode(token);
    
    // Extraer el rol del usuario del token
    // Si no existe role o authority, asignar 'USER' por defecto
    const rol = decodedToken.role?.[0]?.authority || 'USER';

    // Si el usuario no es admin, redirigir a la página de bienvenida
    if (rol.toLowerCase() !== 'admin') {
      return <Navigate to="/welcome" replace />;
    }

    // Si el usuario es admin, renderizar las rutas hijas
    return <Outlet />;
  } catch (error) {
    // Si hay error al decodificar el token, registrar el error
    console.error('Error al verificar rol de administrador:', error);
    // Y redirigir al login
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;