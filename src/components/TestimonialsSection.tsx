import React, { useState, useEffect } from "react";

// --- ICONS ---
const QuoteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="64"
    height="44"
    viewBox="0 0 64 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.4141 44V22.64C25.4141 15.36 27.2811 9.44 31.0151 4.88L34.8881 7.64C32.4461 11.48 31.2251 16.28 31.2251 22V44H25.4141ZM57.5551 44V22.64C57.5551 15.36 59.4221 9.44 63.1561 4.88L64 7.64C61.5581 11.48 60.3371 16.28 60.3371 22V44H57.5551Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

// --- Testimonial Card ---
interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
  testimonial: string;
  position?: "left" | "center" | "right";
  animate?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  image,
  name,
  role,
  testimonial,
  position,
  animate,
}) => {
  const positionStyles: Record<string, string> = {
    left: "translate-y-4 scale-90 opacity-70",
    center: "-translate-y-4 scale-105 opacity-100 z-10",
    right: "translate-y-4 scale-90 opacity-70",
  };

  const animationClass = animate ? "transition-all duration-700 ease-in-out" : "";

  return (
    <div
      className={`w-80 h-96 mx-2 flex-shrink-0 relative ${position ? positionStyles[position] : ""} ${animationClass}`}
    >
      <div className="absolute inset-0 bg-yellow-400 rounded-[50px] transform -rotate-12"></div>
      <div className="absolute inset-4 bg-[#0D2A4B] text-white rounded-[40px] p-6 flex flex-col items-center text-center shadow-2xl">
        <div className="absolute -top-12">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/96x96/FFFFFF/0D2A4B?text=User";
            }}
          />
        </div>
        <div className="mt-14 flex flex-col items-center">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-300 mt-1">{role}</p>
          <QuoteIcon className="text-blue-200 opacity-30 my-4" />
          <p className="text-gray-200 text-sm leading-relaxed italic">{testimonial}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Section ---
const TestimonialsSection: React.FC = () => {
  const testimonials: TestimonialCardProps[] = [
    { image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=150&h=150", name: "Hannah Schmitt", role: "Lead Designer", testimonial: "Lorem ipsum dolor sit amet." },
    { image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150", name: "John Doe", role: "Product Manager", testimonial: "Suspendisse sed magna eget nibh." },
    { image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150", name: "Jane Smith", role: "UI/UX Designer", testimonial: "Curabitur nisl mauris, nec turpis." },
    { image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150", name: "Alice Brown", role: "Developer", testimonial: "Another testimonial for carousel." },
    { image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150", name: "Bob Green", role: "Marketing", testimonial: "Yet another testimonial card." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const prev = () => {
    setAnimate(true);
    setCurrentIndex((prev) => (prev - 3 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setAnimate(true);
    setCurrentIndex((prev) => (prev + 3) % testimonials.length);
  };

  // Get visible cards
  const visibleCards = [0, 1, 2].map((i) => {
    const idx = (currentIndex + i) % testimonials.length;
    const position: "left" | "center" | "right" = i === 0 ? "left" : i === 1 ? "center" : "right";
    return { ...testimonials[idx], position, animate };
  });

  // Reset animation after duration
  React.useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 700);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center p-8 font-sans overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center text-white mb-20">
        <h2 className="text-4xl md:text-5xl font-bold">What Our Clients Say About Us</h2>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full max-w-5xl">
        <button onClick={prev} className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors absolute left-0 -translate-x-4 md:-translate-x-8 z-20">
          <ArrowIcon className="w-6 h-6" />
        </button>

        <div className="flex justify-center items-end w-full">
          {visibleCards.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>

        <button onClick={next} className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors absolute right-0 translate-x-4 md:translate-x-8 z-20">
          <ArrowIcon className="w-6 h-6 transform rotate-180" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
