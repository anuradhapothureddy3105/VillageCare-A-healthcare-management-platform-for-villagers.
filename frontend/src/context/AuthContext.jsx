import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('villagecare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('villagecare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await apiFetch('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('villagecare_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[Auth] Token verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (username, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('villagecare_token', res.token);
      localStorage.setItem('villagecare_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('villagecare_token', res.token);
      localStorage.setItem('villagecare_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('villagecare_token');
    localStorage.removeItem('villagecare_user');
  };

  // Quick switch role helper for demonstration evaluation
  const quickSwitchRole = async (targetRole) => {
    const demoCreds = {
      admin: { username: 'admin', password: 'admin123' },
      health_worker: { username: 'asha_pentapadu', password: 'asha123' },
      villager: { username: 'villager_ramu', password: 'villager123' },
    };

    const creds = demoCreds[targetRole];
    if (creds) {
      return await login(creds.username, creds.password);
    }
  };

  const updateConsentPreferences = async (consentData) => {
    const res = await apiFetch('/auth/consent', {
      method: 'PUT',
      body: JSON.stringify(consentData),
    });

    if (res.success) {
      setUser((prev) => ({ ...prev, consentGiven: res.consentGiven }));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickSwitchRole,
        updateConsentPreferences,
        isAdmin: user?.role === 'admin',
        isHealthWorker: user?.role === 'health_worker',
        isVillager: user?.role === 'villager',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
