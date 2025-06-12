import React from 'react';

const Header = ({ onAuthOpen }) => {
  return (
    <header className="bg-blue-200 border-b border-gray-200 text-[#111827] fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold">RentEasy</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-sm text-[#111827] px-4 py-2 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:rounded-md">Home</a>
            <a href="#" className="text-sm text-[#111827] px-4 py-2 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:rounded-md">Property List</a>
            <a href="#" className="text-sm text-[#111827] px-4 py-2 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:rounded-md">About</a>
            <a href="#" className="text-sm text-[#111827] px-4 py-2 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:rounded-md">Contact</a>
            <a href="/dashboard/tenant" className="text-sm text-[#111827] px-4 py-2 hover:text-blue-600">
  Dashboard
</a>

          </nav>

          {/* CTA / Auth */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => onAuthOpen('login')}
              className="text-sm text-[#111827] px-4 py-2 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:rounded-md"
            >
              Login
            </button>

            <button
              onClick={() => onAuthOpen('signup')}
              className="bg-[#003B4C] text-white text-sm px-4 py-2 hover:bg-blue-600 rounded-none"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button aria-label="Open menu">
              <svg className="h-6 w-6 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
