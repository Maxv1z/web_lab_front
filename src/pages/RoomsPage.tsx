import { useEffect, useState, useContext } from 'react';
import { fetchRooms } from '../api/rooms';
import { AuthContext } from '../context/AuthContext';
import { bookSlot } from '../api/bookings';
import RoomCard from '../components/RoomCard';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';
import { Room } from '../types';

export default function Rooms() {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const uniqueTypes = Array.from(new Set(rooms.map((room) => room.type)));

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const loadRooms = async () => {
      try {
        const res = await fetchRooms(accessToken);
        setRooms(res.data);
      } catch (err) {
        setError('Failed to load rooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [accessToken, navigate]);

  const handleBooking = async (roomId: string, start: string, end: string) => {
    try {
      await bookSlot(
        {
          room: roomId,
          start_time: start,
          end_time: end,
        },
        accessToken!
      );
      alert('Booking successful!');
      // Refresh rooms data
      const res = await fetchRooms(accessToken!);
      setRooms(res.data);
    } catch (err) {
      alert('Booking failed');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rooms-page">
      <h1>Available Rooms</h1>
      <div className="filters">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="filter-select">
          <option value="all">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="rooms-grid">
        {rooms
          .filter((room) => selectedType === 'all' || room.type === selectedType)
          .map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
      </div>
    </div>
  );
}
