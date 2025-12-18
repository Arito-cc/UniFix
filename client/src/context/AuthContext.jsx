import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Unified helper for setting headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          
          // Check expiration (exp is in seconds)
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
          } else {
            // CRITICAL: Set the header BEFORE setting the user state
            setAuthToken(token);
            setUser({
              id: decodedToken.user.id,
              role: decodedToken.user.role,
              department: decodedToken.user.department || null,
            });
          }
        } catch (error) {
          console.error('Session restore failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    const decodedToken = jwtDecode(token);
    setUser({
      id: decodedToken.user.id,
      role: decodedToken.user.role,
      department: decodedToken.user.department || null,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      token: localStorage.getItem('token') // Added for direct access if needed
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};