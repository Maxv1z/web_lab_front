import { useEffect, useState, useContext } from 'react';
import { fetchBookings, cancelBooking } from '../api/bookings';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Bookings.css';
import { Booking } from '../types';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const loadBookings = async () => {
      try {
        const userId = user?.user_id;
        if (!userId) return <div>Not authenticated</div>;
        const res = await fetchBookings(userId, accessToken!);
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [accessToken, user?.user_id, navigate]);

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id, accessToken!);
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'canceled' } : b)));
      alert('Booking cancelled');
    } catch (err) {
      alert('Failed to cancel booking');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.end_time) > now);
  const pastBookings = bookings.filter((b) => new Date(b.end_time) <= now);

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <>
          {upcomingBookings.length > 0 && (
            <section className="bookings-section">
              <h2>Upcoming Bookings</h2>
              <ul className="bookings-list">
                {upcomingBookings.map((b) => (
                  <li key={b.id} className="booking-item">
                    <div className="booking-info">
                      <h3>{b.room ? b.room.name : `Room #${b.room_id}`}</h3>
                      <p>
                        {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                      </p>
                      <span className={`status status_${b.status}`}>{b.status}</span>
                    </div>
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancel(b.id)} className="cancel-btn">
                        Cancel
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {pastBookings.length > 0 && (
            <section className="bookings-section">
              <h2>Past Bookings</h2>
              <ul className="bookings-list">
                {pastBookings.map((b) => (
                  <li key={b.id} className="booking-item">
                    <div className="booking-info">
                      <h3>{b.room ? b.room.name : `Room #${b.room_id}`}</h3>
                      <p>
                        {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                      </p>
                      <span className={`status status_${b.status}`}>{b.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
