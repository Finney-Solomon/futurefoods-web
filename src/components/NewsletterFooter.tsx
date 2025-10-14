import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CTASection from "./CTASection";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const NewsletterFooter = () => {
 const [email, setEmail] = useState("");
 const [error, setError] = useState("");

 const footerLinks = useMemo(
  () => ({
   company: [
    { label: "About Us", href: "/about-us" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
   ],
   products: [
    { label: "All Products", href: "/shop" },
    { label: "Kimchi", href: "/shop?cat=kimchi" },
    { label: "Sauerkraut", href: "/shop?cat=sauerkraut" },
    { label: "Tempeh", href: "/shop?cat=tempeh" },
    { label: "Kombucha", href: "/shop?cat=kombucha" },
   ],
   support: [
    { label: "Contact Us", href: "/support/contact" },
    { label: "FAQ", href: "/support/faq" },
    { label: "Shipping", href: "/support/shipping" },
    { label: "Returns", href: "/support/returns" },
    { label: "Help Center", href: "/support" },
   ],
  }),
  []
 );

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!emailRegex.test(email)) {
   setError("Please enter a valid email address.");
   return;
  }
  setError("");
  // TODO: call your newsletter API here
  console.log("Newsletter signup:", email);
  setEmail("");
 };

 return (
  <footer className="bg-black text-white pt-16 pb-16 px-6">
   {/* CTA with background photo */}
   <CTASection bgImage="/lovable-uploads/testimonailBg.png" overlap />

   <div className="max-w-7xl mx-auto">
    {/* Newsletter */}
    <div className="text-center mb-16">
     <h2 className="text-4xl font-bold mb-12 mt-24">Stay Fresh!</h2>

     <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto mt-12"
      aria-label="Newsletter signup"
     >
      <label htmlFor="email" className="sr-only">
       Email address
      </label>
      <Input
       id="email"
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       placeholder="Enter your email"
       className={[
        "bg-white/20 border-white/30 text-white placeholder-white/70",
        "rounded-full px-6 py-3 focus-visible:ring-2 focus-visible:ring-white/60",
       ].join(" ")}
       required
       aria-invalid={!!error}
       aria-describedby={error ? "newsletter-error" : undefined}
      />
      <Button
       type="submit"
       className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 rounded-full px-8 py-3 font-semibold focus-visible:ring-2 focus-visible:ring-[hsl(var(--ff-yellow))]/70"
      >
       Subscribe
      </Button>
     </form>

     {error ? (
      <p
       id="newsletter-error"
       className="mt-2 text-sm text-red-300"
       role="alert"
      >
       {error}
      </p>
     ) : null}
    </div>

    {/* Columns */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
     {/* Brand */}
     <div className="max-w-xs">
      <img
       src="/lovable-uploads/logo.png"
       alt="FutureFoodz Logo"
       className="w-50 h-20 "
      />
      {/* <h3 className="text-2xl font-bold mb-6">futurefoodz</h3> */}
      <p className="text-gray-400 text-sm leading-relaxed">
       #NoFuss — just pure, fermented goodness for your health and the planet.
      </p>
     </div>

     {/* Company */}
     <nav aria-label="Company">
      <h4 className="text-lg font-semibold mb-4">Company</h4>
      <ul className="space-y-3">
       {footerLinks.company.map((l) => (
        <li key={l.label}>
         <a
          href={l.href}
          className="text-gray-400 hover:text-[hsl(var(--ff-yellow))] transition-colors text-sm"
         >
          {l.label}
         </a>
        </li>
       ))}
      </ul>
     </nav>

     {/* Products */}
     <nav aria-label="Products">
      <h4 className="text-lg font-semibold mb-4">Products</h4>
      <ul className="space-y-3">
       {footerLinks.products.map((l) => (
        <li key={l.label}>
         <a
          href={l.href}
          className="text-gray-400 hover:text-[hsl(var(--ff-yellow))] transition-colors text-sm"
         >
          {l.label}
         </a>
        </li>
       ))}
      </ul>
     </nav>

     {/* Support & Social */}
     <div>
      <nav aria-label="Support">
       <h4 className="text-lg font-semibold mb-4">Support</h4>
       <ul className="space-y-3">
        {footerLinks.support.map((l) => (
         <li key={l.label}>
          <a
           href={l.href}
           className="text-gray-400 hover:text-[hsl(var(--ff-yellow))] transition-colors text-sm"
          >
           {l.label}
          </a>
         </li>
        ))}
       </ul>
      </nav>

      {/* Social */}
      <div className="mt-6" aria-label="Follow us">
       <h5 className="text-sm font-semibold mb-3">Follow Us</h5>
       <div className="flex space-x-4">
        {/* Facebook */}
        <a
         href="https://www.facebook.com/"
         aria-label="Facebook"
         className="text-gray-400 hover:text-[hsl(var(--ff-yellow))] transition-colors"
        >
         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.97h-2.34v7.03C18.34 21.25 22 17.08 22 12.06z" />
         </svg>
        </a>

        {/* Instagram */}
        <a
         href="https://www.instagram.com/"
         aria-label="Instagram"
         className="text-gray-400 hover:text-[hsl(var(--ff-yellow))] transition-colors"
        >
         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.3a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
         </svg>
        </a>

        {/* Twitter/X */}
        <a
         href="https://twitter.com/"
         aria-label="Twitter"
         className="text-gray-400 hover:text-[hsl(var(--ff-yellow))] transition-colors"
        >
         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
         </svg>
        </a>
       </div>
      </div>
     </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
     <p className="text-gray-400 text-sm">
      © 2025 Futurefoodz. All rights reserved.
     </p>
     <div className="flex space-x-6 mt-4 md:mt-0">
      <a href="/privacy" className="text-gray-400 hover:text-white text-sm">
       Privacy Policy
      </a>
      <a href="/terms" className="text-gray-400 hover:text-white text-sm">
       Terms of Service
      </a>
     </div>
    </div>
   </div>
  </footer>
 );
};

export default NewsletterFooter;
