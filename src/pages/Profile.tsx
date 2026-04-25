import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Clock3, Package, Star, Truck, XCircle } from "lucide-react";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { useAuth } from "@/context/AuthContext";
import { apiService, Order } from "@/services/api";
import { Button } from "@/components/ui/button";

function formatPriceFromPaise(paise?: number) {
  if (typeof paise !== "number") return "—";
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function toDisplayLabel(value?: string) {
  if (!value) return "—";
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const badgeClass = (variant: string) => {
  switch (variant) {
    case "paid":
    case "succeeded":
    case "delivered":
      return "border-emerald-200 bg-emerald-100 text-emerald-800";
    case "shipped":
    case "processing":
      return "border-sky-200 bg-sky-100 text-sky-800";
    case "cancelled":
    case "failed":
      return "border-red-200 bg-red-100 text-red-800";
    default:
      return "border-amber-200 bg-amber-100 text-amber-800";
  }
};

const OrderCard: React.FC<{ order: Order; onRefresh: () => Promise<void> }> = ({
  order,
  onRefresh,
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);

  const canCompletePayment =
    order.status === "created" &&
    order.paymentStatus !== "succeeded";

  const canCancel =
    order.status === "created" && order.paymentStatus !== "succeeded";

  const paymentEventTitle =
    order.status === "cancelled"
      ? "Order Cancelled"
      : order.paymentStatus === "processing"
        ? "Payment Processing"
        : order.paymentStatus === "failed"
          ? "Payment Failed"
          : order.paymentStatus === "succeeded"
            ? "Payment Completed"
            : "Awaiting Payment";

  const paymentEventMessage =
    order.status === "cancelled"
      ? order.cancelReason || "This order was cancelled."
      : order.paymentStatus === "processing"
        ? "Your payment is currently being processed by Stripe. We will update the order automatically once it is confirmed."
        : order.paymentStatus === "failed"
          ? order.paymentDetails?.errorMessage || "Payment could not be completed. You can retry the payment."
          : order.paymentStatus === "succeeded"
            ? "Payment was received successfully and your order is confirmed."
            : "Payment has not been completed yet. Please complete payment to confirm this order.";

  const handleCompletePayment = async () => {
    setPaymentLoading(true);
    try {
      const session = await apiService.createCheckoutSession(order._id);
      if (!session.url) {
        throw new Error("Checkout session URL was not returned by the server.");
      }
      window.location.assign(session.url);
    } catch (e) {
      console.error("Payment redirect error", e);
      setPaymentLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await apiService.cancelMyOrder(order._id);
      await onRefresh();
    } catch (e) {
      console.error("Cancel order failed", e);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <li className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Order
            </p>
            <p className="mt-1 text-xl font-semibold text-[hsl(var(--ff-dark))]">
              {order.orderNumber || order._id}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">Order Status</p>
              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(order.status)}`}
              >
                {toDisplayLabel(order.status)}
              </span>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">Payment Status</p>
              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(order.paymentStatus || "pending")}`}
              >
                {toDisplayLabel(order.paymentStatus || "pending")}
              </span>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">Total</p>
              <p className="mt-2 font-semibold text-[hsl(var(--ff-dark))]">
                {formatPriceFromPaise(order.amountPaise)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-[hsl(var(--ff-dark))]">
            Ordered Items
          </h3>
          <div className="mt-4 divide-y divide-gray-200">
            {order.items.map((item, index) => {
              const product =
                typeof item.product === "object" && item.product ? item.product : null;
              return (
                <div
                  key={`${order._id}-${index}`}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-white">
                      {product?.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product?.name || "Ordered item"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPriceFromPaise(item.pricePaise * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-[hsl(var(--ff-dark))]">
              Shipping Address
            </p>
            <p className="mt-2 text-sm text-gray-700">
              {order.address?.line1}, {order.address?.city}
              {order.address?.state ? `, ${order.address.state}` : ""} -{" "}
              {order.address?.pin}
            </p>
            {order.address?.phone && (
              <p className="mt-1 text-sm text-gray-700">
                Phone: {order.address.phone}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-[hsl(var(--ff-dark))]">
              Delivery Details
            </p>
            {order.shipping?.carrier || order.shipping?.shippingId ? (
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {order.shipping?.carrier && (
                  <p>Carrier: {order.shipping.carrier}</p>
                )}
                {order.shipping?.service && <p>Service: {order.shipping.service}</p>}
                {order.shipping?.shippingId && (
                  <p>Tracking ID: {order.shipping.shippingId}</p>
                )}
                {order.shipping?.estimatedDeliveryAt && (
                  <p>
                    Estimated Delivery:{" "}
                    {formatDate(order.shipping.estimatedDeliveryAt)}
                  </p>
                )}
                {order.shipping?.trackingUrl && (
                  <a
                    href={order.shipping.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex pt-1 text-[hsl(var(--ff-navy))] underline"
                  >
                    Track Shipment
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Shipping details will appear here after dispatch.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-white p-2 shadow-sm">
              {order.status === "cancelled" ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : order.paymentStatus === "processing" ? (
                <Clock3 className="h-4 w-4 text-sky-600" />
              ) : (
                <Package className="h-4 w-4 text-[hsl(var(--ff-navy))]" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[hsl(var(--ff-dark))]">
                {paymentEventTitle}
              </p>
              <p className="mt-1 text-sm text-gray-600">{paymentEventMessage}</p>
            </div>
          </div>
        </div>

        {order.timeline && order.timeline.length > 0 && (
          <details
            className="rounded-2xl border border-gray-200 p-4"
            open={timelineOpen}
            onToggle={(e) =>
              setTimelineOpen((e.currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--ff-dark))]">
                  Status History
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Open to check the full order and payment timeline.
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  timelineOpen ? "rotate-180" : ""
                }`}
              />
            </summary>

            <div className="mt-4 space-y-3">
              {order.timeline
                .slice()
                .reverse()
                .map((event, index) => (
                  <div
                    key={`${order._id}-timeline-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 rounded-full bg-[hsl(var(--ff-yellow))]/30 p-2">
                      {event.status === "shipped" ? (
                        <Truck className="h-4 w-4 text-[hsl(var(--ff-navy))]" />
                      ) : event.status === "cancelled" ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Package className="h-4 w-4 text-[hsl(var(--ff-navy))]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {toDisplayLabel(event.status)}
                      </p>
                      {event.note && (
                        <p className="text-sm text-gray-600">{event.note}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {formatDate(event.at)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </details>
        )}

        <div className="flex flex-wrap gap-3">
          {canCompletePayment && (
            <Button
              onClick={handleCompletePayment}
              disabled={paymentLoading}
              className="rounded-full bg-[hsl(var(--ff-navy))] text-white hover:bg-[hsl(var(--ff-navy))]/90"
            >
              {paymentLoading ? "Redirecting..." : "Continue Payment"}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={cancelLoading}
              className="rounded-full"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMyOrders({ page: 1, limit: 50 });
      setOrders(response.data || []);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewMessage("");
    setReviewError("");

    const trimmedComment = reviewComment.trim();
    if (!trimmedComment) {
      setReviewError("Please write a short review before submitting.");
      return;
    }

    setReviewLoading(true);
    try {
      await apiService.createReview({
        reviewerName: user?.name || user?.email || "Customer",
        title: reviewTitle.trim(),
        comment: trimmedComment,
        rating: reviewRating,
      });
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      setReviewMessage("Thank you. Your review has been submitted for approval.");
    } catch (e: any) {
      setReviewError(e?.message || "Review could not be submitted.");
    } finally {
      setReviewLoading(false);
    }
  };

  const stats = useMemo(() => {
    const paidCount = orders.filter(
      (order) => order.status === "paid" || order.paymentStatus === "succeeded",
    ).length;
    const activeCount = orders.filter(
      (order) => !["delivered", "cancelled"].includes(order.status),
    ).length;
    return { paidCount, activeCount };
  }, [orders]);

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      <main className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[hsl(var(--ff-dark))]">
                My Profile
              </h1>
              <p className="mt-2 text-gray-600">
                Track your orders, payment status, shipping progress, and delivery
                timeline.
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
            >
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-gray-50 p-6">
                <h2 className="text-2xl font-semibold text-[hsl(var(--ff-dark))]">
                  My Orders
                </h2>

                {loading ? (
                  <div className="mt-4 text-gray-600">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="mt-4 text-gray-600">No orders yet.</div>
                ) : (
                  <ul className="mt-6 space-y-5">
                    {orders.map((order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        onRefresh={loadOrders}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-3xl bg-gray-50 p-6">
                <h2 className="text-2xl font-semibold text-[hsl(var(--ff-dark))]">
                  Account
                </h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-medium">{user?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium">{user?.email || "—"}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="mt-1 text-lg font-semibold">{orders.length}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
                    <p className="text-xs text-gray-500">Paid</p>
                    <p className="mt-1 text-lg font-semibold">
                      {stats.paidCount}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-4 text-center">
                    <p className="text-xs text-gray-500">Active Orders</p>
                    <p className="mt-1 text-lg font-semibold">
                      {stats.activeCount}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleReviewSubmit}
                  className="mt-6 rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-yellow))]" />
                    <h3 className="text-lg font-semibold text-[hsl(var(--ff-dark))]">
                      Give a Review
                    </h3>
                  </div>

                  <label className="mt-4 block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(event) => setReviewRating(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[hsl(var(--ff-navy))]"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>

                  <label className="mt-4 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    value={reviewTitle}
                    onChange={(event) => setReviewTitle(event.target.value)}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[hsl(var(--ff-navy))]"
                  />

                  <label className="mt-4 block text-sm font-medium text-gray-700">
                    Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={4}
                    placeholder="Share your experience"
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[hsl(var(--ff-navy))]"
                  />

                  {reviewMessage && (
                    <p className="mt-3 text-sm text-emerald-700">{reviewMessage}</p>
                  )}
                  {reviewError && (
                    <p className="mt-3 text-sm text-red-600">{reviewError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={reviewLoading}
                    className="mt-4 w-full rounded-full bg-[hsl(var(--ff-navy))] text-white hover:bg-[hsl(var(--ff-navy))]/90"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <NewsletterFooter />
    </div>
  );
};

export default Profile;
