import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router";
import useToken from "../components/use-token";
import { login as api_login } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider() {
  const { token, setToken, removeToken } = useToken();
  console.log(`AuthProvider token: ${token}`);
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    const response = api_login(email, password);

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    setToken(data);
    // optionally decode token to set user info
    return data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
