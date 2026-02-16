import { createContext, useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(!!localStorage.getItem('token'));

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
    };

    useLayoutEffect(() => {
        const authInterceptor = axios.interceptors.request.use((config) => {
            config.headers.Authorization = !token ? undefined : `Bearer ${token}`;
            return config;
        });

        return () => {
            axios.interceptors.request.eject(authInterceptor);
        };
    }, [token]);

    useLayoutEffect(() => {
        const refreshInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(refreshInterceptor);
        };
    }, []);

    useEffect(() => {
        if (token) {
            axios.get(`${import.meta.env.VITE_API_URL}/user/me`) 
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, login, logout, token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};