// src/context/AuthContext.tsx
import React, {
 createContext,
 useContext,
 useEffect,
 useState,
 ReactNode,
} from "react";
import { apiService } from "../services/api";

interface AuthContextType {
 user: any | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 login: (email: string, password: string) => Promise<void>;
 register: (name: string, email: string, password: string) => Promise<void>;
 logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
 const ctx = useContext(AuthContext);
 if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
 return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
 children,
}) => {
 const [user, setUser] = useState<any | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 // hydrate from localStorage
 useEffect(() => {
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("userData");
  if (token && userData) {
   try {
    setUser(JSON.parse(userData));
   } catch {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
   }
  }
  setIsLoading(false);
 }, []);

 const login = async (email: string, password: string) => {
  const res = await apiService.login(email, password);
  // allow admin + user (restrict to ['admin'] if you want admin-only)
  const allowedRoles = ["admin", "user"];
  if (!allowedRoles.includes(res.user.role)) {
   throw new Error("Access denied. Insufficient privileges.");
  }

  if (!res.accessToken) throw new Error("No access token in response");

  localStorage.setItem("authToken", res.accessToken);
  if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
  localStorage.setItem("userData", JSON.stringify(res.user));
  setUser(res.user);
 };

 const register = async (name: string, email: string, password: string) => {
  const res = await apiService.register(name, email, password);
  // Option A: auto-login if tokens returned
  if (res.accessToken && res.user) {
   localStorage.setItem("authToken", res.accessToken);
   if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
   localStorage.setItem("userData", JSON.stringify(res.user));
   setUser(res.user);
   return;
  }
  // Option B: if backend returns only message, require manual login
  // Do nothing here; UI can flip to "login" mode on success.
 };

 const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  setUser(null);
 };

 const isAuthenticated = !!user && ["admin", "user"].includes(user.role);

 return (
  <AuthContext.Provider
   value={{ user, isAuthenticated, isLoading, login, register, logout }}
  >
   {children}
  </AuthContext.Provider>
 );
};
