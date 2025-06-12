import React from 'react';

const RentalHistory = () => {
  const rentals = [
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
    {
      id: 3,
      property: '3 Bedroom House, Westlands',
      from: '2022-01-01',
      to: '2022-06-30',
      amount: 420000,
      status: 'Cancelled',
    },
  ];

  const statusColor = {
    Completed: 'text-green-600',
    Cancelled: 'text-red-500',
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Rental History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2">Property</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Amount (Ksh)</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id} className="border-b">
                <td className="px-4 py-2">{rental.property}</td>
                <td className="px-4 py-2">{rental.from}</td>
                <td className="px-4 py-2">{rental.to}</td>
                <td className="px-4 py-2">{rental.amount.toLocaleString()}</td>
                <td className={`px-4 py-2 font-medium ${statusColor[rental.status]}`}>
                  {rental.status}
                </td>
              </tr>
            ))}
            {rentals.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No rental history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalHistory;
