"use client"; // Mark this file as a client component

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null); // Initialize token as null
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if the code is running in the browser
        if (typeof window !== "undefined") {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
                fetchUserData(savedToken); // Fetch user data with the saved token
            } else {
                setLoading(false);
            }
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5500/api/v1/users', {
                headers: {
                    Authorization: `Bearer ${token}` // Use the token in the Authorization header
                }
            });
            setUser(response.data); // Update user state with the fetched user data
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            logout(); // Logout if fetching user data fails
        } finally {
            setLoading(false);
        }
    };

    const login = (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem('token', token);
        }

        setToken(token);
        fetchUserData(token);
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem('token');
        }
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
