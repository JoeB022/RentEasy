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
                      <Hero />
                      <FeatureHighlights />
                    </>
                  }
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/demo/protected-route" element={<ProtectedRouteDemo />} />
                <Route 
                  path="/login" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <Auth mode="login" onClose={() => {}} />
                      </div>
                    </div>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <Auth mode="signup" onClose={() => {}} />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
