import React from "react";
import {
  ShieldCheck,
  Bookmark,
  SmilePlus,
  CircleSlash,
  BarChart3,
} from "lucide-react";

const WhyFuturefoodsSection = () => {
  const benefits = [
    { label: "High Protein", Icon: ShieldCheck },
    { label: "Clean Label", Icon: Bookmark },
    { label: "Gut-Friendly", Icon: SmilePlus },
    { label: "Allergy Friendly", Icon: CircleSlash },
    { label: "Sustainable & Local", Icon: BarChart3 },
  ];

  return (
    <section className="bg-[hsl(var(--ff-navy))]">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[520px,1fr]">
          {/* LEFT: Heading + bullets */}
          <div className="flex flex-col">
            <h2 className="text-[44px] leading-[1.05] font-extrabold tracking-tight text-[hsl(var(--ff-yellow))] sm:text-[56px] md:text-[64px]">
              Why
              <br />
              futurefoodz
            </h2>

            <p className="mt-3 text-white/80 text-base md:text-lg max-w-[420px]">
              Redefining Plant-Based Food…
            </p>

            <ul className="mt-10 space-y-6">
              {benefits.map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--ff-yellow))] shadow-[0_3px_10px_rgba(0,0,0,0.25)]">
                    <Icon className="h-6 w-6 text-[hsl(var(--ff-navy))]" />
                  </span>
                  <span className="text-white text-xl">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Image masonry */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_380px] gap-4 md:gap-6 w-full">
            {/* Tall left image */}
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 h-full">
              <img
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1600&q=80"
                alt="Kimchi in jars"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right stack */}
            <div className="grid gap-4 md:gap-6">
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=1200&q=80"
                  alt="Kombucha brewing"
                  className="w-full h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80"
                  alt="Tofu skillet"
                  className="w-full h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] object-cover"
                />
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default WhyFuturefoodsSection;


// {/* RIGHT: Image masonry */}
// <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
//   {/* Tall left image */}
//   <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
//     <img
//       src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1600&q=80"
//       alt="Kimchi in jars"
//       className="h-[560px] w-full object-cover"
//     />
//   </div>

//   {/* Right stack */}
//   <div className="grid gap-6">
//     <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
//       <img
//         src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=1200&q=80"
//         alt="Kombucha brewing"
//         className="h-[260px] w-full object-cover"
//       />
//     </div>
//     <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
//       <img
//         src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80"
//         alt="Tofu skillet"
//         className="h-[260px] w-full object-cover"
//       />
//     </div>
//   </div>
// </div>