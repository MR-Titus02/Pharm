import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

const login = async (data) => {
  const res = await loginUser(data);

  const { token, ...userData } = res;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));

  setUser(userData);
};

const register = async (data) => {
  const res = await registerUser(data);

  const { token, ...userData } = res;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));

  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
