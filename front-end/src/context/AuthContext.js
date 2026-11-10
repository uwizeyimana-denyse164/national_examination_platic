import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    setUser(res.data.user);
  };

  const register = async (username, password) => {
    const res = await API.post('/auth/register', { username, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
