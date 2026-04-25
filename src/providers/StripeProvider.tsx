/**
 * Stripe Provider Component
 * Wraps the application with Stripe Elements provider
 */

import React, { ReactNode, useEffect, useState } from "react";
import { Elements, Stripe } from "@stripe/react-stripe-js";
import { getStripe, stripeConfig } from "../services/stripeService";

interface StripeProviderProps {
    children: ReactNode;
}

/**
 * StripeProvider component - Initializes Stripe and provides Elements context
 * Wrap your entire app with this component to enable Stripe functionality
 */
export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initStripe = async () => {
            try {
                const stripeInstance = await getStripe();
                if (!stripeInstance) {
                    setError("Failed to initialize Stripe");
                    console.error("Stripe initialization failed - no publishable key");
                } else {
                    setStripe(stripeInstance);
                }
            } catch (err) {
                setError("Failed to load Stripe");
                console.error("Error initializing Stripe:", err);
            } finally {
                setIsLoading(false);
            }
        };

        initStripe();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Initializing payment system...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 font-semibold mb-2">{error}</p>
                    <p className="text-gray-600 text-sm">
                        Payment system is currently unavailable. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    if (!stripe) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Loading payment system...</p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripe}
            options={{
                appearance: stripeConfig.appearance,
                locale: "en",
            }}
        >
            {children}
        </Elements>
    );
};

export default StripeProvider;
