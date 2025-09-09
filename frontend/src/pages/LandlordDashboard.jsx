import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  CreditCard,
  Wrench,
  UserCircle,
  Menu,
  X,
} from 'lucide-react';

import PropertyManager from '../components/PropertyManager';
import TenantsByHouse from '../components/TenantsByHouse';
import RealTimePayments from '../components/RealTimePayment2';
import ApartmentServiceAddons from '../components/ApartmentServiceAddons';
import LandlordProfile from '../components/LandlordProfile';
import { LogoutButton } from '../components/common';

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { label: 'Properties', value: 'properties', icon: Building },
    { label: 'Tenants', value: 'tenants', icon: Users },
    { label: 'Payments', value: 'payments', icon: CreditCard },
    { label: 'Services', value: 'services', icon: Wrench },
    { label: 'Profile', value: 'profile', icon: UserCircle },
  ];

  // Sidebar toggle functions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Handle tab change and close sidebar on mobile
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    if (window.innerWidth < 768) { // md breakpoint
      closeSidebar();
    }
  };

  // Keyboard event handling for accessibility
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertyManager />;
      case 'tenants':
        return <TenantsByHouse />;
      case 'payments':
        return <RealTimePayments />;
      case 'services':
        return <ApartmentServiceAddons />;
      case 'profile':
        return <LandlordProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#003B4C] to-[#005A6E] text-white z-50 transform transition-all duration-500 ease-in-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white font-bold">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        <div className="px-6 py-8 space-y-4">
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium w-full group ${
                activeTab === value
                  ? 'bg-gradient-to-r from-white to-blue-50 text-[#003B4C] shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/20 hover:text-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeTab === value 
                    ? 'bg-[#003B4C]/20 text-[#003B4C]' 
                    : 'bg-white/20 text-white group-hover:bg-white/30 group-hover:scale-110'
                }`}>
                  <Icon size={18} />
                </div>
                {label}
              </div>
            </button>
          ))}
          
          {/* Logout Button in Mobile Sidebar */}
          <div className="pt-6 border-t border-white/20">
            <LogoutButton 
              variant="outline" 
              size="sm"
              className="w-full border-white/40 text-white hover:bg-white hover:text-[#003B4C] hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-md rounded-xl"
            />
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#003B4C] to-[#005A6E] text-white fixed h-full z-30 shadow-2xl">
        <div className="px-6 py-8 space-y-4">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white font-bold mb-2">Landlord Dashboard</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
          </div>
          
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium w-full group ${
                activeTab === value
                  ? 'bg-gradient-to-r from-white to-blue-50 text-[#003B4C] shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/20 hover:text-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeTab === value 
                    ? 'bg-[#003B4C]/20 text-[#003B4C]' 
                    : 'bg-white/20 text-white group-hover:bg-white/30 group-hover:scale-110'
                }`}>
                  <Icon size={18} />
                </div>
                {label}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-6 py-6 shadow-lg flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <Menu size={20} className="text-white" />
          </button>
          
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Landlord Dashboard</h1>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="text-sm text-white/90 font-medium px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              Welcome, Landlord
            </div>
          </div>
          
          {/* Logout Button */}
          <LogoutButton 
            variant="outline" 
            size="sm"
            className="border-white/60 text-white hover:bg-white hover:text-[#003B4C] hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-md rounded-xl"
          />
        </header>

        {/* Scrollable Main Content */}
        <main className="overflow-y-auto p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#003B4C] mb-2 capitalize">
              {activeTab}
            </h2>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandlordDashboard;
