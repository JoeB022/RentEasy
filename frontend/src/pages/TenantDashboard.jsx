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
    { label: 'My Profile', value: 'profile', icon: <User size={16} /> },
    { label: 'Property Listings', value: 'property', icon: <Home size={16} /> },
    { label: 'Booking Status', value: 'booking', icon: <CalendarCheck size={16} /> },
    { label: 'Rental History', value: 'rental', icon: <ClipboardList size={16} /> },
    { label: 'Services', value: 'services', icon: <Wrench size={16} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#003B4C] text-white sticky top-0 h-screen overflow-y-auto z-30">
        <div className="px-6 py-5 border-b border-[#005A6E]">
          <h1 className="text-xl font-bold">Tenant Dashboard</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
                activeTab === tab.value
                  ? 'bg-[#007C99] text-white'
                  : 'text-[#00A1B3] hover:bg-[#DFF6FA]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
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
      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default TenantDashboard;
