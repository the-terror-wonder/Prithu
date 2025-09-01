// client/src/context/AuthContext.jsx
import React from 'react';
import { createContext, useState, useContext } from 'react';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // We check for a simple flag in localStorage to remember the user across refreshes
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuthenticated'));

    const login = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};