import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Rooms from './pages/RoomsPage';
import Bookings from './pages/BookingsPage';
import PrivateRoute from './components/PrivateRoute';
import RoomSlots from './pages/RoomSlotsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Login and Register */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Rooms />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/rooms/slots/:roomId" element={<RoomSlots />} />
      </Route>
    </Routes>
  );
}
