import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';

const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>;



const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);




const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated ,user} = useAuth();

  console.log(isAuthenticated,"isAuthenticatedisAuthenticated",user)
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about-us', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                className="h-12 w-auto"
                src="https://api.builder.io/api/v1/image/assets/293e78bed62a41a9ab365dc4fe5df9cc/10a755595c7293fefa66342cfdc7413156f19d12?placeholderIfAbsent=true"
                alt="FutureFoodz Logo"
                onError={(e: any) => { e.currentTarget.src = 'https://placehold.co/150x50/0D2A4B/FFFFFF?text=FutureFoodz'; }}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center bg-[#0D2A4B] rounded-full p-2 shadow-md">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white hover:bg-white/10 transition-colors duration-300 text-base font-medium px-4 py-2 rounded-full">
                  {link.label}
                </Link>
              ))}

              {/* Login or Profile */}
              {isAuthenticated ? (
                <Link href="/profile" className="bg-white text-[#0D2A4B] py-2 px-6 rounded-full hover:bg-gray-200 transition-all duration-300 font-semibold text-sm shadow-sm ml-2">
                  Profile
                </Link>
              ) : (
                <Link href="/login" className="bg-white text-[#0D2A4B] py-2 px-6 rounded-full hover:bg-gray-200 transition-all duration-300 font-semibold text-sm shadow-sm ml-2">
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/cart" className="text-[#0D2A4B] hover:bg-gray-100 p-2 rounded-full transition-colors duration-300">
              <span className="sr-only">Shopping Cart</span>
              <CartIcon />
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#0D2A4B] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" id="mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-800 hover:bg-yellow-100 hover:text-yellow-800 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-2">
              {isAuthenticated ? (
                <Link href="/profile" className="block w-full text-center bg-yellow-400 text-[#0D2A4B] py-2.5 px-5 rounded-lg hover:bg-yellow-500 transition-all duration-300 font-semibold shadow-sm">
                  Profile
                </Link>
              ) : (
                <Link href="/login" className="block w-full text-center bg-yellow-400 text-[#0D2A4B] py-2.5 px-5 rounded-lg hover:bg-yellow-500 transition-all duration-300 font-semibold shadow-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
