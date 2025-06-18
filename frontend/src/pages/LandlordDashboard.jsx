import React, { useState } from 'react';
import {
  Building,
  Users,
  CreditCard,
  Wrench,
  UserCircle,
} from 'lucide-react';

import PropertyManager from '../components/PropertyManager';
import TenantsByHouse from '../components/TenantsByHouse';
import RealTimePayments from '../components/RealTimePayment2';
import ApartmentServiceAddons from '../components/ApartmentServiceAddons';
import LandlordProfile from '../components/LandlordProfile';

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { label: 'Properties', value: 'properties', icon: Building },
    { label: 'Tenants', value: 'tenants', icon: Users },
    { label: 'Payments', value: 'payments', icon: CreditCard },
    { label: 'Services', value: 'services', icon: Wrench },
    { label: 'Profile', value: 'profile', icon: UserCircle },
  ];

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#003B4C] text-white px-6 py-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">Landlord Dashboard</h1>
        <div className="text-sm opacity-90">Welcome, Landlord</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#003B4C] text-white hidden md:flex flex-col px-4 py-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Landlord Dashboard</h2>
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
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
