// 2. Login Examples
const loginUsers = async () => {
  const credentials = [
    { email: 'max_test3@gmail.com', password: 'Andrey955113131313&&' },
  ];

  const tokens = [];

  for (const creds of credentials) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
      });
      const data = await response.json();
      console.log(`Login successful for ${creds.email}:`, data);
      tokens.push(data.access_token);
    } catch (error) {
      console.error(`Login error for ${creds.email}:`, error);
    }
  }

  return tokens;
};

// 3. Create Rooms (Admin Only)
const createRooms = async (adminToken) => {
  const rooms = [
    {
      name: 'Conference Room A',
      location: 'Floor 1',
      capacity: 10,
      type: 'Conference',
      description: 'Main conference room with projector'
    },
    {
      name: 'Meeting Room B',
      location: 'Floor 2',
      capacity: 6,
      type: 'Meeting',
      description: 'Small meeting room with whiteboard'
    },
    {
      name: 'Training Room C',
      location: 'Floor 3',
      capacity: 15,
      type: 'Training',
      description: 'Large room for training sessions'
    }
  ];

  const roomIds = [];

  for (const room of rooms) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/rooms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(room),
      });
      const data = await response.json();
      console.log('Room created:', data);
      roomIds.push(data.id);
    } catch (error) {
      console.error('Room creation error:', error);
    }
  }

  return roomIds;
};

// 4. Create Available Slots (Admin Only)
const createTimeSlots = async (adminToken, roomIds) => {
  const timeSlots = [
    // Room 1 slots
    {
      room: roomIds[0],
      start_time: '2025-05-01T09:00:00Z',
      end_time: '2025-05-01T10:00:00Z'
    },
    {
      room: roomIds[0],
      start_time: '2025-05-01T11:00:00Z',
      end_time: '2025-05-01T12:00:00Z'
    },
    {
      room: roomIds[0],
      start_time: '2025-05-01T14:00:00Z',
      end_time: '2025-05-01T15:00:00Z'
    },
    // Room 2 slots
    {
      room: roomIds[1],
      start_time: '2025-05-01T10:00:00Z',
      end_time: '2025-05-01T11:00:00Z'
    },
    {
      room: roomIds[1],
      start_time: '2025-05-01T13:00:00Z',
      end_time: '2025-05-01T14:00:00Z'
    },
    // Room 3 slots
    {
      room: roomIds[2],
      start_time: '2025-05-01T09:00:00Z',
      end_time: '2025-05-01T12:00:00Z'
    },
    {
      room: roomIds[2],
      start_time: '2025-05-01T13:00:00Z',
      end_time: '2025-05-01T16:00:00Z'
    }
  ];

  for (const slot of timeSlots) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/create-available-slot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(slot),
      });
      const data = await response.json();
      console.log('Time slot created:', data);
    } catch (error) {
      console.error('Time slot creation error:', error);
    }
  }
};

// 5. Book Rooms
const makeBookings = async (userToken, roomIds) => {
  const bookings = [
    {
      room: roomIds[0],
      start_time: '2025-05-01T09:00:00Z',
      end_time: '2025-05-01T10:00:00Z'
    },
    {
      room: roomIds[1],
      start_time: '2025-05-01T10:00:00Z',
      end_time: '2025-05-01T11:00:00Z'
    },
    {
      room: roomIds[2],
      start_time: '2025-05-01T13:00:00Z',
      end_time: '2025-05-01T16:00:00Z'
    }
  ];

  for (const booking of bookings) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(booking),
      });
      const data = await response.json();
      console.log('Booking request sent:', data);
    } catch (error) {
      console.error('Booking error:', error);
    }
  }
};

// 6. Get User Bookings
const getUserBookings = async (userToken, userId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/bookings/${userId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    const data = await response.json();
    console.log('User bookings:', data);
  } catch (error) {
    console.error('Error getting bookings:', error);
  }
};

// 7. Get Available Rooms
const getAvailableRooms = async (token) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/rooms/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('Available rooms:', data);
  } catch (error) {
    console.error('Error getting rooms:', error);
  }
};

// 8. Get Available Slots for a Room
const getRoomSlots = async (token, roomId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/rooms/${roomId}/slots/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(`Available slots for room ${roomId}:`, data);
  } catch (error) {
    console.error('Error getting room slots:', error);
  }
};

// Main execution flow
const populateDatabase = async () => {

  // 2. Login to get tokens (first token will be admin)
  const tokens = await loginUsers();
  const adminToken = tokens[0];
  const userToken = tokens[1];

  // 3. Create rooms (admin only)
  // 3. Create rooms (admin only)
  const roomIds = await createRooms(adminToken);

  // 4. Create time slots (admin only)
  await createTimeSlots(adminToken, roomIds);

  // 5. Make some bookings (as regular user)
  await makeBookings(userToken, roomIds);

  // 6. Get user bookings
  // await getUserBookings(userToken, 2); // Assuming user1 has ID 2

  // // 7. Get available rooms
  // await getAvailableRooms(userToken);

  // // 8. Get available slots for a specific room
  // await getRoomSlots(userToken, roomIds[0]);

  console.log('Database population complete!');
};

// Run the full test sequence
populateDatabase();