import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserCog,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Mail,
  ClipboardList,
  Home,
} from 'lucide-react';

import ListingApprovals from '../components/ListApprovals';
import ManageUsers from '../components/ManageUsers';
import AdminAnalytics from '../components/AdminAnalytics';
import AbuseReports from '../components/AbuseReports';
import ServiceRatesEditor from '../components/ServiceRatesEditor';
import AllUsers from '../components/AllUsers';
import LogsAndFeedback from '../components/LogsAndFeedback';
import AdminApprovalPanel from '../components/AdminApprovalPanel';

// Dummy logs and feedback data
const initialEntries = [
  { id: 1, type: 'log', message: 'Admin logged in from new device', date: '2025-06-10', read: false },
  { id: 2, type: 'feedback', message: 'Great platform, but search is slow sometimes.', date: '2025-06-11', read: false },
  { id: 3, type: 'log', message: 'Service rates updated by admin', date: '2025-06-12', read: true },
  { id: 4, type: 'feedback', message: 'Please add more cleaning options for tenants.', date: '2025-06-13', read: false },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Listings');
  const [entries, setEntries] = useState(initialEntries);

  const unreadFeedback = entries.filter(e => e.type === 'feedback' && !e.read).length;
  const unreadLogs = entries.filter(e => e.type === 'log' && !e.read).length;

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#003B4C] text-white px-6 py-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="text-sm opacity-90">Welcome, Admin</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#003B4C] text-white hidden md:flex flex-col px-4 py-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Admin Dashboard</h2>
          {adminSections.map(({ name, icon: Icon, badge }) => (
            <button
              key={name}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition font-medium ${
                activeSection === name
                  ? 'bg-white text-[#003B4C]'
                  : 'text-white hover:bg-[#005A6E]'
              }`}
              onClick={() => setActiveSection(name)}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                {name}
              </div>
              {badge && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
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
                    👥 View and manage tenants and landlords.
                  </p>
                  <ManageUsers />
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
