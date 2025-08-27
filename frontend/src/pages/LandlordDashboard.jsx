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
        fixed top-0 left-0 h-full w-64 bg-[#003B4C] text-white z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[#005A6E]">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-[#005A6E] rounded-md transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        <div className="px-4 py-6 space-y-3">
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition font-medium w-full ${
                activeTab === value
                  ? 'bg-white text-[#003B4C]'
                  : 'text-white hover:bg-[#005A6E]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                {label}
              </div>
            </button>
          ))}
          
          {/* Logout Button in Mobile Sidebar */}
          <div className="pt-4 border-t border-[#005A6E]">
            <LogoutButton 
              variant="outline" 
              size="sm"
              className="w-full border-white text-white hover:bg-white hover:text-[#003B4C]"
            />
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#003B4C] text-white fixed h-full z-30 shadow-lg">
        <div className="px-4 py-6 space-y-3">
          <h2 className="text-lg font-semibold text-white mb-4">Landlord Dashboard</h2>
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition font-medium ${
                activeTab === value
                  ? 'bg-white text-[#003B4C]'
                  : 'text-white hover:bg-[#005A6E]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                {label}
              </div>
            </button>
          ))}
          
          {/* Logout Button in Desktop Sidebar */}
          <div className="pt-4 border-t border-[#005A6E]">
            <LogoutButton 
              variant="outline" 
              size="sm"
              className="w-full border-white text-white hover:bg-white hover:text-[#003B4C]"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-[#003B4C] text-white px-6 py-4 shadow flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-[#005A6E] rounded-md transition-colors"
          >
            <Menu size={20} className="text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Landlord Dashboard</h1>
            <div className="text-sm opacity-90">Welcome, Landlord</div>
          </div>
          
          {/* Logout Button */}
          <LogoutButton 
            variant="outline" 
            size="sm"
            className="border-white text-white hover:bg-white hover:text-[#003B4C]"
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
