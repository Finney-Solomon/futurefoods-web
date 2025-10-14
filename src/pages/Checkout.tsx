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
 return new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
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

 // ---- Shipping fields expected by backend Order.address ----
 const [address, setAddress] = useState(""); // line1
 const [city, setCity] = useState("");
 const [stateVal, setStateVal] = useState("");
 const [pincode, setPincode] = useState("");
 const [phone, setPhone] = useState("");

 // ---- Cart state ----
 const [cart, setCart] = useState<Cart | null>(null);
 const [loading, setLoading] = useState(true);
 const [submitting, setSubmitting] = useState(false);

 // Prefill from context + /auth/me
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
   } catch {
   } finally {
    if (mounted) setLoading(false);
   }
  })();
  return () => {
   mounted = false;
  };
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

 const handlePayment = async () => {
  if (
   !firstName ||
   !lastName ||
   !email ||
   !address ||
   !city ||
   !pincode ||
   !stateVal
  ) {
   alert("Please fill all required shipping fields.");
   return;
  }
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
   const order: Order = await apiService.createOrder(orderAddress);
   // Backend clears cart on success; navigate with order details for confirmation screen
   navigate("/order-confirmation", { state: { order } });
  } catch (e: any) {
   alert(e?.message || "Could not create order. Please try again.");
  } finally {
   setSubmitting(false);
  }
 };

 if (!isAuthenticated) return null; // ProtectedRoute guards this

 return (
  <div className="min-h-screen bg-white">
   <NewHeader />

   <main className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
     <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-16 text-center">
      Checkout
     </h1>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Left Column - Forms */}
      <div className="space-y-8">
       {/* Shipping Information */}
       <div className="bg-gray-50 p-4 rounded-xl">
        <h2 className="text-2xl font-bold text-[hsl(var(--ff-dark))] mb-6">
         Shipping Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
           id="firstName"
           placeholder="John"
           value={firstName}
           onChange={(e) => setFirstName(e.target.value)}
          />
         </div>
         <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
           id="lastName"
           placeholder="Doe"
           value={lastName}
           onChange={(e) => setLastName(e.target.value)}
          />
         </div>
         <div className="md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
           id="email"
           type="email"
           placeholder="john@example.com"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
          />
         </div>
         <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
           id="address"
           placeholder="123 Main Street"
           value={address}
           onChange={(e) => setAddress(e.target.value)}
          />
         </div>
         <div>
          <Label htmlFor="city">City</Label>
          <Input
           id="city"
           placeholder="Mumbai"
           value={city}
           onChange={(e) => setCity(e.target.value)}
          />
         </div>
         <div>
          <Label htmlFor="state">State</Label>
          <Input
           id="state"
           placeholder="Maharashtra"
           value={stateVal}
           onChange={(e) => setStateVal(e.target.value)}
          />
         </div>
         <div>
          <Label htmlFor="pincode">Pin Code</Label>
          <Input
           id="pincode"
           placeholder="400001"
           value={pincode}
           onChange={(e) => setPincode(e.target.value)}
          />
         </div>
         <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
           id="phone"
           placeholder="+91 9xxxxxxxxx"
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
          />
         </div>
        </div>
       </div>

       {/* If you later integrate a real payment gateway, insert it here */}
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
            <span>
             {it.product.name} (x{it.quantity})
            </span>
            <span>
             {formatINRFromPaise(it.product.pricePaise * it.quantity)}
            </span>
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

{
 /* <div className="bg-gray-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-[hsl(var(--ff-dark))] mb-6">
                  Payment Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                </div>
              </div> */
}
