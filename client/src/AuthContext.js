// AuthContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios'; // Assuming axios is set up for API calls

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const login = useCallback(async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('userId', response.data.userId);
      setIsAuthenticated(true);
      setUserId(response.data.userId);
      return response.data.userId;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


