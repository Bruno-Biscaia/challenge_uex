import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;  // Verifica se existe um usuário salvo e o retorna, caso contrário retorna null
  });
  

  const login = (email, password) => {
    const user = { email, password };
    setCurrentUser(user); // Define o usuário atual
    localStorage.setItem('currentUser', JSON.stringify(user)); // Armazena o usuário no localStorage
    localStorage.setItem('isAuthenticated', 'true'); // Define o estado de autenticação
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('isAuthenticated'); // Verifica a autenticação através do localStorage
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);