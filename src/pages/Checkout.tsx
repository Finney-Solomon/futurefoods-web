import React, { useEffect, useMemo, useState } from "react";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiService, Cart, OrderAddress } from "@/services/api";
import { getLocalCart, clearCart, subscribeCart, syncCartToServer } from "@/lib/cart";

function formatPriceFromPaise(paise?: number) {
  if (typeof paise !== "number" || isNaN(paise)) return "0,00 kr";
  const amount = paise / 100;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 2,
  }).format(amount);
}

const STRIPE_MINIMUM_PAISE = 50;
const SWEDISH_PINCODE_MIN = 10000;
const SWEDISH_PINCODE_MAX = 98499;
const PENDING_CHECKOUT_ORDER_KEY = "futurefoods.pendingCheckoutOrderId";

function normalizeSwedishPincode(value: string) {
  return value.replace(/\D/g, "").slice(0, 5);
}

function validateSwedishPincode(value: string) {
  const normalized = normalizeSwedishPincode(value);

  if (!normalized) return "Pin code is required.";
  if (normalized.length !== 5) return "Swedish pin code must be 5 digits.";
  if (/^(\d)\1{4}$/.test(normalized)) {
    return "Enter a valid Swedish pin code.";
  }

  const numericValue = Number(normalized);
  if (
    numericValue < SWEDISH_PINCODE_MIN ||
    numericValue > SWEDISH_PINCODE_MAX
  ) {
    return "Enter a valid Swedish pin code.";
  }

  return "";
}

function buildCheckoutReturnUrls(orderId: string) {
  const origin = window.location.origin;
  const encodedOrderId = encodeURIComponent(orderId);

  return {
    successUrl: `${origin}/payment/success?orderId=${encodedOrderId}`,
    cancelUrl: `${origin}/payment/cancel?orderId=${encodedOrderId}`,
  };
}

