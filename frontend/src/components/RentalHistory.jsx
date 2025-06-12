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
      <h2 className="text-2xl font-bold text-[#003B4C] mb-4">Rental History</h2>

      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead>
            <tr className="bg-[#E6F8FA] text-[#003B4C] text-sm">
              <th className="px-6 py-3 font-medium">Property</th>
              <th className="px-6 py-3 font-medium">From</th>
              <th className="px-6 py-3 font-medium">To</th>
              <th className="px-6 py-3 font-medium">Amount (Ksh)</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rentals.length > 0 ? (
              rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{rental.property}</td>
                  <td className="px-6 py-4">{rental.from}</td>
                  <td className="px-6 py-4">{rental.to}</td>
                  <td className="px-6 py-4">
                    {rental.amount.toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${statusColor[rental.status]}`}
                  >
                    {rental.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
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
