
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // Se non c'è il token, manda al login
  if (!token) {
    return <Navigate to="/loginregister" replace />;
  }

  // Se loggato, lascia passare
  return <Outlet />;
};

export default PrivateRoute;
