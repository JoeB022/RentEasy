import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UserCog,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Mail,
  ClipboardList,
  Home,
  Menu,
  X,
} from 'lucide-react';

import ListingApprovals from '../components/ListApprovals';
import ManageUsers from '../components/ManageUsers';
import PendingUserApprovals from '../components/PendingUserApprovals';
import AdminAnalytics from '../components/AdminAnalytics';
import AbuseReports from '../components/AbuseReports';
import ServiceRatesEditor from '../components/ServiceRatesEditor';
import AllUsers from '../components/AllUsers';
import LogsAndFeedback from '../components/LogsAndFeedback';
import AdminApprovalPanel from '../components/AdminApprovalPanel';
import { LogoutButton } from '../components/common';

// Dummy logs and feedback data
const initialEntries = [
  { id: 1, type: 'log', message: 'Admin logged in from new device', date: '2025-06-10', read: false },
  { id: 2, type: 'feedback', message: 'Great platform, but search is slow sometimes.', date: '2025-06-11', read: false },
  { id: 3, type: 'log', message: 'Service rates updated by admin', date: '2025-06-12', read: true },
  { id: 4, type: 'feedback', message: 'Please add more cleaning options for tenants.', date: '2025-06-13', read: false },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Listings');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entries, setEntries] = useState(initialEntries);

  const unreadFeedback = entries.filter(e => e.type === 'feedback' && !e.read).length;
  const unreadLogs = entries.filter(e => e.type === 'log' && !e.read).length;

  // Sidebar toggle functions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Handle section change and close sidebar on mobile
  const handleSectionChange = (sectionName) => {
    setActiveSection(sectionName);
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

  const adminSections = [
    { name: 'Listings', icon: Home },
    { name: 'Users', icon: UserCog },
    { name: 'Analytics', icon: LayoutDashboard },
    { name: 'Abuse Reports', icon: AlertTriangle },
    { name: 'Service Rates', icon: DollarSign },
    { name: 'User Data', icon: ClipboardList },
    {
      name: 'Feedback',
      icon: Mail,
      badge: unreadFeedback + unreadLogs > 0
        ? unreadFeedback + unreadLogs
        : null,
    },
    { name: 'Bookings', icon: ShieldCheck }, // 🆕 New tab
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
          <h2 className="text-lg font-semibold text-white font-bold">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        <div className="px-6 py-8 space-y-4">
          {adminSections.map(({ name, icon: Icon, badge }) => (
            <button
              key={name}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium w-full group ${
                activeSection === name
                  ? 'bg-gradient-to-r from-white to-blue-50 text-[#003B4C] shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/20 hover:text-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5'
              }`}
              onClick={() => handleSectionChange(name)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeSection === name 
                    ? 'bg-[#003B4C]/20 text-[#003B4C]' 
                    : 'bg-white/20 text-white group-hover:bg-white/30 group-hover:scale-110'
                }`}>
                  <Icon size={18} />
                </div>
                {name}
              </div>
              {badge && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {badge}
                </span>
              )}
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
            <h2 className="text-lg font-semibold text-white font-bold mb-2">Admin Dashboard</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
          </div>
          
          {adminSections.map(({ name, icon: Icon, badge }) => (
            <button
              key={name}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium w-full group ${
                activeSection === name
                  ? 'bg-gradient-to-r from-white to-blue-50 text-[#003B4C] shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/20 hover:text-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5'
              }`}
              onClick={() => handleSectionChange(name)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeSection === name 
                    ? 'bg-[#003B4C]/20 text-[#003B4C]' 
                    : 'bg-white/20 text-white group-hover:bg-white/30 group-hover:scale-110'
                }`}>
                  <Icon size={18} />
                </div>
                {name}
              </div>
              {badge && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {badge}
                </span>
              )}
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
              <h1 className="text-xl font-bold text-white mb-1">Admin Dashboard</h1>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
            </div>
            <div className="text-sm text-white/90 font-medium px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              Welcome, Admin
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-[#003B4C] mb-2">{activeSection}</h2>

              {activeSection === 'Listings' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    📋 Approve or reject landlord listings.
                  </p>
                  <ListingApprovals />
                </>
              )}

              {activeSection === 'Users' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    👥 Approve pending user registrations and manage existing users.
                  </p>
                  <PendingUserApprovals />
                </>
              )}

              {activeSection === 'Analytics' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    📊 Overview of platform-wide metrics.
                  </p>
                  <AdminAnalytics />
                </>
              )}

              {activeSection === 'Abuse Reports' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    🚨 Monitor and take action on flagged or abusive content.
                  </p>
                  <AbuseReports />
                </>
              )}

              {activeSection === 'Service Rates' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    🧹 Update base service rates globally.
                  </p>
                  <ServiceRatesEditor />
                </>
              )}

              {activeSection === 'User Data' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    📁 Access full user data for review and filtering.
                  </p>
                  <AllUsers />
                </>
              )}

              {activeSection === 'Feedback' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    📬 Read feedback and view system logs.
                  </p>
                  <LogsAndFeedback entries={entries} setEntries={setEntries} />
                </>
              )}

              {activeSection === 'Bookings' && (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    ✅ View and approve tenant property bookings.
                  </p>
                  <AdminApprovalPanel />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
