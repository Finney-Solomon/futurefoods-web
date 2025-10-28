import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function formatINR(paise?: number) {
 if (typeof paise !== "number") return "—";
 const rupees = paise / 100;
 return new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 2,
 }).format(rupees);
}

const Shop: React.FC = () => {
 const navigate = useNavigate();

 const { data, isLoading, isError, error } = useQuery({
  queryKey: ["products", { page: 1, limit: 20 }],
  queryFn: () => apiService.getProducts(1, 20),
  staleTime: 60_000, // 1 min
 });

 return (
  <div className="min-h-screen bg-white">
   <NewHeader />

   <main className="py-4 px-6">
    <div className="max-w-7xl mx-auto">
     {/* Page Header */}
     <div className="text-center mb-16">
      <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-3">
       Handcrafted Kimchi & Tempeh
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
       Nourish your body with our small-batch, traditionally fermented foods,
       made with organic ingredients.
      </p>
     </div>

     {/* Loading */}
     {isLoading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {Array.from({ length: 6 }).map((_, i) => (
        <div
         key={i}
         className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
         <div className="w-full h-64 bg-gray-100 animate-pulse" />
         <div className="p-6 space-y-3">
          <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded" />
          <div className="h-6 w-1/3 bg-gray-100 animate-pulse rounded" />
          <div className="h-10 w-28 bg-gray-100 animate-pulse rounded-full" />
         </div>
        </div>
       ))}
      </div>
     )}

     {/* Error */}
     {isError && (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 max-w-xl mx-auto text-center">
       {(error as any)?.message || "Failed to load products."}
      </div>
     )}

     {/* Product Grid */}
     {!!data?.items?.length && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {data.items.map((p) => (
        <div
         key={p._id}
         className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
         <img
          src={p.imageUrl}
          alt={p.name}
          className="w-full h-64 object-cover"
          loading="lazy"
         />
         <div className="p-6">
          <h3 className="text-xl font-bold text-[hsl(var(--ff-dark))] mb-2">
           {p.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
           {p.description}
          </p>

          <div className="flex items-center justify-between">
           <span className="text-2xl font-bold text-[hsl(var(--ff-navy))]">
            {formatINR(p.pricePaise)}
           </span>

           {/* Navigate to your existing /product-detail route with slug */}
           {/* <Button
                        className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 rounded-full px-6"
                        onClick={() => navigate(`/product-detail?slug=${encodeURIComponent(p.slug)}`)}
                      >
                        View
                      </Button> */}

           <Button
            className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 rounded-full px-6"
            onClick={() => {
             // cache so refresh/new tab works without API
             sessionStorage.setItem("lastProduct", JSON.stringify(p));
             navigate(`/product-detail?slug=${encodeURIComponent(p.slug)}`, {
              state: { product: p }, // <-- pass the product directly
             });
            }}
           >
            View
           </Button>
          </div>

          {/* Optional: stock pill */}
          <div className="mt-3">
           <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-gray-600">
            In stock: {p.stock ?? 0}
           </span>
          </div>
         </div>
        </div>
       ))}
      </div>
     )}

     {/* Empty state */}
     {data && data.items?.length === 0 && (
      <div className="text-center text-gray-600">No products found.</div>
     )}
    </div>
   </main>

   <NewsletterFooter />
  </div>
 );
};

export default Shop;
