// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Essayez de récupérer les données stockées, sinon initialisez avec null.
  const tokenFromStorage = localStorage.getItem('token');
  const userFromStorage = tokenFromStorage ? JSON.parse(localStorage.getItem('user')) : null;
  
  const [user, setUser] = useState(userFromStorage);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    console.log("Utilisateur connecté:", userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
