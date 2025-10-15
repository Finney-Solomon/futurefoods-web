import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/api";

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  category?: { _id: string; name: string; slug: string };
  pricePaise: number;
  imageUrl?: string;
  isActive: boolean;
  stock: number;
  description?: string;
  featuredProducts?: boolean;
  createdAt?: string;
};

const formatINR = (paise?: number) => {
  if (typeof paise !== "number") return "—";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(rupees);
};

const NewFeaturedProducts: React.FC<{ limit?: number; className?: string }> = ({
  limit = 8,
  className,
}) => {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await apiService.getProducts({
          // page: 1,
          // limit,
          featured: true,  
          // isActive: true,
          // sort: "-createdAt",
        });
        console.log(res,"resresres", apiService.getProducts({
          // page: 1,
          // limit,
          featured: true,  
          // isActive: true,
          // sort: "-createdAt",
        }))
        if (mounted) setItems(Array.isArray(res.items) ? res.items : []);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load featured products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const products = useMemo(
    () => items.filter((p) => p?.isActive !== false),
    [items]
  );

  console.log(products,"productsproductsproducts")
  const descFallback = "Made with quality ingredients you’ll love.";

  const Card: React.FC<{ p: ApiProduct }> = ({ p }) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={
          p.imageUrl ||
          "https://images.unsplash.com/photo-1526312426976-593c0ae0b7a9?auto=format&fit=crop&w=1600&q=80"
        }
        alt={p.name}
        className="h-[200px] w-full object-cover"
        loading="lazy"
      />
      <div className="p-6 text-center">
        <div className="mb-2 text-[22px] font-bold text-[#c0392b]">
          {formatINR(p.pricePaise)}
        </div>
        <h3 className="mb-3 text-lg font-extrabold text-[hsl(var(--ff-dark))]">
          {p.name}
        </h3>
        <p className="mx-auto max-w-[260px] text-sm leading-6 text-gray-600 line-clamp-3">
          {p.description?.trim() || descFallback}
        </p>
      </div>
    </div>
  );

  return (
    <section
      className={`bg-white mx-auto max-w-[1400px] px-6 py-14 md:py-18 ${className || ""}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-10 text-left text-[44px] leading-[1] font-extrabold tracking-tight text-[hsl(var(--ff-dark))] md:text-[72px]">
          Featured Products 
        </h2> 

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={`sk-${i}`}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-[200px] w-full bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-56 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && err && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {err}
          </div>
        )}

        {/* Empty */}
        {!loading && !err && products.length === 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            No featured products yet. Mark some products as <b>Featured</b> in the admin.
          </div>
        )}

        {/* Grid */}
        {!loading && !err && products.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Card key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewFeaturedProducts;
