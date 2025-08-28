import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Hero from './components/Hero';
import FeatureHighlights from './components/FeatureHighlights';
import Footer from './components/Footer';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import ProtectedRouteDemo from './components/ProtectedRouteDemo';

// Lazy load additional pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Lazy load dashboard pages for code splitting
const TenantDashboard = lazy(() => import('./pages/TenantDashboard'));
const LandlordDashboard = lazy(() => import('./pages/LandlordDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));



function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // or 'signup'

  const handleAuthOpen = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  return (
    <Router>
      <div className="relative bg-[#f9fafb] min-h-screen flex flex-col">
        {/* Header */}
        <Header onAuthOpen={handleAuthOpen} />

        {/* Main Content */}
        <main className="flex-grow">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Loader size="xl" />
                  <p className="mt-4 text-gray-600 text-lg font-medium">
                    Loading RentEasy...
                  </p>
                </div>
              </div>
            }>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero onGetStarted={() => handleAuthOpen('signup')} />
                      <div className="relative z-10 bg-[#f9fafb]">
                        <FeatureHighlights />
                      </div>
                    </>
                  }
                />
                <Route path="/about" element={<About onAuthOpen={handleAuthOpen} />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/demo/protected-route" element={<ProtectedRouteDemo />} />
                <Route 
                  path="/login" 
                  element={
                    <div className="relative min-h-screen">
                      {/* Hero as background skeleton */}
                      <Hero isSkeleton={true} />
                      
                      {/* Auth form overlay */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                        onClick={() => window.location.href = '/'}
                      >
                        <div 
                          className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-white/20 auth-form-hover relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close button positioned at top-right of form container */}
                          <button
                            onClick={() => window.location.href = '/'}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 z-10"
                            aria-label="Close"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <Auth mode="login" onClose={() => window.location.href = '/'} />
                        </div>
                      </div>
                    </div>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <div className="relative min-h-screen">
                      {/* Hero as background skeleton */}
                      <Hero isSkeleton={true} />
                      
                      {/* Auth form overlay */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                        onClick={() => window.location.href = '/'}
                      >
                        <div 
                          className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-white/20 auth-form-hover relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close button positioned at top-right of form container */}
                          <button
                            onClick={() => window.location.href = '/'}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 z-50 bg-white shadow-lg border border-gray-200"
                            aria-label="Close"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <Auth mode="signup" onClose={() => window.location.href = '/'} />
                        </div>
                      </div>
                    </div>
                  } 
                />
                <Route 
                  path="/dashboard/tenant" 
                  element={
                    <ProtectedRoute allowedRoles={["tenant"]}>
                      <TenantDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/landlord" 
                  element={
                    <ProtectedRoute allowedRoles={["landlord"]}>
                      <LandlordDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/admin" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <Footer />

        {/* Auth Modal */}
        {showAuth && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={handleAuthClose}
          >
            <div 
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                onClick={handleAuthClose}
              >
                ✕
              </button>
              <Auth mode={authMode} onClose={handleAuthClose} />
            </div>
          </div>
        )}

        {/* 🔔 Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#003B4C',
              color: '#ffffff',
              fontSize: '0.875rem',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
