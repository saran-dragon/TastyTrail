import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored && stored !== "undefined" && stored !== "null" ? JSON.parse(stored) : null;
        } catch (err) {
            console.warn("Failed to parse user data:", err);
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [isAdmin, setIsAdmin] = useState(user?.role === 'admin');

    const login = useCallback((newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData?.role === 'admin');
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    useEffect(() => {
        const syncAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            setToken(storedToken);
            setIsAuthenticated(!!storedToken);
            try {
                setUser(storedUser && storedUser !== "undefined" && storedUser !== "null" ? JSON.parse(storedUser) : null);
                setIsAdmin(JSON.parse(storedUser)?.role === 'admin');
            } catch (err) {
                console.warn("Failed to parse user data:", err);
                setUser(null);
                setIsAdmin(false);
            }
        };
        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    const authContextValue = {
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};