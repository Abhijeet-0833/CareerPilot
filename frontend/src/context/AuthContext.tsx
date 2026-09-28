import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { authApi, notificationApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  unreadCount: number;
  login: (email: string, pass: string) => Promise<User>;
  register: (email: string, pass: string, name: string, confirmPass?: string) => Promise<User>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otpCode: string) => Promise<User>;
  logout: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cp_user');
    const token = localStorage.getItem('cp_token');
    if (saved && token) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, token };
      } catch {}
    }
    return null;
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);

  const role: UserRole = user?.role || 'JOB_SEEKER';

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem('cp_user', JSON.stringify(user));
      localStorage.setItem('cp_token', user.token);
      refreshNotifications();
    } else {
      localStorage.removeItem('cp_user');
      localStorage.removeItem('cp_token');
      setUnreadCount(0);
    }
  }, [user]);

  const refreshNotifications = async () => {
    if (user && user.token) {
      try {
        const count = await notificationApi.getUnreadCount();
        setUnreadCount(count);
      } catch {}
    }
  };

  const login = async (email: string, pass: string): Promise<User> => {
    const u = await authApi.login(email, pass);
    setUser(u);
    return u;
  };

  const register = async (email: string, pass: string, name: string): Promise<User> => {
    const u = await authApi.register(email, pass, name, 'JOB_SEEKER');
    // Note: User requires email verification before signing in
    return u;
  };

  const sendOtp = async (email: string) => {
    await authApi.sendOtp(email);
  };

  const verifyOtp = async (email: string, otpCode: string): Promise<User> => {
    const u = await authApi.verifyOtp(email, otpCode);
    setUser(u);
    return u;
  };

  const resendVerification = async (email: string) => {
    await authApi.resendVerification(email);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    localStorage.removeItem('cp_user');
    localStorage.removeItem('cp_token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        unreadCount,
        login,
        register,
        sendOtp,
        verifyOtp,
        logout,
        resendVerification,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
