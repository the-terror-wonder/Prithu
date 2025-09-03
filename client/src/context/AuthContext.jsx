import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start in a loading state

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Ask the backend "who am I?"
                const res = await api.get('/auth/me');
                setUser(res.data); // If successful, save the user
            } catch (err) {
                // If the cookie is invalid or expired, this will fail
                setUser(null);
            } finally {
                setLoading(false); // Stop loading once the check is complete
            }
        };
        checkLoggedIn();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};  