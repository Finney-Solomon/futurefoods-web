import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Order } from "@/services/api";

function formatPriceFromPaise(paise?: number) {
  if (typeof paise !== "number") return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function toDisplayLabel(value?: string) {
  if (!value) return "—";
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order || null;

  const orderNumber = order?.orderNumber || order?._id || "FF-NEW";

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      <main className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h1 className="mt-6 text-5xl font-bold text-[hsl(var(--ff-dark))]">
            {order ? "Thank You For Your Order!" : "Order Placed"}
          </h1>

          <div className="mt-10 rounded-3xl bg-gray-50 p-12">
            {order ? (
              <>
                <p className="mb-8 text-xl leading-relaxed text-gray-700">
                  Your order has been successfully placed. We have sent a
                  confirmation email with your order details.
                </p>

                <div className="mx-auto mb-6 w-full max-w-lg rounded-xl bg-[hsl(var(--ff-navy))] p-6 text-center text-white sm:text-left">
                  <p className="text-base sm:text-lg">Order Number</p>
                  <p className="mt-2 break-words text-2xl font-bold text-[hsl(var(--ff-yellow))] sm:text-3xl">
                    {orderNumber}
                  </p>
                </div>

                <div className="mx-auto max-w-xl text-left text-gray-700">
                  <p className="mb-2">
                    <span className="font-semibold">Total:</span>{" "}
                    {formatPriceFromPaise(order.amountPaise)}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {toDisplayLabel(order.status)}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Payment:</span>{" "}
                    {toDisplayLabel(order.paymentStatus)}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Ship To:</span>{" "}
                    {order.address?.line1}, {order.address?.city}
                    {order.address?.state ? `, ${order.address.state}` : ""} -{" "}
                    {order.address?.pin}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="mb-8 text-xl leading-relaxed text-gray-700">
                  Your order has been placed. If you reloaded this page and the
                  details are missing, please check your email or open My Orders.
                </p>
                <div className="inline-block rounded-lg bg-[hsl(var(--ff-navy))] p-6 text-white">
                  <p className="text-lg">Order Number</p>
                  <p className="mt-2 text-2xl font-bold text-[hsl(var(--ff-yellow))]">
                    {orderNumber}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <Button
              onClick={() => navigate("/shop")}
              className="rounded-full bg-[hsl(var(--ff-yellow))] px-12 py-4 text-lg font-semibold text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90"
              size="lg"
            >
              Continue Shopping
            </Button>

            <div className="text-center text-gray-600">
              <p>Questions about your order?</p>
              <p>
                Contact us at{" "}
                <span className="font-semibold text-[hsl(var(--ff-navy))]">
                  support@futurefoodz.com
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <NewsletterFooter />
    </div>
  );
};

export default OrderConfirmation;
