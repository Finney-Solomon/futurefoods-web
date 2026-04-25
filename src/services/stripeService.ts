/**
 * Stripe Configuration and Service
 * Production-ready Stripe integration
 */

import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    "⚠️ VITE_STRIPE_PUBLISHABLE_KEY environment variable is not set",
  );
}

let stripeInstance: Stripe | null = null;

/**
 * Get or initialize Stripe instance
 */
export async function getStripe(): Promise<Stripe | null> {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.error("Stripe publishable key is not configured");
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY);
  }

  return stripeInstance;
}

/**
 * Stripe payment configuration
 */
export const stripeConfig = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  appearance: {
    theme: "light" as const,
    variables: {
      colorPrimary: "#22c55e", // Green like Future Foods
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "'Inter', system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "6px",
    },
  },
};

/**
 * Payment method types supported
 */
export const SUPPORTED_PAYMENT_METHODS = [
  "card",
  "apple_pay",
  "google_pay",
  "klarna",
] as const;

/**
 * Currency configuration
 */
export const CURRENCY_CONFIG = {
  code: "usd",
  symbol: "$",
  fractionDigits: 2,
};

/**
 * Test credit card numbers for development
 */
export const TEST_CARDS = {
  success: {
    number: "4242 4242 4242 4242",
    exp: "12/26",
    cvc: "123",
    zip: "10001",
    name: "Test User",
  },
  declined: {
    number: "4000 0000 0000 0002",
    exp: "12/26",
    cvc: "123",
    zip: "10001",
    name: "Test User",
  },
  mastercard: {
    number: "5555 5555 5555 4444",
    exp: "12/26",
    cvc: "123",
    zip: "10001",
    name: "Test User",
  },
  amex: {
    number: "3782 822463 10005",
    exp: "12/26",
    cvc: "1234",
    zip: "10001",
    name: "Test User",
  },
};

/**
 * Service for Stripe operations
 */
export class StripeService {
  static async processPayment(
    clientSecret: string,
    stripe: Stripe | null,
  ): Promise<any> {
    if (!stripe) {
      throw new Error("Stripe is not initialized");
    }

    // Implementation will be handled in checkout component
    return {
      clientSecret,
      status: "pending",
    };
  }

  static formatPrice(amount: number): string {
    return (amount / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  static validateCardNumber(cardNumber: string): boolean {
    // Luhn algorithm validation
    const digits = cardNumber.replace(/\D/g, "");
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}