const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = String(user.name).trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (user.email) setEmail(user.email);
    }

    (async () => {
      try {
        const me = await apiService.me();
        if (me?.name && !firstName && !lastName) {
          const parts = String(me.name).trim().split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        }
        if (me?.email && !email) setEmail(me.email);
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const update = () => setCart(getLocalCart());
    update();
    setLoading(false);
    return subscribeCart(update);
  }, []);

  const subtotalPaise = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce(
      (sum, item) => sum + item.product.pricePaise * item.quantity,
      0,
    );
  }, [cart]);

  const shippingPaise = (cart?.items?.length ?? 0) > 0 ? 150 * 100 : 0;
  const totalPaise = subtotalPaise + shippingPaise;

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        return value.trim() ? "" : "First name is required.";
      case "lastName":
        return value.trim() ? "" : "Last name is required.";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value)) {
          return "Invalid email format.";
        }
        return "";
      case "address":
        return value.trim() ? "" : "Address is required.";
      case "city":
        return value.trim() ? "" : "City is required.";
      case "stateVal":
        return "";
      case "pincode":
        return validateSwedishPincode(value);
      case "phone":
        if (value && !/^\+?\d{10,15}$/.test(value)) {
          return "Invalid phone number.";
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "stateVal":
        setStateVal(value);
        break;
      case "pincode":
        setPincode(normalizeSwedishPincode(value));
        break;
      case "phone":
        setPhone(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const validateForm = () => {
    const values: Record<string, string> = {
      firstName,
      lastName,
      email,
      address,
      city,
      stateVal,
      pincode,
      phone,
    };

    const nextErrors: Record<string, string> = {};
    Object.keys(values).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) return;

    if ((cart?.items.length ?? 0) === 0) {
      setPaymentError("Your cart is empty. Please add items before checkout.");
      return;
    }

    if (totalPaise < STRIPE_MINIMUM_PAISE) {
      setPaymentError(
        `Minimum order amount is ${formatPriceFromPaise(STRIPE_MINIMUM_PAISE)}. Your current total is ${formatPriceFromPaise(totalPaise)}.`,
      );
      return;
    }

    const orderAddress: OrderAddress = {
      line1: address,
      city,
      state: stateVal.trim() || undefined,
      pin: normalizeSwedishPincode(pincode),
      phone: phone || undefined,
    };

    setSubmitting(true);
    setPaymentError(null);

    try {
      if (localStorage.getItem("authToken")) {
        await syncCartToServer();
      }

      const createdOrderResponse = await apiService.createOrder(orderAddress);
      const orderData =
        "order" in createdOrderResponse
          ? createdOrderResponse.order
          : createdOrderResponse;
      const orderId = createdOrderResponse.orderId || orderData._id;

      if (!orderId) {
        throw new Error("Unable to retrieve order ID from server response.");
      }

      localStorage.setItem(PENDING_CHECKOUT_ORDER_KEY, orderId);
      clearCart();

      const session = await apiService.createCheckoutSession(
        orderId,
        buildCheckoutReturnUrls(orderId),
      );

      const checkoutUrl = session.url || session.checkoutUrl;

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      throw new Error(
        "Checkout session URL was not returned by the server.",
      );
    } catch (e: any) {
      const errorMsg =
        e?.status === 401
          ? "Placing an order requires logging in. Please log in to complete your payment."
          : e?.message || "Could not start Stripe checkout. Please try again.";
      setPaymentError(errorMsg);
      console.error("Checkout redirect error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      <main className="px-6 pt-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-16 text-center">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              {paymentError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold mb-1">Error</p>
                  <p>{paymentError}</p>
                </div>
              )}

              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <h2 className="text-2xl font-bold text-[hsl(var(--ff-dark))] mb-6">
                  Ordering Items
                </h2>

                {loading ? (
                  <div className="text-sm text-gray-500">Loading items...</div>
                ) : (cart?.items?.length ?? 0) === 0 ? (
                  <div className="text-sm text-gray-500">Your cart is empty.</div>
                ) : (
                  <div className="space-y-4">
                    {cart?.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-20 w-20 rounded-lg object-cover bg-white"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[hsl(var(--ff-dark))]">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Unit price: {formatPriceFromPaise(item.product.pricePaise)}
                          </p>
                        </div>
                        <div className="text-right font-semibold text-[hsl(var(--ff-dark))]">
                          {formatPriceFromPaise(item.product.pricePaise * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h2 className="text-2xl font-bold text-[hsl(var(--ff-dark))] mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "firstName", label: "First Name", value: firstName },
                    { id: "lastName", label: "Last Name", value: lastName },
                    { id: "email", label: "Email", value: email },
                    { id: "address", label: "Address", value: address },
                    { id: "city", label: "City", value: city },
                    { id: "stateVal", label: "State (optional)", value: stateVal },
                    { id: "pincode", label: "Pin Code", value: pincode },
                    { id: "phone", label: "Phone (optional)", value: phone },
                  ].map(({ id, label, value }) => (
                    <div
                      key={id}
                      className={
                        id === "email" || id === "address" || id === "phone"
                          ? "md:col-span-2"
                          : "auto"
                      }
                    >
                      <Label htmlFor={id}>{label}</Label>
                      <Input
                        id={id}
                        type="text"
                        placeholder={label}
                        value={value}
                        onChange={(e) => handleChange(id, e.target.value)}
                        inputMode={id === "pincode" ? "numeric" : undefined}
                        maxLength={id === "pincode" ? 5 : undefined}
                        autoComplete={
                          id === "pincode" ? "postal-code" : undefined
                        }
                        className={errors[id] ? "border-red-500" : ""}
                      />
                      {errors[id] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[id]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--ff-navy))] text-white p-8 rounded-xl h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {loading ? (
                <div className="text-white/80">Loading summary...</div>
              ) : (cart?.items?.length ?? 0) === 0 ? (
                <div className="text-white/80">Your cart is empty.</div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart?.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.product.name} (x{item.quantity})
                        </span>
                        <span>
                          {formatPriceFromPaise(
                            item.product.pricePaise * item.quantity,
                          )}
                        </span>
                      </div>
                    ))}
                    <hr className="border-white/20" />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPriceFromPaise(subtotalPaise)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPriceFromPaise(shippingPaise)}</span>
                    </div>
                    <hr className="border-white/20" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{formatPriceFromPaise(totalPaise)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToPayment}
                    disabled={submitting}
                    className="w-full bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 py-4 text-lg font-semibold rounded-full disabled:opacity-60"
                    size="lg"
                  >
                    {submitting ? "Creating Order..." : "Continue to Payment"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <NewsletterFooter />
    </div>
  );
};

export default Checkout;
