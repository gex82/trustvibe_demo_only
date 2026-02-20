import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, Contractor } from "../types";
import { findUserByCredentials } from "../data/users";

interface AuthContextType {
  currentUser: User | Contractor | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | Contractor | null>(null);

  const login = (email: string, password: string): boolean => {
    const user = findUserByCredentials(email, password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
