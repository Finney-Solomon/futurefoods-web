/**
 * Error Handling Utilities
 * Production-ready error management and user-friendly messages
 */

import { ApiError } from "./types/apiTypes";

/**
 * Custom API error class
 */
export class ApiErrorHandler extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any,
    public userMessage?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  if (!error) {
    return "An unknown error occurred";
  }

  // API Error with explicit message
  if (error.userMessage) {
    return error.userMessage;
  }

  // Handle different error types
  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  // Status-based messages
  if (error.status) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "You are not authenticated. Please log in.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "This action conflicts with existing data.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return `Error: ${error.message || "Unknown error"}`;
    }
  }

  return "An unexpected error occurred";
}

/**
 * Specific error handlers for common scenarios
 */
export const ErrorHandlers = {
  /**
   * Handle authentication errors
   */
  handleAuthError: (error: any): string => {
    if (error.status === 401 || error.message?.includes("authenticate")) {
      return "Your session has expired. Please log in again.";
    }
    if (error.message?.includes("invalid credentials")) {
      return "Invalid email or password.";
    }
    return "Authentication failed. Please try again.";
  },

  /**
   * Handle validation errors
   */
  handleValidationError: (error: any): string => {
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      return error.data.errors.map((e: any) => e.message).join(", ");
    }
    if (error.data?.field) {
      return `Invalid ${error.data.field}: ${error.message}`;
    }
    return "Validation failed. Please check your input.";
  },

  /**
   * Handle cart errors
   */
  handleCartError: (error: any): string => {
    if (error.message?.includes("stock")) {
      return "This item is out of stock.";
    }
    if (error.message?.includes("quantity")) {
      return "Invalid quantity. Please check and try again.";
    }
    if (error.message?.includes("product")) {
      return "Product not found.";
    }
    return "Failed to update cart. Please try again.";
  },

  /**
   * Handle payment errors
   */
  handlePaymentError: (error: any): string => {
    if (error.message?.includes("card")) {
      return "Card error. Please check your card details and try again.";
    }
    if (error.message?.includes("decline")) {
      return "Your card was declined. Please try another card.";
    }
    if (error.message?.includes("expired")) {
      return "Your card has expired. Please use another card.";
    }
    if (error.message?.includes("3D")) {
      return "3D Secure authentication required.";
    }
    return "Payment failed. Please try again.";
  },

  /**
   * Handle network errors
   */
  handleNetworkError: (error: any): string => {
    if (
      error.message?.includes("fetch") ||
      error.message?.includes("network")
    ) {
      return "Network error. Please check your connection and try again.";
    }
    if (error.status === 0) {
      return "Unable to reach the server. Please try again later.";
    }
    return "Network error occurred. Please try again.";
  },

  /**
   * Handle not found errors
   */
  handleNotFoundError: (): string => {
    return "The requested resource was not found.";
  },

  /**
   * Handle server errors
   */
  handleServerError: (): string => {
    return "Server error occurred. Please try again later.";
  },

  /**
   * Handle rate limit errors
   */
  handleRateLimitError: (): string => {
    return "Too many requests. Please wait a moment and try again.";
  },
};

/**
 * Error logger for debugging
 */
export const ErrorLogger = {
  log: (error: any, context?: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = {
      timestamp,
      context,
      error: {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack,
      },
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error("🔴 API Error:", logMessage);
    }

    // Could be sent to error tracking service (Sentry, etc.)
    // sendToErrorTracker(logMessage);
  },

  logValidationError: (error: any, context?: string) => {
    ErrorLogger.log(error, `Validation Error - ${context}`);
  },

  logAuthError: (error: any) => {
    ErrorLogger.log(error, "Auth Error");
  },

  logPaymentError: (error: any) => {
    ErrorLogger.log(error, "Payment Error");
  },

  logNetworkError: (error: any) => {
    ErrorLogger.log(error, "Network Error");
  },
};

/**
 * Retry logic for failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}

/**
 * Safe async function wrapper for error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: any) => void,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      ErrorLogger.log(error, "Unhandled async error");
    }
    return null;
  }
}
