import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api"; // adjust path if needed

const RecipesSection = ({
 featured = true,
 limit = 6,
 title = "Recipes & Inspiration",
 subtitle = "Get Creative in the Kitchen!",
}) => {
 const [items, setItems] = useState([]);
 const [loading, setLoading] = useState(true);
 const [err, setErr] = useState(null);
 const maxChars = 180;

 useEffect(() => {
  const ac = new AbortController();
  (async () => {
   try {
    setLoading(true);
    setErr(null);
    const res = await apiService.getRecipes({
     page: 1,
     limit,
     isActive: true,
     ...(featured ? { featured: true } : {}),
     sort: "-createdAt",
    });
    console.log(res,Array.isArray(res?.items) ? res.items : [],"resresresres111111")
    setItems(Array.isArray(res?.items) ? res.items : []);
   } catch (e) {
    if (e?.name !== "AbortError")
     setErr(e?.message || "Failed to load recipes");
    console.log(e?.message ,"AbortErrorAbortErrorAbortErrorAbortError")
   } finally {
    setLoading(false);
   }
  })();
  return () => ac.abort();
 }, [featured, limit]);

 // show up to 3 (your layout is 3 columns)
 const recipes = items.slice(0, 3);
 console.log(recipes, "recipesrecipesrecipes");
 return (
  <section className="bg-[hsl(var(--ff-navy))] py-20 px-6">
   <div className="max-w-7xl mx-auto text-center">
    {/* Section Title */}
    <h2 className="text-5xl font-bold text-white mb-6">{title}</h2>
    <p className="text-white text-2xl font-light mb-16">{subtitle}</p>

    {/* Error */}
    {!loading && err && (
     <div className="mb-12 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      {err}
     </div>
    )}

    {/* Empty */}
    {!loading && !err && recipes.length === 0 && (
     <div className="mb-12 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
      No recipes yet. Please add some in admin.
     </div>
    )}

    {/* Recipe Images */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
     {loading
      ? Array.from({ length: 3 }).map((_, i) => (
         <div
          key={`sk-img-${i}`}
          className="w-full h-64 rounded-xl bg-white/20 animate-pulse"
         />
        ))
      : recipes.map((r, index) => (
         <div key={r._id || index}>
          <img
           src={
            r?.imageUrl ||
            "https://images.unsplash.com/photo-1526312426976-593c0ae0b7a9?auto=format&fit=crop&w=400&h=300"
           }
           alt={r?.title ? `${r.title} image` : `Recipe ${index + 1}`}
           className="w-full h-64 object-cover rounded-xl mb-6"
           loading="lazy"
          />
         </div>
        ))}
    </div>

    {/* Recipe Content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
     {loading
      ? Array.from({ length: 3 }).map((_, i) => (
         <div key={`sk-text-${i}`} className="text-center">
          <div className="mx-auto mb-4 h-7 w-40 rounded bg-white/20 animate-pulse" />
          <div className="mx-auto h-20 w-72 rounded bg-white/20 animate-pulse" />
         </div>
        ))
      : recipes.map((r, index) => (
         <div key={r._id || index} className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
           {r?.title || "Untitled"}
          </h3>
          <p className="text-white text-base leading-relaxed">
           {/* {r?.shortDescription || "A delicious recipe from Future Foods."} */}
           {r?.shortDescription?.length > maxChars
            ? r.shortDescription.slice(0, maxChars).trim() + "..."
            : r?.shortDescription || "A delicious recipe from Future Foods."}
          </p>
         </div>
        ))}
    </div>

    {/* Explore Button (optional) */}
    {/* <a
          href="/recipes"
          className="inline-block bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 px-12 py-4 text-lg font-semibold rounded-full"
        >
          Explore Recipes
        </a> */}
   </div>
  </section>
 );
};

export default RecipesSection;
