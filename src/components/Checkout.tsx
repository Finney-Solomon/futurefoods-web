/**
 * Checkout Component
 * Complete checkout flow: review cart, enter address, process payment
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Loader, AlertCircle, ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import { getUserFriendlyMessage } from "../services/errorHandler";
import PaymentForm from "./PaymentForm";
import { Order, Cart, OrderAddress, CreatePaymentIntentResponse } from "../services/types/apiTypes";

type CheckoutStep = "review" | "shipping" | "payment" | "success";

/**
 * Checkout component - Multi-step checkout process
 */
export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // State management
    const [cart, setCart] = useState<Cart | null>(null);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("review");
    const [order, setOrder] = useState<Order | null>(null);
    const [paymentIntent, setPaymentIntent] = useState<CreatePaymentIntentResponse | null>(null);

    // Form state
    const [shippingData, setShippingData] = useState<OrderAddress>({
        line1: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
        country: "US",
    });

    // Loading and error state
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: "/checkout" } });
            return;
        }

        // Load cart
        const loadCart = async () => {
            try {
                const cartData = await apiService.getCart();
                setCart(cartData);

                if (!cartData.items || cartData.items.length === 0) {
                    setError("Your cart is empty");
                }
            } catch (err) {
                setError(getUserFriendlyMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, [isAuthenticated, navigate]);

    const handleInputChange = (field: keyof OrderAddress, value: string) => {
        setShippingData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateShippingData = (): boolean => {
        if (!shippingData.line1.trim()) {
            setError("Please enter your address");
            return false;
        }
        if (!shippingData.city.trim()) {
            setError("Please enter your city");
            return false;
        }
        if (!shippingData.pin.trim()) {
            setError("Please enter your postal code");
            return false;
        }
        if (!shippingData.phone.trim()) {
            setError("Please enter your phone number");
            return false;
        }
        return true;
    };

    const handleProceedToPayment = async () => {
        if (!validateShippingData()) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Create payment intent for cart (before creating order)
            const paymentIntentData =
                await apiService.createPaymentIntentForCart();
            setPaymentIntent(paymentIntentData);

            setCurrentStep("payment");
        } catch (err) {
            setError(getUserFriendlyMessage(err));
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Now create the order after successful payment
            const newOrder = await apiService.createOrderAfterPayment({
                address: shippingData,
                paymentIntentId,
            });
            setOrder(newOrder);

            setCurrentStep("success");
        } catch (err) {
            setError(getUserFriendlyMessage(err));
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader className="w-8 h-8 text-green-500 mx-auto mb-3 animate-spin" />
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Your cart is empty. Please add items before checking out.
                        </AlertDescription>
                    </Alert>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/shop")}
                        className="mt-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
        (total, item) => total + (item.product as any).pricePaise * item.quantity,
        0
    );
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">
                        Step {currentStep === "review" ? "1" : currentStep === "shipping" ? "2" : "3"} of 3
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Review Step */}
                        {currentStep === "review" && (
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Order Review</h2>
                                <div className="space-y-4">
                                    {cart.items.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center border-b pb-4">
                                            <div className="flex-1">
                                                <p className="font-medium">{(item.product as any).name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                ${(((item.product as any).pricePaise * item.quantity) / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setCurrentStep("shipping")}
                                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                                    size="lg"
                                >
                                    Continue to Shipping
                                </Button>
                            </Card>
                        )}

                        {/* Shipping Step */}
                        {currentStep === "shipping" && (
                            <Card className="p-6 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Address Line 1 */}
                                    <div>
                                        <Label htmlFor="line1">Street Address</Label>
                                        <Input
                                            id="line1"
                                            value={shippingData.line1}
                                            onChange={(e) => handleInputChange("line1", e.target.value)}
                                            placeholder="123 Green Street"
                                            disabled={isProcessing}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Address Line 2 */}
                                    <div>
                                        <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
                                        <Input
                                            id="line2"
                                            value={shippingData.line2 || ""}
                                            onChange={(e) => handleInputChange("line2", e.target.value)}
                                            placeholder="Apt 4B"
                                            disabled={isProcessing}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* City and State */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={shippingData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                placeholder="New York"
                                                disabled={isProcessing}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={shippingData.state || ""}
                                                onChange={(e) => handleInputChange("state", e.target.value)}
                                                placeholder="NY"
                                                disabled={isProcessing}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Postal Code */}
                                    <div>
                                        <Label htmlFor="pin">Postal Code</Label>
                                        <Input
                                            id="pin"
                                            value={shippingData.pin}
                                            onChange={(e) => handleInputChange("pin", e.target.value)}
                                            placeholder="10001"
                                            disabled={isProcessing}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={shippingData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="+1 (415) 555-2671"
                                            disabled={isProcessing}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep("review")}
                                        disabled={isProcessing}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleProceedToPayment}
                                        disabled={isProcessing}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        size="lg"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Continue to Payment"
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Payment Step */}
                        {currentStep === "payment" && paymentIntent && (
                            <Card className="p-6 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                    <h2 className="text-xl font-semibold">Payment</h2>
                                </div>

                                <PaymentForm
                                    clientSecret={paymentIntent.clientSecret}
                                    orderId={paymentIntent.orderId}
                                    amount={paymentIntent.amountPaise}
                                    onSuccess={handlePaymentSuccess}
                                    onError={(err) => setError(err)}
                                    loading={isProcessing}
                                />
                            </Card>
                        )}

                        {/* Success Step */}
                        {currentStep === "success" && order && (
                            <Card className="p-6 mb-6 border-green-200 bg-green-50">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-2">
                                        Order Placed Successfully!
                                    </h2>
                                    <p className="text-green-700 mb-4">
                                        Thank you for your purchase. Your order has been confirmed.
                                    </p>
                                    <p className="text-green-700 mb-6">
                                        <strong>Order ID:</strong> {order._id}
                                    </p>
                                    <p className="text-green-700 text-sm mb-6">
                                        A confirmation email has been sent to <strong>{user?.email}</strong>
                                    </p>

                                    <Button
                                        onClick={() => navigate("/account/orders")}
                                        className="bg-green-600 hover:bg-green-700"
                                        size="lg"
                                    >
                                        View Order Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/")}
                                        className="ml-3"
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <Card className="p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                            <div className="space-y-2 border-b pb-4 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>${(subtotal / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (8%):</span>
                                    <span>${(tax / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping:</span>
                                    <span className="text-green-600 font-semibold">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="font-semibold text-lg">Total:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    ${((subtotal + tax) / 100).toFixed(2)}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 space-y-2">
                                <p>📦 <strong>{cart.items.length}</strong> items</p>
                                <p>✓ Free shipping on all orders</p>
                                <p>✓ Secure checkout powered by Stripe</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
