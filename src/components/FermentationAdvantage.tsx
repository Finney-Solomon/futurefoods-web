import React from "react";

const FermentationAdvantage = () => {
  return (
    <section className="bg-[hsl(var(--ff-yellow))]">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* LEFT — Title + Steps image */}
          <div>
            {/* <h2 className="text-[44px] md:text-[64px] leading-[1.05] font-extrabold tracking-tight text-[hsl(var(--ff-dark))]">
              The Fermentation Advantage
            </h2> */}
            <h2
              className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] 
             leading-tight md:leading-[1.05] font-extrabold tracking-tight 
             text-[hsl(var(--ff-dark))]"
            >
              The Fermentation Advantage
            </h2>
            <p className="mt-2 text-[hsl(var(--ff-dark))] text-xl">
              The Magic of Fermentation…
            </p>

            {/* Steps PNG */}
            <div className="mt-10 p-1">
              <img
                src="/lovable-uploads/Step.png"
                alt="Fermentation steps"
                className="w-full max-w-[300px] h-auto object-contain mt-"
              />
            </div>
          </div>

          {/* RIGHT — Jars image */}
          {/* <div className="flex justify-center lg:justify-end">
            <img
              src="/lovable-uploads/TheFermentationAdvantage.png"
              alt="Fermented jars"
              className=" w-[800px] max-w-[820px] h-auto object-contain rounded-2xl"
            />
          </div> */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/lovable-uploads/TheFermentationAdvantage.png"
              alt="Fermented jars"
              className="w-full max-w-[800px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[820px] h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FermentationAdvantage;
