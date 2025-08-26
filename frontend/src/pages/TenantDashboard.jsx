import React, { useState, useEffect } from 'react';
import PropertyList from '../components/PropertyList';
import BookingStatus from '../components/BookingStatus';
import RentalHistory from '../components/RentalHistory';
import Services from '../components/Services';
import TenantProfile from '../components/TenantProfile';
import InteriorDesign from '../components/InteriorDesign';
import { Home, CalendarCheck, ClipboardList, Wrench, User, Menu, X, Palette } from 'lucide-react';
import useAuthFetch from '../hooks/useAuthFetch';
import { getUsername, getUserRole } from '../utils/auth';
import { Typography } from '../components/ui';

const TenantDashboard = () => {
  console.log('TenantDashboard: Component rendering');
  
  const [activeTab, setActiveTab] = useState('property');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { get } = useAuthFetch();
  
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

  // Example of using useAuthFetch hook with automatic token refresh
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // In development mode with DEV_BYPASS, skip API calls
        if (import.meta.env.DEV) {
          console.log('Development mode: Skipping API call for demo purposes');
          setLoading(false);
          return;
        }
        
        // This will automatically handle token refresh if needed
        const response = await get(`${import.meta.env.VITE_API_URL}/user/profile/`);
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // In development mode, don't crash the app
        if (import.meta.env.DEV) {
          console.log('Development mode: Continuing without user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [get]);

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
      case 'interior-design':
        return <InteriorDesign />;
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
    { label: 'Interior Design', value: 'interior-design', icon: Palette },
  ];

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
        fixed top-0 left-0 h-full w-64 bg-primary-500 text-white z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex items-center justify-between p-4 border-b border-primary-400">
          <Typography.Heading level={4} className="text-white">Menu</Typography.Heading>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-primary-400 rounded-md transition-colors"
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
                  ? 'bg-white text-primary-500'
                  : 'text-white hover:bg-white hover:text-primary-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                {label}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary-500 text-white fixed h-full z-30 shadow-lg">
        <div className="px-4 py-6 space-y-3">
          <Typography.Heading level={4} className="text-white mb-4">Tenant Dashboard</Typography.Heading>
          {tabs.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition font-medium ${
                activeTab === value
                  ? 'bg-white text-primary-500'
                  : 'text-white hover:bg-white hover:text-primary-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                {label}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-primary-500 text-white px-6 py-4 shadow flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-primary-400 rounded-md transition-colors"
          >
            <Menu size={20} className="text-white" />
          </button>
          
          <Typography.Heading level={3} className="text-white">Tenant Dashboard</Typography.Heading>
          <Typography.BodyText className="text-white opacity-90">
            Welcome, {getUsername() || 'Tenant'} ({getUserRole() || 'tenant'})
          </Typography.BodyText>
        </header>

        {/* Scrollable Main Content */}
        <main className="overflow-y-auto p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <Typography.Heading level={4} className="mb-2 capitalize">
              {activeTab.replace('-', ' ')}
            </Typography.Heading>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
