import { Booking, BookingForm, ApiResponse } from '../types';
import { API } from './api_common';

export function bookSlot(data: BookingForm, token: string): Promise<ApiResponse<Booking>> {
  return API.post('/bookings/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchBookings(userId: string, token: string): Promise<ApiResponse<Booking[]>> {
  return API.get(`/bookings/${userId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function cancelBooking(bookingId: number, token: string): Promise<ApiResponse<{ message: string }>> {
  return API.delete(`/bookings/${bookingId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
