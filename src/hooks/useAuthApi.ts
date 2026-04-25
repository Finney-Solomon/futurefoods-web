/**
 * useAuth Hook
 * Custom React hook for authentication with Stripe/API integration
 */

import { useState, useCallback, useEffect } from "react";
import { apiService } from "../services/apiService";
import {
  ApiUser,
  LoginRequest,
  RegisterRequest,
} from "../services/types/apiTypes";
import {
  getUserFriendlyMessage,
  ErrorHandlers,
} from "../services/errorHandler";

interface UseAuthReturn {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  isAdmin: () => boolean;
}

/**
 * useAuth - Hook for authentication management
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Verify token is still valid
        try {
          await apiService.getCurrentUser();
        } catch (err) {
          // Token expired, clear auth
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await apiService.login(loginRequest);

      setUser(response.user);
      localStorage.setItem("userData", JSON.stringify(response.user));

      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
    } catch (err) {
      const message = ErrorHandlers.handleAuthError(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const registerRequest: RegisterRequest = {
          name,
          email,
          password,
          role: "customer",
        };

        const response = await apiService.register(registerRequest);

        if (response.user) {
          setUser(response.user);
          localStorage.setItem("userData", JSON.stringify(response.user));

          if (response.accessToken) {
            // Token is already set in apiService.register
            localStorage.setItem("authToken", response.accessToken);
          }

          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken);
          }
        }
      } catch (err) {
        const message = ErrorHandlers.handleAuthError(err);
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    apiService.logout();
    setUser(null);
    localStorage.removeItem("userData");
    setError(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await apiService.refreshToken(refreshToken);
      setUser(response.user);
      localStorage.setItem("userData", JSON.stringify(response.user));

      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
    } catch (err) {
      logout();
    }
  }, [logout]);

  const isAdmin = useCallback((): boolean => {
    return user?.role === "admin";
  }, [user]);

  const isAuthenticated = !!user && !!localStorage.getItem("authToken");

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAuth,
    isAdmin,
  };
}

export default useAuth;
