import React from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const NewHeader = () => {
 const { isAuthenticated, user } = useAuth();

 console.log(isAuthenticated, "isAuthenticatedisAuthenticated", user);
 return (
  <header className="bg-white w-full py-4 px-6">
   <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center">
     {/* <div className="text-2xl font-bold text-[hsl(var(--ff-dark))]">
      futurefoodz
     </div> */}
    </div>

    {/* Navigation */}
    <nav className="hidden md:flex items-center space-x-8 bg-[hsl(var(--ff-navy))] px-8 py-3 rounded-full">
     <img
      src="/lovable-uploads/logo.png"
      alt="FutureFoodz Logo"
      className="w-20 h-12 "
     />
     {[
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop" },
      { href: "/about-us", label: "About Us" },
      { href: "/blog", label: "Blog" },
      isAuthenticated
       ? { href: "/profile", label: "Profile" }
       : { href: "/login", label: "Login" },
     ].map((item) => {
      const isActive =
       typeof window !== "undefined" && window.location.pathname === item.href;
      return (
       <a
        key={item.href}
        href={item.href}
        className={`text-white font-medium transition-colors px-3 py-1 rounded-full
          hover:text-[hsl(var(--ff-yellow))]
          ${isActive ? "border border-white" : ""}`}
       >
        {item.label}
       </a>
      );
     })}
    </nav>

    {/* Cart Icon */}
    <div className="flex items-center space-x-4">
     <a
      href="/cart"
      className="inline-flex items-center gap-2 h-12 px-4 bg-[hsl(var(--ff-yellow))] rounded-lg hover:bg-[hsl(var(--ff-yellow))]/90 transition-colors"
     >
      <svg
       className="w-4 h-4 text-[hsl(var(--ff-dark))]"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
       aria-hidden="true"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19h6"
       />
      </svg>
      <span className="text-[hsl(var(--ff-dark))] font-semibold">Cart</span>
     </a>
    </div>
   </div>
  </header>
 );
};

export default NewHeader;
