import React, { useState } from "react";

const HealthySection = () => {
 const data = {
  Vegan: [
   {
    image:
     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    name: "Vegan Salad",
    badge: "Fresh Pick",
   },
   {
    image:
     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    name: "Grilled Veggies",
    badge: "Special",
   },
   {
    image:
     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    name: "Avocado Toast",
    badge: "Chef's Choice",
   },
  ],
  "Fermented Foods": [
   {
    image:
     "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80",
    name: "Kimchi",
    badge: "Best dish",
   },
   {
    image:
     "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    name: "Tempeh",
    badge: "Deal",
   },
   {
    image:
     "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=1200&q=80",
    name: "Kombucha",
    badge: "Best Deal",
   },
  ],
  Others: [
   {
    image:
     "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    name: "Smoothie Bowl",
    badge: "Top Pick",
   },
   {
    image:
     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    name: "Energy Bar",
    badge: "Snack",
   },
   {
    image:
     "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    name: "Fruit Mix",
    badge: "Fresh",
   },
  ],
 };

 const categories = Object.keys(data);
 const [activeCategory, setActiveCategory] = useState("Fermented Foods");

 return (
  <section className="bg-[hsl(var(--ff-yellow))]">
   <div className="mx-auto max-w-[1400px] px-6 pt-14 pb-16">
    {/* Header row */}
    <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
     <h2 className="text-[40px] md:text-[48px] font-extrabold tracking-tight text-[hsl(var(--ff-dark))]">
      Why we are Healthy?
     </h2>

     {/* Category buttons */}
     <div className="flex items-center gap-8 text-[hsl(var(--ff-dark))]">
      {categories.map((category) => (
       <button
        key={category}
        onClick={() => setActiveCategory(category)}
        className={`text-lg font-medium transition-all px-8 py-3 rounded-full
    ${
     activeCategory === category
      ? "border-2 border-white text-white bg-transparent"
      : "text-[hsl(var(--ff-dark))]"
    }`}
       >
        {category}
       </button>
      ))}
     </div>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
     {data[activeCategory].map((p, i) => (
      <article
       key={i}
       className="relative h-[360px] overflow-hidden rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-pointer group"
      >
       <img
        src={p.image}
        alt={p.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
       />

       {/* Left fade overlay */}
       <div className="absolute inset-0 bg-gradient-to-r from-[#001b3a]/70 via-[#001b3a]/30 to-transparent" />

       {/* Text block */}
       <div className="absolute bottom-6 left-6">
        <div className="mb-1 text-[hsl(var(--ff-yellow))] text-xl font-semibold">
         {p.badge}
        </div>
        <h3 className="text-white text-3xl md:text-4xl font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
         {p.name}
        </h3>
       </div>
      </article>
     ))}
    </div>
   </div>
  </section>
 );
};

export default HealthySection;
