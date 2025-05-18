import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/api_common';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const decodeUser = (token: string): User => {
    const decoded = jwtDecode<User>(token);
    return {
      user_id: decoded.user_id.toString(),
      username: decoded.username,
      email: decoded.email,
      is_staff: decoded.is_staff,
    };
  };

  const login = async (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setAccessToken(access);
    setUser(decodeUser(access));
    API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    navigate('/');
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('refresh_token');
      if (token) {
        await API.delete('/users/logout/', { data: { refresh_token: token } });
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setAccessToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  const tryRestoreSession = useCallback(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      setUser(decodeUser(storedToken));
      API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  useEffect(() => {
    tryRestoreSession();
  }, [tryRestoreSession]);

  return <AuthContext.Provider value={{ accessToken, user, login, logout }}>{children}</AuthContext.Provider>;
}
