import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import FeatureHighlights from './components/FeatureHighlights';
import Footer from './components/Footer';
import Auth from './components/Auth';

import TenantDashboard from './pages/TenantDashboard';

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
        <Header onAuthOpen={handleAuthOpen} />

        <main className="flex-grow">
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
            <Route path="/dashboard/tenant" element={<TenantDashboard />} />
          </Routes>
        </main>

        <Footer />

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
      </div>
    </Router>
  );
}

export default App;
