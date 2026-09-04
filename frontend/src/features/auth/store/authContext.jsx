import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedToken =
          localStorage.getItem('accessToken');

        const storedUser =
          localStorage.getItem('user');

        const isLoggedIn =
          localStorage.getItem('isLoggedIn');

        if (
          isLoggedIn === 'true' &&
          storedToken &&
          storedUser
        ) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(
          'Restore auth session error:',
          error
        );

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const loginSuccess = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);

    localStorage.setItem(
      'isLoggedIn',
      'true'
    );

    localStorage.setItem(
      'accessToken',
      accessToken
    );

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );
  };
  const logout = () => { 
    setUser(null);
    setToken(null);
 
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginSuccess,
        logout,
        isAuthLoading
      }}
    >
      {!isAuthLoading ? (
        children
      ) : (
        <div className="flex h-screen items-center justify-center text-gray-500">
          Đang tải dữ liệu người dùng...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);