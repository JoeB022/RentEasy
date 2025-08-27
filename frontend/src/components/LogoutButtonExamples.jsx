import React from 'react';
import { LogoutButton } from './common'; // Using the common index
// Alternative imports:
// import { LogoutButton } from './index'; // Using the main index
// import LogoutButton from './LogoutButton'; // Direct import

const LogoutButtonExamples = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">LogoutButton Usage Examples</h1>
      
      {/* Example 1: Navbar */}
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">1. Navbar Example</h2>
        <nav className="flex justify-between items-center p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold text-gray-800">RentEasy</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, User!</span>
            <LogoutButton variant="outline" size="sm" />
          </div>
        </nav>
      </section>

      {/* Example 2: Dashboard Header */}
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">2. Dashboard Header Example</h2>
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <p className="text-blue-100">Manage your properties</p>
            </div>
            <LogoutButton 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white hover:text-blue-600"
            >
              Sign Out
            </LogoutButton>
          </div>
        </header>
      </section>

      {/* Example 3: User Menu */}
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">3. User Menu Example</h2>
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">john@example.com</p>
              </div>
            </div>
            <LogoutButton variant="subtle" size="sm" />
          </div>
        </div>
      </section>

      {/* Example 4: Settings Page */}
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">4. Settings Page Example</h2>
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Account Settings</h3>
            <LogoutButton variant="danger" size="md" />
          </div>
          <p className="text-gray-600 mb-4">
            Manage your account preferences and settings here.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="notifications" className="rounded" />
              <label htmlFor="notifications">Email notifications</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sms" className="rounded" />
              <label htmlFor="sms">SMS notifications</label>
            </div>
          </div>
        </div>
      </section>

      {/* Example 5: Mobile Responsive */}
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">5. Mobile Responsive Example</h2>
        <div className="bg-gray-900 text-white p-4 rounded">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Mobile App</h3>
              <p className="text-gray-400 text-sm">Responsive design</p>
            </div>
            <div className="flex gap-2">
              <LogoutButton 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Logout
              </LogoutButton>
            </div>
          </div>
        </div>
      </section>

      {/* Import Instructions */}
      <section className="border rounded-lg p-4 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">📚 Import Instructions</h2>
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold text-blue-800">Option 1: Using Common Index (Recommended)</h3>
            <code className="block bg-blue-100 p-2 rounded mt-1">
              import { LogoutButton } from '@/components/common';
            </code>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-800">Option 2: Using Main Index</h3>
            <code className="block bg-blue-100 p-2 rounded mt-1">
              import { LogoutButton } from '@/components';
            </code>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-800">Option 3: Direct Import</h3>
            <code className="block bg-blue-100 p-2 rounded mt-1">
              import LogoutButton from '@/components/LogoutButton';
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogoutButtonExamples;
