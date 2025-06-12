import React from 'react';
import logo from '../assets/logo3.jpg'; // 🖼️ Replace with your actual logo path

const Header = ({ onAuthOpen }) => {
  return (
    <header className="bg-[#003B4C]/80 backdrop-blur-md text-white border-b border-[#005A6E] fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="RentEasy Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-wide">RentEasy</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {['Home', 'Property List', 'About', 'Contact'].map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm px-4 py-2 transition-all duration-200 hover:bg-[#007C99] hover:text-white rounded-md"
              >
                {item}
              </a>
            ))}
            <a
              href="/dashboard/tenant"
              className="text-sm px-4 py-2 hover:text-[#00A1B3] transition"
            >
              Dashboard
            </a>
          </nav>

          {/* CTA / Auth */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => onAuthOpen('login')}
              className="text-sm px-4 py-2 transition-all duration-200 hover:bg-[#007C99] hover:text-white rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => onAuthOpen('signup')}
              className="bg-[#007C99] text-white text-sm px-4 py-2 rounded-md hover:bg-[#00A1B3] transition"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button aria-label="Open menu">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
