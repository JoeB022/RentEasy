import React, { useState } from 'react';
import {
  Building,
  Users,
  CreditCard,
  Wrench,
  UserCircle
} from 'lucide-react';
import PropertyManager from '../components/PropertyManager'; // ✅ Make sure path is correct

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { label: 'Properties', value: 'properties', icon: <Building size={16} /> },
    { label: 'Tenants', value: 'tenants', icon: <Users size={16} /> },
    { label: 'Payments', value: 'payments', icon: <CreditCard size={16} /> },
    { label: 'Services', value: 'services', icon: <Wrench size={16} /> },
    { label: 'Profile', value: 'profile', icon: <UserCircle size={16} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertyManager />; // ✅ Actual component used
      case 'tenants':
        return <div>Tenants by House/Room Placeholder</div>;
      case 'payments':
        return <div>Real-Time Rent Payment Status Placeholder</div>;
      case 'services':
        return <div>Service Add-ons Management Placeholder</div>;
      case 'profile':
        return <div>Landlord Profile Management Placeholder</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#003B4C] text-white h-screen p-6">
        <h2 className="text-xl font-bold mb-6">Landlord Dashboard</h2>
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-md text-sm mb-2 transition ${
              activeTab === tab.value
                ? 'bg-[#007C99] text-white'
                : 'hover:bg-[#004958]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default LandlordDashboard;
