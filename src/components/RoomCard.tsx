import { Room } from '../types';
import { Link } from 'react-router-dom';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="room-card">
      <h3>{room.name}</h3>
      <p>Location: {room.location}</p>
      <p>Capacity: {room.capacity}</p>
      <p>Type: {room.type}</p>
      <p>{room.description}</p>

      <div className="slots-container">
        <h4>Available Slots:</h4>
        <Link to={`/rooms/slots/${room.id}`} state={{ roomData: room }} className="view-slots-btn">
          View All Slots
        </Link>
      </div>
    </div>
  );
}
