
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { useAuth } from "@/context/AuthContext";
import { apiService, Order } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";

function formatINRFromPaise(paise?: number) {
  if (typeof paise !== "number") return "—";
  const rupees = paise / 100;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 2,
  }).format(rupees);
}

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return iso;
  }
}

const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const map: Record<Order["status"], string> = {
    created: "bg-yellow-100 text-yellow-800 border-yellow-300",
    paid: "bg-blue-100 text-blue-800 border-blue-300",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}
    >
      {status}
    </span>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState("");
  const { user, logout } = useAuth();
  console.log(order, "orderorder")
  const handleSubmitReview = async () => {
    if (!review.trim()) {
      alert("Please write a review before submitting.");
      return;
    }
    const payload = {
      orderId: order?._id,
      user: user,
      rating: rating,
      review: review,

    }

    console.log(payload, "payloadpayloadpayload")
    try {
      // Example API call
      // await apiService.submitReview(order._id, { rating, review });
      alert("✅ Thank you for your review!");
      setShowReviewModal(false);
      setReview("");
      setRating(5);
    } catch {
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <li className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-sm transition relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Order</p>
          <p className="text-lg font-semibold text-gray-900">
            FFZ-{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Placed: {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4 md:text-right">
          <StatusBadge status={order.status} />
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-base font-semibold">
              {formatINRFromPaise(order.amountPaise)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 divide-y divide-gray-100">
        {order.items.map((it, idx) => {
          const prod: any = (it as any).product;
          const name =
            typeof prod === "object" && prod?.name ? prod.name : String(it.product);
          const img =
            typeof prod === "object" && prod?.imageUrl ? prod.imageUrl : undefined;

          console.log(prod, "prodprod")
          return (
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                  {img ? (
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/80x80/eeeeee/999?text=Item";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatINRFromPaise(it.pricePaise * it.quantity)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping + Review */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <details className="group w-full sm:w-auto">
          <summary className="cursor-pointer list-none text-sm text-[hsl(var(--ff-navy))] hover:underline">
            Shipping address
          </summary>
          <div className="mt-2 text-sm text-gray-700">
            <p>
              {order.address?.line1}, {order.address?.city}
              {order.address?.state ? `, ${order.address.state}` : ""} —{" "}
              {order.address?.pin}
            </p>
            {order.address?.phone && <p>Phone: {order.address.phone}</p>}
          </div>
        </details>
        {/*         
        { order?.isReviewed } */}

        <Button
          onClick={() => setShowReviewModal(true)}
          className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[hsl(var(--ff-yellow))]/90 transition-all w-full sm:w-auto"
        >
          Write a Review
        </Button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold text-[hsl(var(--ff-navy))] mb-4">
              Write a Review
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 cursor-pointer transition-colors ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Your Review
                </label>
                <Textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setReview("")
                }}
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiService.listOrders();
        if (mounted) setOrders(data);
      } catch {
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />

      <main className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-10">
            <h1 className="text-4xl font-bold text-[hsl(var(--ff-dark))]">
              My Profile
            </h1>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full"
            >
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Orders */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--ff-dark))]">
                  My Orders
                </h2>

                {loading ? (
                  <div className="text-gray-600">Loading orders…</div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-gray-600">No orders yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {orders.map((o) => (
                      <OrderCard key={o._id} order={o} />
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right: User details */}
            <aside className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--ff-dark))]">
                  Account
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-medium">{user?.name || "—"}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="text-lg font-semibold">{orders?.length ?? 0}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <p className="text-xs text-gray-500">Last Order</p>
                    <p className="text-sm font-medium">
                      {orders && orders[0]
                        ? formatDateTime(orders[0].createdAt)
                        : "—"}
                    </p>
                  </div>
                </div>
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
