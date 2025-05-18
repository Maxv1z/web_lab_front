// Auth types
export type User = {
  user_id: string;
  username: string;
  email: string;
  is_staff: boolean;
  exp?: number;
  iat?: number;
  jti?: string;
  token_type?: string;
};

export type AuthContextType = {
  accessToken: string | null;
  user: User | null;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
};

// Room types
export type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  type: string;
  description: string;
  available_slots?: TimeSlot[];
};

export type TimeSlot = {
  id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

// Booking types
export type Booking = {
  id: number;
  user_id: string;
  room_id: number;
  room?: Room; // Optional room details
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
};

// API response types
export type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
};

export type ErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

// Form types
export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

export type BookingForm = {
  room: string;
  start_time: string;
  end_time: string;
};
