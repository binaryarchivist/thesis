import AuthApi from '@/api/AuthApi';
import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  userData: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('access')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refresh')
  );

  const [userData, setUserData] = useState<any>(JSON.parse(localStorage.getItem('userData')));

  const login = async (email: string, pass: string) => {
    try {
      const { data } = await AuthApi.login(email, pass);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      setUserData(data.user)
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('userData', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    // TODO: Implement logout logic on backend, invalidate the refresh token
    setAccessToken(null);
    setRefreshToken(null);
    setUserData(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Auth context is missing.');
  }
  return context;
};

export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');
export const setAccessToken = (tok: string) =>
  localStorage.setItem('access', tok);
