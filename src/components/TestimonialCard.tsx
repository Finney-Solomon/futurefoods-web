import React, { useEffect, useMemo, useRef, useState } from "react";

/* Icons */
const Chevron = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const Quote = ({ className = "" }) => (
  <svg viewBox="0 0 64 44" className={className} fill="currentColor">
    <path d="M25.414 44V22.64c0-7.28 1.867-13.2 5.601-17.76l3.873 2.76c-2.442 3.84-3.663 8.64-3.663 14.36V44h-5.811Zm32.141 0V22.64c0-7.28 1.867-13.2 5.601-17.76L64 7.64c-2.442 3.84-3.663 8.64-3.663 14.36V44h-2.782Z" />
  </svg>
);

/* Reusable Card */
const TestimonialCard: React.FC<{
  image: string; name: string; role: string; text: string;
  size?: "lg" | "md"; tight?: boolean;
}> = ({ image, name, role, text, size = "md", tight }) => {
  const scale = size === "lg" ? "scale-[1.06] z-10" : "scale-[0.9] opacity-95";
  const w = size === "lg" ? (tight ? "w-[720px]" : "w-[760px]") : "w-[520px]";
  const h = size === "lg" ? "h-[360px] md:h-[380px]" : "h-[320px]";
  return (
    <div className={`relative ${scale} transition-all duration-500`}>
      <div className={`relative ${w} ${h}`}>
        <div className="absolute -bottom-7 -right-7 h-full w-full rounded-[48px] bg-[hsl(var(--ff-yellow))]"
             style={{ transform: "rotate(-4deg)" }} />
        <div className="absolute inset-0 rounded-[48px] bg-[hsl(var(--ff-navy))] text-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-8 w-16 rounded-b-full bg-[hsl(var(--ff-yellow))]" />
              <img src={image} alt={name}
                   className="relative z-10 h-20 w-20 rounded-full border-4 border-white object-cover shadow-xl" />
            </div>
          </div>
          <div className="mt-12 text-center">
            <h3 className="text-[22px] font-extrabold">{name}</h3>
            <p className="mt-1 text-[13px] text-white/80">{role}</p>
            <div className="my-3 flex items-center justify-center gap-2">
              <Quote className="h-5 w-5 text-[hsl(var(--ff-yellow))]" />
              <Quote className="h-5 w-5 -scale-x-100 text-[hsl(var(--ff-yellow))]" />
            </div>
            <p className="mx-auto max-w-[86%] text-[15px] leading-6 text-white/90">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helper: chunk array into pages of N */
const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

/* Main Section */
const TestimonialsExact: React.FC = () => {
  /* 8 different testimonials */
  const items = useMemo(() => [
    { image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200",
      name: "Aisha Verma", role: "Nutrition Coach",
      text: "Futurefoodz made healthy eating effortless. Fermented sides are now a staple at home!" },
    { image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&h=200",
      name: "Liam Carter", role: "Product Manager",
      text: "Loved the bold flavors. You feel the gut-friendly difference in a week." },
    { image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&h=200",
      name: "Meera Patel", role: "Food Blogger",
      text: "Kombucha + kimchi combo is 💯. Clean label and super consistent quality." },
    { image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&h=200",
      name: "Ethan Brooks", role: "Designer",
      text: "Tastes great and fits my macros. Tempeh bowls are my go-to lunch." },
    { image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200",
      name: "Sofia Almeida", role: "Chef",
      text: "The ferment profile is spot on—bright, crunchy, and layered." },
    { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200",
      name: "Noah Kim", role: "Research Analyst",
      text: "Energy levels up, bloating down. Couldn’t ask for more." },
    { image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&h=200",
      name: "Riya Sharma", role: "Student",
      text: "Affordable, tasty, and fast delivery. My friends keep stealing my jars!" },
    { image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=200&h=200",
      name: "Marco Rossi", role: "Photographer",
      text: "The jars look gorgeous in photos—and the taste backs it up." },
  ], []);

  /* Pages: 3 cards per page (left/center/right) */
  const pages = useMemo(() => chunk(items, 3), [items]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Keep the active dot in sync while dragging */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(i, pages.length - 1));
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden pb-16 pt-24 min-h-[680px]
                 bg-[url('/lovable-uploads/testimonailBg.png')] bg-cover bg-center"
      /* Fallback for environments without Tailwind arbitrary bg */
      style={{ backgroundImage: "url('/lovable-uploads/testimonailBg.png')" }}
    >
      {/* readability overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Title + arrows + dots */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4">
        <div className="flex items-center justify-between text-white">
          <button
            aria-label="Previous"
            onClick={() => goTo(active - 1)}
            className="rounded-full p-2 hover:bg-white/20"
          >
            <Chevron className="h-8 w-8" />
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-center text-[36px] md:text-[44px] lg:text-[48px] font-extrabold">
              What Our Clients Say About Us
            </h2>
            <div className="mt-4 flex items-center gap-4">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-3 w-3 rounded-full transition ${active === i ? "bg-[hsl(var(--ff-yellow))]" : "bg-white"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            aria-label="Next"
            onClick={() => goTo(active + 1)}
            className="rounded-full p-2 hover:bg-white/20"
          >
            <Chevron className="h-8 w-8 rotate-180" />
          </button>
        </div>
      </div>

      {/* Scrollable, snap carousel */}
      <div className="relative z-10 mt-10">
        <div
          ref={scrollerRef}
          className="mx-auto max-w-[1500px] overflow-x-auto snap-x snap-mandatory scroll-smooth px-4
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex">
            {pages.map((page, i) => (
              <div key={i} className="min-w-full snap-center">
                <div className="flex items-start justify-center gap-6 lg:gap-10 py-8">
                  {/* left / center / right cards per page */}
                  <TestimonialCard {...page[0]} size="md" />
                  {page[1] && <TestimonialCard {...page[1]} size="lg" tight />}
                  {page[2] && <TestimonialCard {...page[2]} size="md" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsExact;
