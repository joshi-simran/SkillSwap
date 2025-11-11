import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const Ctx = createContext();

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token); localStorage.setItem('token', res.data.token);
    setUser(res.data.user); localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    setToken(res.data.token); localStorage.setItem('token', res.data.token);
    setUser(res.data.user); localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null);
  };

  return <Ctx.Provider value={{ token, user, login, register, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx);
