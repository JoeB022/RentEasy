import React, { useState } from 'react';
import PropertyList from '../components/PropertyList';
import BookingStatus from '../components/BookingStatus';
import RentalHistory from '../components/RentalHistory';
import Services from '../components/Services';
import TenantProfile from '../components/TenantProfile';
import { Home, CalendarCheck, ClipboardList, Wrench, User } from 'lucide-react';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('property');
  const [bookings, setBookings] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([
    {
      id: 1,
      property: '2 Bedroom Apartment, Nairobi',
      from: '2024-02-01',
      to: '2025-01-31',
      amount: 540000,
      status: 'Completed',
    },
    {
      id: 2,
      property: '1 Bedroom Studio, Kilimani',
      from: '2023-01-01',
      to: '2023-12-31',
      amount: 360000,
      status: 'Completed',
    },
  ]);

  const handleBookProperty = (property) => {
    const today = new Date().toISOString().split('T')[0];
    const rental = {
      id: Date.now(),
      property: `${property.name}, ${property.location}`,
      from: today,
      to: '2025-12-31',
      amount: property.price * 12,
      status: 'Ongoing',
    };
    const booking = {
      id: Date.now(),
      property: `${property.name}, ${property.location}`,
      date: today,
      status: 'Pending',
    };

    setBookings(prev => [booking, ...prev]);
    setRentalHistory(prev => [rental, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <TenantProfile />;
      case 'property':
        return <PropertyList onBook={handleBookProperty} />;
      case 'booking':
        return <BookingStatus bookings={bookings} setBookings={setBookings} />;
      case 'rental':
        return <RentalHistory rentals={rentalHistory} />;
      case 'services':
        return <Services />;
      default:
        return <PropertyList onBook={handleBookProperty} />;
    }
  };

  const tabs = [
    { label: 'My Profile', value: 'profile', icon: User },
    { label: 'Property Listings', value: 'property', icon: Home },
    { label: 'Booking Status', value: 'booking', icon: CalendarCheck },
    { label: 'Rental History', value: 'rental', icon: ClipboardList },
    { label: 'Services', value: 'services', icon: Wrench },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-[#003B4C] text-white px-6 py-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">Tenant Dashboard</h1>
        <div className="text-sm opacity-90">Welcome, Tenant</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[#003B4C] text-white px-4 py-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Tenant Dashboard</h2>
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition font-medium ${
                activeTab === value
                  ? 'bg-white text-[#003B4C]'
                  : 'text-white hover:bg-white hover:text-[#003B4C]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                {label}
              </div>
            </button>
          ))}
        </aside>

        {/* Mobile Dropdown */}
        <div className="md:hidden w-full bg-white shadow sticky top-0 z-20 px-4 py-3 border-b border-gray-200">
          <select
            onChange={(e) => setActiveTab(e.target.value)}
            value={activeTab}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            {tabs.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#003B4C] mb-2 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
