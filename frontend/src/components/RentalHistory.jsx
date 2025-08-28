import React from 'react';

const RentalHistory = ({ rentals = [] }) => {
  const statusColor = {
    Completed: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
    Cancelled: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300',
    Ongoing: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300',
  };

  const statusIcon = {
    Completed: '✅',
    Cancelled: '❌',
    Ongoing: '⏳',
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Rental History</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Rental History Table */}
      <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-[#E6F8FA] to-[#F0FDFF] text-[#003B4C]">
                <th className="px-8 py-4 font-bold border-b border-white/50">Property</th>
                <th className="px-8 py-4 font-bold border-b border-white/50">From</th>
                <th className="px-8 py-4 font-bold border-b border-white/50">To</th>
                <th className="px-8 py-4 font-bold border-b border-white/50">Amount (Ksh)</th>
                <th className="px-8 py-4 font-bold border-b border-white/50">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {rentals.length > 0 ? (
                rentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#e5e7eb] transition-all duration-300 group">
                    <td className="px-8 py-6 font-medium text-[#003B4C] group-hover:text-[#007C99]">
                      {rental.property}
                    </td>
                    <td className="px-8 py-6 text-[#003B4C] group-hover:text-[#007C99]">
                      {rental.from}
                    </td>
                    <td className="px-8 py-6 text-[#003B4C] group-hover:text-[#007C99]">
                      {rental.to}
                    </td>
                    <td className="px-8 py-6 font-semibold text-[#003B4C] group-hover:text-[#007C99]">
                      {rental.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border shadow-md ${statusColor[rental.status]}`}>
                        {statusIcon[rental.status]}
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty State
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-4xl">🏠</span>
                      </div>
                      <h3 className="text-xl font-semibold text-[#003B4C] mb-3">
                        No rental history found
                      </h3>
                      <p className="text-[#007C99] font-medium">
                        You haven't completed any rentals yet. Start exploring properties to begin your rental journey!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalHistory;
