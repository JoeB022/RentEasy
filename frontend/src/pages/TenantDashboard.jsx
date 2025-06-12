// pages/TenantDashboard.jsx
import React, { useState } from 'react';
import PropertyList from '../components/PropertyList';
import BookingStatus from '../components/BookingStatus';
import RentalHistory from '../components/RentalHistory';

// Optional: stubbed placeholders for upcoming sections
const Services = () => <div className="mb-10">[ Services Component ]</div>;
const TenantProfile = () => <div className="mb-10">[ Tenant Profile Component ]</div>;

const TenantDashboard = () => {
  const [bookings, setBookings] = useState([]);

  const handleExpressInterest = (property) => {
    const newBooking = {
      id: Date.now(),
      property: `${property.name}, ${property.location}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setBookings(prev => [...prev, newBooking]);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tenant Dashboard</h1>

      {/* Section: Property Listings */}
      <PropertyList onBook={handleExpressInterest} />

      {/* Section: Booking Status */}
      <BookingStatus bookings={bookings} setBookings={setBookings} />

      {/* Section: Rental History */}
      <RentalHistory />

      {/* Section: Third-Party Services */}
      <Services />

      {/* Section: Profile Management */}
      <TenantProfile />
    </div>
  );
};

export default TenantDashboard;
