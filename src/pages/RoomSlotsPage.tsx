import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchRoomSlots } from '../api/rooms';
import { bookSlot } from '../api/bookings';
import { Room, TimeSlot } from '../types';
import './RoomSlots.css';

export default function RoomSlots() {
  const location = useLocation();
  const { accessToken } = useContext(AuthContext);
  const { roomId } = useParams<{ roomId: string }>();

  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const loadData = async () => {
      try {
        // Get room data from navigation state
        const locationState = location.state;
        if (locationState?.roomData) {
          setRoom(locationState.roomData);
        }

        // Fetch slots
        const slotsRes = await fetchRoomSlots(roomId, accessToken);
        setSlots(slotsRes.data);
      } catch (err) {
        setError('Failed to load room data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roomId, accessToken, location.state]);

  const handleBooking = async (start: string, end: string) => {
    try {
      if (!roomId) return;

      await bookSlot({ room: roomId, start_time: start, end_time: end }, accessToken!);
      alert('Booking successful!');
      const res = await fetchRoomSlots(roomId!, accessToken!);
      setSlots(res.data);
    } catch (err) {
      alert('Booking failed');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="room-slots-page">
      <h1>{room?.name} Slots</h1>
      <div className="room-info">
        <p>Location: {room?.location}</p>
        <p>Capacity: {room?.capacity}</p>
        <p>Type: {room?.type}</p>
      </div>
      <div className="slots-grid">
        {slots.map((slot) => {
          const startDate = new Date(slot.start_time);
          const endDate = new Date(slot.end_time);
          const isInvalid = startDate > endDate;
          const isPast = endDate < new Date();

          return (
            <div key={slot.id} className={`slot-card ${isPast ? 'past-slot' : ''}`}>
              <div className="slot-time">
                <div className="date-range">
                  {isInvalid ? (
                    <span className="error-text">Invalid time range</span>
                  ) : (
                    <>
                      <time>{startDate.toLocaleDateString()}</time>
                      <div className="time-range">
                        {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
                      </div>
                      <div className="duration">Duration: {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))}h</div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleBooking(slot.start_time, slot.end_time)}
                className="book-btn"
                disabled={!slot.is_available || isPast || isInvalid}
              >
                {slot.is_available ? 'Book Slot' : 'Booked'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
