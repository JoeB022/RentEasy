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
import { LogoutButton } from '../components/common';
import toast from 'react-hot-toast';

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

  const handleBookProperty = async (property) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('❌ Please log in to book properties');
        return;
      }

      // Check if user role is tenant
      const userRole = localStorage.getItem('user_role');
      if (userRole !== 'tenant') {
        toast.error('❌ Only tenants can book properties');
        return;
      }

      console.log('Creating booking for property:', property.id);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      console.log('User role:', userRole);

      // Create booking through API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: property.id,
          message: `Interested in ${property.name}`
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Booking successful:', data);
        toast.success('✅ Property booked successfully!');
        
        // Refresh bookings from API
        fetchBookings();
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData);
        toast.error(`❌ ${errorData.error || 'Failed to book property'}`);
      }
    } catch (error) {
      console.error('Error booking property:', error);
      toast.error('❌ Failed to book property');
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No token found, skipping booking fetch');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Fetching bookings, response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Bookings data received:', data);
        
        // Transform API data to match the expected format
        const transformedBookings = data.bookings.map(booking => ({
          id: booking.id,
          property: `${booking.property.name}, ${booking.property.location}`,
          date: new Date(booking.created_at).toISOString().split('T')[0],
          status: booking.status,
          message: booking.message,
          landlord_response: booking.landlord_response
        }));
        
        console.log('Transformed bookings:', transformedBookings);
        setBookings(transformedBookings);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch bookings:', errorData);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch bookings when component mounts
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      fetchBookings();
    }
  }, []);

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
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#003B4C] to-[#005A6E] text-white z-50 transform transition-all duration-500 ease-in-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <Typography.Heading level={4} className="text-white font-bold">Menu</Typography.Heading>
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
            <Typography.Heading level={4} className="text-white font-bold mb-2">Tenant Dashboard</Typography.Heading>
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
          
          {/* Logout Button in Desktop Sidebar */}
          <div className="pt-6 border-t border-white/20">
            <LogoutButton 
              variant="outline" 
              size="sm"
              className="w-full border-white/40 text-white hover:bg-white hover:text-[#003B4C] hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-md rounded-xl"
            />
          </div>
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
              <Typography.Heading level={3} className="text-white font-bold mb-1">Tenant Dashboard</Typography.Heading>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <Typography.BodyText className="text-white/90 font-medium px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              Welcome, {getUsername() || 'Tenant'} ({getUserRole() || 'tenant'})
            </Typography.BodyText>
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
