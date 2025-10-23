import React, { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NewHeader = () => {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop" },
      { href: "/about-us", label: "About Us" },
      { href: "/blog", label: "Blog" },
      isAuthenticated
        ? { href: "/profile", label: "Profile" }
        : { href: "/login", label: "Login" },
    ],
    [isAuthenticated]
  );

  const isActive = (href: string) =>
    typeof window !== "undefined" && window.location?.pathname === href;

  return (
    <>
      {/* Header */}
      <header className=" top-0 left-0 z-50 w-full bg-[#0D2A4B] md:bg-white ">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex h-20 md:h-24 items-center justify-between">
            {/* Mobile: Hamburger (md:hidden) */}
            <button
              aria-label="Open menu"
              className="md:hidden inline-flex p-2 rounded-md text-white/90 hover:bg-white/10 transition"
              onClick={() => setMenuOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile: Centered Logo (single logo only) */}
            <a href="/" className="md:hidden flex-1 flex justify-center">
              <img
                src="/lovable-uploads/logo.png"
                alt="FutureFoodz"
                className="h-16 w-auto"
              />
            </a>

            {/* Mobile: Cart */}
            <a
              href="/cart"
              className="md:hidden inline-flex items-center gap-2 h-9 px-3 rounded-md bg-[hsl(var(--ff-yellow))] hover:bg-[hsl(var(--ff-yellow))]/90 transition"
              aria-label="Open cart"
            >
              <svg className="h-4 w-4 text-[hsl(var(--ff-dark))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19h6" />
              </svg>
              <span className="text-[hsl(var(--ff-dark))] text-sm font-semibold">Cart</span>
            </a>

            {/* Desktop: Centered Nav Pill (single logo + links) */}
            <div className="hidden md:flex w-full justify-center">
              <nav className="flex items-center gap-6 rounded-full bg-[hsl(var(--ff-navy))] px-8 py-3 shadow-sm">
                <a href="/" className="inline-flex items-center">
                  <img
                    src="/lovable-uploads/logo.png"
                    alt="FutureFoodz"
                    className="h-16 w-auto"
                  />
                </a>

                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={[
                      "text-white/90 font-medium px-3 py-1 rounded-full transition-colors",
                      "hover:text-[hsl(var(--ff-yellow))]",
                      isActive(item.href) ? "border border-white/70" : "",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="/cart"
                  className="ml-2 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[hsl(var(--ff-yellow))] hover:bg-[hsl(var(--ff-yellow))]/90 transition"
                >
                  <svg className="h-4 w-4 text-[hsl(var(--ff-dark))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19h6" />
                  </svg>
                  <span className="text-[hsl(var(--ff-dark))] font-semibold">Cart</span>
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Side Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full w-72 bg-[#0D2A4B] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <a href="/" onClick={() => setMenuOpen(false)}>
                  <img src="/lovable-uploads/logo.png" alt="FutureFoodz" className="h-16 w-auto" />
                </a>
                <button
                  aria-label="Close menu"
                  className="p-2 rounded-md text-white/90 hover:bg-white/10 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-2 flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/90 text-base font-medium py-3 px-3 rounded-md hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <a
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="mt-auto inline-flex items-center gap-2 h-11 px-4 rounded-md bg-[hsl(var(--ff-yellow))] hover:bg-[hsl(var(--ff-yellow))]/90 transition"
              >
                <svg className="h-4 w-4 text-[hsl(var(--ff-dark))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19h6" />
                </svg>
                <span className="text-[hsl(var(--ff-dark))] font-semibold">Cart</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header (avoid content hiding) */}
      <div className="h-16 md:h-24" />
    </>
  );
};

export default NewHeader;
