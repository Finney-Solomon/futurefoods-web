import React from "react";

// --- ICONS ---
// It's good practice to define icons as separate components for reusability.

const QuoteIcon = ({ className }) => (
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

const ArrowIcon = ({ className }) => (
 <svg
  className={className}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
 >
  <path
   strokeLinecap="round"
   strokeLinejoin="round"
   d="M15.75 19.5L8.25 12l7.5-7.5"
  />
 </svg>
);

// --- Testimonial Card Component (New) ---
// This component renders a single card with the complex, layered design.

interface TestimonialCardProps {
 image: string;
 name: string;
 role: string;
 testimonial: string;
 position: "left" | "center" | "right";
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
 image,
 name,
 role,
 testimonial,
 position,
}) => {
 // Apply different styles based on the card's position
 const positionStyles = {
  left: "transform scale-90 -rotate-6 opacity-80 md:block hidden", // Hide on small screens
  center: "transform scale-105 z-10",
  right: "transform scale-90 rotate-6 opacity-80 md:block hidden", // Hide on small screens
 };

 return (
  <div
   className={`transition-all duration-500 ease-in-out ${positionStyles[position]}`}
  >
   <div className="relative w-80 h-96">
    {/* Yellow accent shape */}
    <div className="absolute inset-0 bg-yellow-400 rounded-[50px] transform -rotate-12"></div>

    {/* Blue content card */}
    <div className="absolute inset-4 bg-[#0D2A4B] text-white rounded-[40px] p-6 flex flex-col items-center text-center shadow-2xl">
     {/* Profile Image */}
     <div className="absolute -top-12">
      <img
       src={image}
       alt={`Photo of ${name}`}
       className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
       onError={(e) => {
        e.currentTarget.src =
         "https://placehold.co/96x96/FFFFFF/0D2A4B?text=User";
       }}
      />
     </div>

     {/* Card Content */}
     <div className="mt-14 flex flex-col items-center">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-sm text-gray-300 mt-1">{role}</p>
      <QuoteIcon className="text-blue-200 opacity-30 my-4" />
      <p className="text-gray-200 text-sm leading-relaxed italic">
       {testimonial}
      </p>
     </div>
    </div>
   </div>
  </div>
 );
};

// --- Type definition for the testimonial data ---
// This ensures the `position` property is correctly typed.
type TestimonialData = {
 image: string;
 name: string;
 role: string;
 testimonial: string;
 position: "left" | "center" | "right";
};

// --- Main Testimonials Section (Updated) ---
// This is the main component that you export.

const TestimonialsSection = () => {
 // Explicitly type the array to match the TestimonialData type.
 const testimonials: TestimonialData[] = [
  {
   image:
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=150&h=150",
   name: "Hannah Schmitt",
   role: "Lead Designer",
   testimonial:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl mauris, nec turpis.",
   position: "left",
  },
  {
   image:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
   name: "Hannah Schmitt",
   role: "Lead Designer",
   testimonial:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl mauris, nec turpis. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
   position: "center",
  },
  {
   image:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
   name: "Hannah Schmitt",
   role: "Lead Designer",
   testimonial:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl mauris, nec turpis.",
   position: "right",
  },
 ];

 return (
  <section
   className="relative min-h-screen flex flex-col items-center justify-center p-8 font-sans overflow-hidden"
   style={{
    backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1920&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
   }}
  >
   {/* Semi-transparent overlay for better text readability */}
   <div className="absolute inset-0 bg-black bg-opacity-50"></div>

   <div className="relative z-10 text-center text-white mb-20">
    <h2 className="text-4xl md:text-5xl font-bold">
     What Our Clients Say About Us
    </h2>
   </div>

   {/* Carousel container */}
   <div className="relative flex items-center justify-center w-full max-w-5xl">
    {/* Left Arrow */}
    <button className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors absolute left-0 -translate-x-4 md:-translate-x-8 z-20">
     <ArrowIcon className="w-6 h-6" />
    </button>

    {/* Testimonial Cards */}
    <div className="flex items-center justify-center md:space-x-[-4rem]">
     {testimonials.map((testimonial, index) => (
      <TestimonialCard key={index} {...testimonial} />
     ))}
    </div>

    {/* Right Arrow */}
    <button className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors absolute right-0 translate-x-4 md:translate-x-8 z-20">
     <ArrowIcon className="w-6 h-6 transform rotate-180" />
    </button>
   </div>

   {/* Carousel Dots */}
   <div className="relative z-10 flex space-x-2 mt-20">
    <div className="w-3 h-3 bg-white rounded-full cursor-pointer"></div>
    <div className="w-3 h-3 bg-white/50 rounded-full cursor-pointer"></div>
    <div className="w-3 h-3 bg-white/50 rounded-full cursor-pointer"></div>
    <div className="w-3 h-3 bg-white/50 rounded-full cursor-pointer"></div>
   </div>
  </section>
 );
};

export default TestimonialsSection;
