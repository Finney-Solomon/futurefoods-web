import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  /** Public path to the background image (e.g. "/lovable-uploads/testimonailBg.png") */
  bgImage?: string;
  /** Optional: lift the card up so it overlaps the previous section */
  overlap?: boolean;
};

const CTASection: React.FC<Props> = ({
  bgImage = "/lovable-uploads/testimonailBg.png",
  overlap = true,
}) => {

    const navigate = useNavigate();
  return (
    <section
      aria-label="Join us call to action"
      className={[
        "relative overflow-hidden",
        // height & spacing tuned to your screenshot
        // "py-10 sm:py-14 md:py-20",
        overlap ? "-mt-10 sm:-mt-16 md:-mt-24" : "",
      ].join(" ")}
      style={{
        // backgroundImage: `url(${bgImage})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
      }}
    >
      {/* vignette over the photo */}
      <div className="absolute inset-0 bg-[#0F101300]/70 [mask-image:radial-gradient(1200px_400px_at_50%_18%,#000_35%,transparent_10%)]" />

      {/* soft spotlight beneath the card */}
      <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 h-[440px] w-[1200px] rounded-[48px] blur-3xl bg-black/60" />

      {/* CTA card */}
      <div className="relative z-10">
        <div className="max-w-[1120px] mx-auto px-4">
          <div className="bg-[hsl(var(--ff-navy))] text-center rounded-[40px] md:rounded-[48px] px-6 sm:px-10 md:px-16 py-12 md:py-16 shadow-2xl ring-1 ring-black/10">
            <h2 className="text-white text-3xl sm:text-4xl md:text-[40px] md:leading-[1.15] font-bold tracking-tight mb-4">
              Join Us in Building a Healthier
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-10">
              Health starts now...
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 sm:h-14 rounded-full bg-white text-[hsl(var(--ff-dark))] hover:bg-white/90 px-8 sm:px-10 text-sm sm:text-base font-semibold shadow focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Join us
              </Button>

              <Button
                onClick={()=>{
                  navigate('/shop')
                }}
                size="lg"
                className="h-12 sm:h-14 rounded-full bg-[hsl(var(--ff-dark))] text-white hover:bg-black px-8 sm:px-10 text-sm sm:text-base font-semibold inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span>Buy now</span>
                <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/10">
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* gentle dark fade into the footer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
    </section>
  );
};

export default CTASection;
