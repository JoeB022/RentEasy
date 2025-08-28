import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo3.jpg';
import { Button, Typography } from './ui';
import { LogoutButton } from './common';
import { isAuthenticated, getUserRole } from '../utils/auth';

const Header = ({ onAuthOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-gradient-to-r from-[#003B4C]/90 via-[#004A5F]/90 to-[#005A6E]/90 backdrop-blur-xl text-white border-b border-[#005A6E]/50 fixed top-0 left-0 right-0 z-50 shadow-lg hover:shadow-xl transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105 group"
            onClick={() => handleNavigation('/')}
          >
            <div className="relative">
              <img src={logo} alt="RentEasy Logo" className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/30 transition-all duration-300"></div>
            </div>
            <Typography.Heading level={4} className="text-white tracking-wide font-bold group-hover:text-blue-200 transition-colors duration-300">
              RentEasy
            </Typography.Heading>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`text-sm px-4 py-2 transition-all duration-300 rounded-xl font-medium ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-[#007C99] to-[#0099B3] text-white shadow-lg'
                    : 'hover:bg-gradient-to-r hover:from-[#007C99]/80 hover:to-[#0099B3]/80 hover:text-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA / Auth */}
          <div className="hidden md:flex space-x-4">
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/90 font-medium px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                  Welcome, {getUserRole() || 'User'}
                </span>
                <LogoutButton 
                  variant="outline" 
                  size="sm"
                  className="border-white/60 text-white hover:bg-white hover:text-[#003B4C] hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                />
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAuthOpen('login')}
                  className="text-white hover:bg-white/20 hover:text-white backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-md px-6 py-2 rounded-xl"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAuthOpen('signup')}
                  className="bg-gradient-to-r from-[#007C99] to-[#0099B3] hover:from-[#0088A3] hover:to-[#00A6C0] text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg px-6 py-2 rounded-xl font-medium"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated() && (
              <LogoutButton 
                variant="outline" 
                size="sm"
                className="border-white/60 text-white hover:bg-white hover:text-[#003B4C] hover:border-white transition-all duration-300 transform hover:scale-105 text-xs px-2 py-1 rounded-lg"
              >
                Logout
              </LogoutButton>
            )}
            <button 
              aria-label="Open menu"
              className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
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
