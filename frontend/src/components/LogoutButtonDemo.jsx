import React from 'react';
import LogoutButton from './LogoutButton';

const LogoutButtonDemo = () => {
  const handleCustomLogout = () => {
    console.log('Custom logout logic executed!');
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">LogoutButton Component Demo</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Default Logout Button</h3>
          <LogoutButton />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Different Sizes</h3>
          <div className="flex items-center gap-4">
            <LogoutButton size="sm" />
            <LogoutButton size="md" />
            <LogoutButton size="lg" />
            <LogoutButton size="xl" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Different Variants</h3>
          <div className="flex items-center gap-4">
            <LogoutButton variant="default" />
            <LogoutButton variant="outline" />
            <LogoutButton variant="ghost" />
            <LogoutButton variant="danger" />
            <LogoutButton variant="subtle" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Custom Styling</h3>
          <LogoutButton 
            className="bg-purple-600 hover:bg-purple-700 text-white border-0"
            size="lg"
          >
            Custom Purple Logout
          </LogoutButton>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">With Custom Callback</h3>
          <LogoutButton 
            variant="outline"
            onLogout={handleCustomLogout}
          >
            Logout with Callback
          </LogoutButton>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Custom Text</h3>
          <LogoutButton variant="ghost">
            Sign Out
          </LogoutButton>
        </div>
      </div>
    </div>
  );
};

export default LogoutButtonDemo;
