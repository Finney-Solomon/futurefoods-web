import React from "react";
import { Button } from "./ui/button";

const NewHero = () => {
 return (
  <section className="relative bg-white">
   {/* Wide stage so the layout breathes like the mock */}
   {/* <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-20 md:pt-20 lg:pt-24"> */}
   <div className="mx-auto max-w-[1400px] px-6 pt-[10px] pb-20 md:pt-20 lg:pt-24">

    {/* Headline row */}
    <div className="relative grid items-start lg:grid-cols-3">
     {/* Left: “Taste the” */}
     <h1 className="col-span-1 text-[48px] leading-[0.95] font-extrabold tracking-tight text-[hsl(var(--ff-dark))] md:text-[80px] lg:text-[110px]">
      Taste the
     </h1>

     {/* Middle: circular image overlapping both sides */}
     <div className="relative col-span-1 order-3 lg:order-none flex justify-center lg:justify-center">
      <div
       className="relative rounded-full overflow-hidden 
                            w-[220px] h-[220px] md:w-[320px] md:h-[320px] 
                            lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px]
                            lg:-mt-6"
      >
       <img
        src="/lovable-uploads/homescreen.png"
        alt="Fresh Salad Bowl"
        className="w-full h-full object-cover"
       />
      </div>
     </div>

     {/* Right: “Future of Food” */}
     <div className="col-span-1 text-right">
      <h1 className="text-[48px] leading-[0.95] font-extrabold tracking-tight md:text-[80px] lg:text-[110px]">
       <span className="italic text-[hsl(var(--ff-yellow))]">Future</span>
      </h1>
      <h1 className="mt-3 text-[48px] leading-[0.95] font-extrabold tracking-tight text-[hsl(var(--ff-dark))] md:text-[80px] lg:text-[110px]">
       of Food
      </h1>
     </div>
    </div>

    {/* Subline */}
    <p className="mt-10 text-center italic tracking-[0.08em] text-[24px] md:text-[24px] text-[hsl(var(--ff-dark))] let">
     Revolutionizing <span className="not-italic font-semibold">nutrition</span>
    </p>

    {/* Buttons */}
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
     <Button
      size="lg"
      className="rounded-full px-10 py-6 text-lg font-semibold 
                       bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] 
                       hover:bg-[hsl(var(--ff-yellow))]/90"
      onClick={() => (window.location.href = "/shop")}
     >
      Shop now
     </Button>

     <Button
      variant="outline"
      size="lg"
      className="rounded-full px-10 py-6 text-lg font-semibold
                       border-2 border-[hsl(var(--ff-dark))] text-[hsl(var(--ff-dark))] 
                       hover:bg-[hsl(var(--ff-dark))] hover:text-white"
     >
      Learn more
     </Button>
    </div>
   </div>
  </section>
 );
};

export default NewHero;
