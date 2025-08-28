import React from 'react';

const TestButtons = () => {
  const handleClick = (buttonName) => {
    console.log(`${buttonName} button clicked!`);
    alert(`${buttonName} button clicked!`);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Button Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => handleClick('Basic')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Basic Button
        </button>
        
        <button
          onClick={() => alert('Inline function works!')}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Inline Function
        </button>
        
        <button
          onClick={handleClick}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
        >
          Function Reference
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        Check console for click logs
      </div>
    </div>
  );
};

export default TestButtons;
