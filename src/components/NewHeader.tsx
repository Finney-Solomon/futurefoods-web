import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const NewHeader = () => {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about-us", label: "About Us" },
    { href: "/blog", label: "Blog" },
    isAuthenticated
      ? { href: "/profile", label: "Profile" }
      : { href: "/login", label: "Login" },
  ];
  return (
    <>
      {/* Header */}
      <header className="w-full bg-white shadow-md fixed md:static top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden p-2 rounded-md text-[hsl(var(--ff-dark))] hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo - center on mobile, left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
            <img
              src="/lovable-uploads/logo.png"
              alt="FutureFoodz Logo"
              className="w-20 h-12"
            />
          </div>

          {/* Desktop Navigation - md+ */}
          <nav className="hidden md:flex items-center space-x-8 bg-[hsl(var(--ff-navy))] px-8 py-3 rounded-full max-w-7xl mx-auto mt-4">
            <img
              src="/lovable-uploads/logo.png"
              alt="FutureFoodz Logo"
              className="w-20 h-12"
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


          <div className="flex-1 flex justify-center md:justify-center">
            <img
              src="/lovable-uploads/logo.png"
              alt="FutureFoodz Logo"
              className="w-20 h-12"
            />
          </div>



          {/* Right: Cart */}
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


        {/* Mobile Side Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />
            {/* Side menu */}
            <div className="relative w-64 bg-[hsl(var(--ff-navy))] h-full p-6 flex flex-col gap-6">
              <button
                className="self-end p-2 rounded-md text-white hover:bg-gray-700 transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about-us", label: "About Us" },
                { href: "/blog", label: "Blog" },
                isAuthenticated
                  ? { href: "/profile", label: "Profile" }
                  : { href: "/login", label: "Login" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white text-lg font-medium py-2 px-3 rounded hover:text-[hsl(var(--ff-yellow))]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>



    // <header className="bg-white w-full py-4 px-6">
    //   <div className="max-w-7xl mx-auto flex items-center justify-between">
    //     {/* Logo */}
    //     <div className="flex items-center">
    //       {/* <div className="text-2xl font-bold text-[hsl(var(--ff-dark))]">
    //   futurefoodz
    //  </div> */}
    //     </div>

    //     {/* Navigation */}
    //     <nav className="hidden md:flex items-center space-x-8 bg-[hsl(var(--ff-navy))] px-8 py-3 rounded-full">
    //       <img
    //         src="/lovable-uploads/logo.png"
    //         alt="FutureFoodz Logo"
    //         className="w-20 h-12 "
    //       />
    //       {[
    //         { href: "/", label: "Home" },
    //         { href: "/shop", label: "Shop" },
    //         { href: "/about-us", label: "About Us" },
    //         { href: "/blog", label: "Blog" },
    //         isAuthenticated
    //           ? { href: "/profile", label: "Profile" }
    //           : { href: "/login", label: "Login" },
    //       ].map((item) => {
    //         const isActive =
    //           typeof window !== "undefined" && window.location.pathname === item.href;
    //         return (
    //           <a
    //             key={item.href}
    //             href={item.href}
    //             className={`text-white font-medium transition-colors px-3 py-1 rounded-full
    //       hover:text-[hsl(var(--ff-yellow))]
    //       ${isActive ? "border border-white" : ""}`}
    //           >
    //             {item.label}
    //           </a>
    //         );
    //       })}
    //     </nav>

    //     {/* Cart Icon */}
    //     <div className="flex items-center space-x-4">
    //       <a
    //         href="/cart"
    //         className="inline-flex items-center gap-2 h-12 px-4 bg-[hsl(var(--ff-yellow))] rounded-lg hover:bg-[hsl(var(--ff-yellow))]/90 transition-colors"
    //       >
    //         <svg
    //           className="w-4 h-4 text-[hsl(var(--ff-dark))]"
    //           fill="none"
    //           stroke="currentColor"
    //           viewBox="0 0 24 24"
    //           aria-hidden="true"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth={2}
    //             d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19h6"
    //           />
    //         </svg>
    //         <span className="text-[hsl(var(--ff-dark))] font-semibold">Cart</span>
    //       </a>
    //     </div>
    //   </div>
    // </header>
  );
};

export default NewHeader;
