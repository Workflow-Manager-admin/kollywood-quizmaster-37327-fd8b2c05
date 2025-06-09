import React, { createContext, useContext, useState, useEffect } from "react";

// PUBLIC_INTERFACE
const AuthContext = createContext();

/**
 * AuthProvider: Provides authentication state (mocked) to children.
 * Persists user session via localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("kq_user"));
    if (savedUser) setUser(savedUser);
  }, []);

  function login(username) {
    const mockUser = { name: username || "Superstar", id: "demo_user" };
    setUser(mockUser);
    localStorage.setItem("kq_user", JSON.stringify(mockUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("kq_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to get authentication context.
 */
// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
