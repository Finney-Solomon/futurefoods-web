import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { apiService, Order } from "@/services/api";

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

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!orderId) return;
      try {
        const data = await apiService.getOrderById(orderId);
        if (active) setOrder(data);
      } catch {
      }
    })();

    return () => {
      active = false;
    };
  }, [orderId]);

  const handleRetryPayment = async () => {
    if (!orderId) return;
    try {
      const session = await apiService.createCheckoutSession(orderId);
      if (!session.url) {
        throw new Error("Checkout session URL was not returned by the server.");
      }
      window.location.assign(session.url);
    } catch (e) {
      console.error("Retry payment failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      <main className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-[hsl(var(--ff-dark))]">
            Payment Not Completed
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            Your order has been created, but the payment was not completed. You can
            retry payment now or come back later from your orders page.
          </p>

          {order && (
            <div className="mt-8 rounded-2xl bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Order Number
                  </p>
                  <p className="mt-1 font-semibold text-[hsl(var(--ff-dark))]">
                    {order.orderNumber || order._id}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Amount
                  </p>
                  <p className="mt-1 font-semibold text-[hsl(var(--ff-dark))]">
                    {formatPriceFromPaise(order.amountPaise)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Order Status
                  </p>
                  <p className="mt-1 font-semibold text-[hsl(var(--ff-dark))]">
                    {toDisplayLabel(order.status)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Payment Status
                  </p>
                  <p className="mt-1 font-semibold text-[hsl(var(--ff-dark))]">
                    {toDisplayLabel(order.paymentStatus)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={handleRetryPayment} className="rounded-full">
              Complete Payment
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/profile">Go to My Orders</Link>
            </Button>
          </div>
        </div>
      </main>
      <NewsletterFooter />
    </div>
  );
};

export default PaymentCancel;
