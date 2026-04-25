/**
 * Stripe Payment Form Component
 * Production-ready payment form with validation and error handling
 */

import React, { useState, FormEvent } from "react";
import {
    CardElement,
    useStripe,
    useElements,
    CardElementProps,
} from "@stripe/react-stripe-js";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";
import { getUserFriendlyMessage, ErrorHandlers } from "../services/errorHandler";

interface PaymentFormProps {
    clientSecret: string;
    orderId: string;
    amount: number;
    onSuccess?: (paymentIntentId: string) => void;
    onError?: (error: string) => void;
    loading?: boolean;
}

const CARD_ELEMENT_OPTIONS: CardElementProps["options"] = {
    style: {
        base: {
            fontSize: "16px",
            color: "#424770",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#9e2146",
        },
    },
    hidePostalCode: false,
};

/**
 * PaymentForm - Handles payment processing with Stripe
 */
export const PaymentForm: React.FC<PaymentFormProps> = ({
    clientSecret,
    orderId,
    amount,
    onSuccess,
    onError,
    loading = false,
}) => {
    const stripe = useStripe();
    const elements = useElements();

    // Ensure amount is a valid number
    const safeAmount = typeof amount === "number" && !isNaN(amount) && amount > 0 ? amount : 0;

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [cardholderName, setCardholderName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError("Payment system not ready. Please refresh the page.");
            return;
        }

        // Validation
        if (!cardholderName.trim()) {
            setError("Please enter cardholder name");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                throw new Error("Card element not found");
            }

            // Create payment method
            const { error: methodError, paymentMethod } =
                await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
                    billing_details: {
                        name: cardholderName,
                        email: email,
                    },
                });

            if (methodError) {
                const friendlyError = ErrorHandlers.handlePaymentError(methodError);
                setError(friendlyError);
                if (onError) onError(friendlyError);
                return;
            }

            // Confirm payment with client secret
            const { error: confirmError, paymentIntent } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod.id,
                });

            if (confirmError) {
                const friendlyError = ErrorHandlers.handlePaymentError(confirmError);
                setError(friendlyError);
                if (onError) onError(friendlyError);
                return;
            }

            // Payment successful
            if (
                paymentIntent &&
                paymentIntent.status === "succeeded"
            ) {
                setSuccess(true);
                if (onSuccess) onSuccess(paymentIntent.id);
            } else {
                setError("Payment could not be processed. Please try again.");
            }
        } catch (err: any) {
            const friendlyError = ErrorHandlers.handlePaymentError(err);
            setError(friendlyError);
            if (onError) onError(friendlyError);
        } finally {
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <Card className="p-6 border-green-200 bg-green-50">
                <div className="flex items-center gap-3 text-green-700 mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                    <h3 className="font-semibold text-lg">Payment Successful!</h3>
                </div>
                <p className="text-green-700 text-sm">
                    Your payment has been processed successfully. You will receive a
                    confirmation email shortly.
                </p>
                <p className="text-green-700 text-sm mt-2">
                    <strong>Order ID:</strong> {orderId}
                </p>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                {/* Cardholder Name */}
                <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                        id="cardholderName"
                        type="text"
                        placeholder="John Doe"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        disabled={isProcessing || loading}
                        className="mt-1"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isProcessing || loading}
                        className="mt-1"
                        required
                    />
                </div>

                {/* Card Details */}
                <div>
                    <Label>Card Details</Label>
                    <Card className="p-3 mt-1 border">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </Card>
                    <p className="text-xs text-gray-500 mt-2">
                        Your card information is secured by Stripe
                    </p>
                </div>

                {/* Amount Display */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount to charge:</span>
                        <span className="font-bold text-lg">
                            ${(safeAmount / 100).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={!stripe || isProcessing || loading || safeAmount === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                size="lg"
            >
                {isProcessing || loading ? (
                    <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay $${(safeAmount / 100).toFixed(2)}`
                )}
            </Button>

            {/* Test Cards Info */}
            {import.meta.env.DEV && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200 text-xs text-blue-700">
                    <p className="font-semibold mb-2">Test Cards (Development Only):</p>
                    <ul className="space-y-1">
                        <li>✓ Success: 4242 4242 4242 4242</li>
                        <li>✗ Declined: 4000 0000 0000 0002</li>
                        <li>Use any future date and any 3-digit CVC</li>
                    </ul>
                </div>
            )}

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
                By clicking "Pay", you agree to our{" "}
                <a href="/terms" className="text-green-600 hover:underline">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-green-600 hover:underline">
                    Privacy Policy
                </a>
            </p>
        </form>
    );
};

export default PaymentForm;
