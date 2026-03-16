import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const stored = localStorage.getItem("animeVaultToken");
  const storedUser = localStorage.getItem("animeVaultUser");

  const [token, setToken] = useState(stored || null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  function login(newToken, username) {
    localStorage.setItem("animeVaultToken", newToken);
    localStorage.setItem("animeVaultUser", JSON.stringify({ username }));
    setToken(newToken);
    setUser({ username });
  }

  function logout() {
    localStorage.removeItem("animeVaultToken");
    localStorage.removeItem("animeVaultUser");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
