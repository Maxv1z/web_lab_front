import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute() {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
