import { API } from './api_common';

export function fetchRooms(token: string) {
  return API.get('/rooms/', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchRoomSlots(roomId: string, token: string) {
  return API.get(`/rooms/${roomId}/slots/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
