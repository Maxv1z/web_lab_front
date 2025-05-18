import { API } from './api_common';

export function register(data: { username: string; email: string; password: string; password2: string }) {
  return API.post('/users/register/', data);
}

export function login(data: { email: string; password: string }) {
  return API.post('/users/login/', data);
}

export function logout(token: string) {
  return API.post('/users/logout/', {}, { headers: { Authorization: `Bearer ${token}` } });
}

export function refreshToken(data: { refresh: string }) {
  return API.post('/users/refresh/', data);
}
