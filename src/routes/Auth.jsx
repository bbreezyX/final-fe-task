import React, { createContext, useContext, useState } from 'react';

// Buat Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk login

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan context
export const useAuth = () => useContext(AuthContext);
