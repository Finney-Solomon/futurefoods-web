import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiService, Cart, Order, OrderAddress } from "@/services/api";

function formatINRFromPaise(paise?: number) {
  if (typeof paise !== "number") return "—";
  const rupees = paise / 100;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 2,
  }).format(rupees);
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // ---- User form state ----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // ---- Shipping fields ----
  const [address, setAddress] = useState(""); 
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  // ---- Validation state ----
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---- Cart state ----
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Prefill user info
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

  // Load cart
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiService.getCart();
        if (mounted) setCart(data);
      } catch {}
      finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const subtotalPaise = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce(
      (sum, it) => sum + it.product.pricePaise * it.quantity,
      0
    );
  }, [cart]);

  const shippingPaise = (cart?.items?.length ?? 0) > 0 ? 150 * 100 : 0;
  const totalPaise = subtotalPaise + shippingPaise;

  // --- Validation ---
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        return value.trim() ? "" : "First name is required.";
      case "lastName":
        return value.trim() ? "" : "Last name is required.";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value)) return "Invalid email format.";
        return "";
      case "address":
        return value.trim() ? "" : "Address is required.";
      case "city":
        return value.trim() ? "" : "City is required.";
      case "stateVal":
        return value.trim() ? "" : "State is required.";
      case "pincode":
        if (!value.trim()) return "Pin code is required.";
        if (!/^\d{6}$/.test(value)) return "Pin code must be 6 digits.";
        return "";
      case "phone":
        if (value && !/^\+?\d{10,15}$/.test(value)) return "Invalid phone number.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case "firstName": setFirstName(value); break;
      case "lastName": setLastName(value); break;
      case "email": setEmail(value); break;
      case "address": setAddress(value); break;
      case "city": setCity(value); break;
      case "stateVal": setStateVal(value); break;
      case "pincode": setPincode(value); break;
      case "phone": setPhone(value); break;
    }

    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    Object.keys(values).forEach((field) => {
      const err = validateField(field, values[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if ((cart?.items.length ?? 0) === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderAddress: OrderAddress = {
      line1: address,
      city,
      state: stateVal,
      pin: pincode,
      phone: phone || undefined,
    };

    setSubmitting(true);
    try {
      const order = await apiService.createOrder(orderAddress);
      navigate("/order-confirmation", { state: { order } });
    } catch (e: any) {
      alert(e?.message || "Could not create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      <main className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-16 text-center">
            Checkout 
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h2 className="text-2xl font-bold text-[hsl(var(--ff-dark))] mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {id:"firstName", label:"First Name", value:firstName},
                    {id:"lastName", label:"Last Name", value:lastName},
                    {id:"email", label:"Email", value:email},
                    {id:"address", label:"Address", value:address},
                    {id:"city", label:"City", value:city},
                    {id:"stateVal", label:"State", value:stateVal},
                    {id:"pincode", label:"Pin Code", value:pincode},
                    {id:"phone", label:"Phone (optional)", value:phone},
                  ].map(({id,label,value}) => (
                    <div key={id} className={id==="email" || id==="address" || id==="phone" ? "md:col-span-2":"auto"}>
                      <Label htmlFor={id}>{label}</Label>
                      <Input
                        id={id}
                        type="text"
                        placeholder={label}
                        value={value}
                        onChange={(e) => handleChange(id, e.target.value)}
                        className={errors[id] ? "border-red-500" : ""}
                      />
                      {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-[hsl(var(--ff-navy))] text-white p-8 rounded-xl h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {loading ? (
                <div className="text-white/80">Loading summary…</div>
              ) : (cart?.items?.length ?? 0) === 0 ? (
                <div className="text-white/80">Your cart is empty.</div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart?.items.map((it) => (
                      <div key={it._id} className="flex justify-between text-sm">
                        <span>{it.product.name} (x{it.quantity})</span>
                        <span>{formatINRFromPaise(it.product.pricePaise * it.quantity)}</span>
                      </div>
                    ))}
                    <hr className="border-white/20" />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatINRFromPaise(subtotalPaise)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatINRFromPaise(shippingPaise)}</span>
                    </div>
                    <hr className="border-white/20" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{formatINRFromPaise(totalPaise)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={submitting}
                    className="w-full bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 py-4 text-lg font-semibold rounded-full disabled:opacity-60"
                    size="lg"
                  >
                    {submitting ? "Placing Order…" : "Place Order"}
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
