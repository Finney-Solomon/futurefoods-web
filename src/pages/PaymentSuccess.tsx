import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
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

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId =
    searchParams.get("orderId") ||
    localStorage.getItem("futurefoods.pendingCheckoutOrderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let pollTimeout: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const loadOrder = async () => {
      if (!orderId) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await apiService.getOrderById(orderId);
        if (!active) return;
        setOrder(data);
        localStorage.removeItem("futurefoods.pendingCheckoutOrderId");

        const stillProcessing =
          data.paymentStatus === "processing" || data.paymentStatus === "pending";

        if (stillProcessing && attempts < 5) {
          attempts += 1;
          pollTimeout = setTimeout(loadOrder, 2500);
          return;
        }
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "Could not load your order.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [orderId]);

  const title = useMemo(() => {
    if (!order) return "Payment Received";
    if (order.paymentStatus === "succeeded" || order.status === "paid") {
      return "Order Confirmed";
    }
    if (order.paymentStatus === "processing") {
      return "Order Received";
    }
    return "Order Confirmation";
  }, [order]);

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      <main className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center shadow-sm">
            {loading ? (
              <div className="py-12">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-[hsl(var(--ff-navy))]" />
                <p className="mt-4 text-lg text-gray-600">
                  Confirming your payment and updating your order...
                </p>
              </div>
            ) : error ? (
              <div className="py-6">
                <p className="text-lg font-semibold text-red-600">{error}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link to="/profile">Go to My Orders</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="mt-6 text-4xl font-bold text-[hsl(var(--ff-dark))]">
                  {title}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                  {order?.paymentStatus === "succeeded" || order?.status === "paid"
                    ? "Your payment has been completed and your order is now confirmed."
                    : "Your payment provider has returned you to Future Foods. Your order details are below while final payment confirmation is completed."}
                </p>

                {order && (
                  <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-6 text-left shadow-sm">
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

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild className="rounded-full">
                    <Link to="/profile">View My Orders</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <NewsletterFooter />
    </div>
  );
};

export default PaymentSuccess;
