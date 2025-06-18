// src/components/AdminAnalytics.jsx
import React, { useState } from 'react';
import {
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const dummyAnalytics = {
  earnings: {
    Jan: 42000,
    Feb: 50000,
    Mar: 61000,
    Apr: 46000,
    May: 67000,
    Jun: 59000,
  },
  tenants: {
    Jan: 120,
    Feb: 135,
    Mar: 160,
    Apr: 148,
    May: 180,
    Jun: 172,
  },
  occupancy: {
    Jan: 72,
    Feb: 78,
    Mar: 85,
    Apr: 80,
    May: 90,
    Jun: 88,
  }
};

const AdminAnalytics = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jun');

  const earningsData = {
    labels: Object.keys(dummyAnalytics.earnings),
    datasets: [
      {
        label: 'Monthly Earnings (KES)',
        data: Object.values(dummyAnalytics.earnings),
        backgroundColor: '#003B4C',
      },
    ],
  };

  const selectedTenants = dummyAnalytics.tenants[selectedMonth];
  const selectedOccupancy = dummyAnalytics.occupancy[selectedMonth];

  return (
    <div className="space-y-6 text-sm">
      {/* Month Selector */}
      <div className="flex items-center gap-3">
        <label htmlFor="month" className="text-gray-600">📅 Select Month:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-100 border border-green-300 text-green-900 px-4 py-3 rounded">
          <h4 className="text-lg font-bold">Active Tenants</h4>
          <p className="text-2xl">{selectedTenants}</p>
        </div>
        <div className="bg-blue-100 border border-blue-300 text-blue-900 px-4 py-3 rounded">
          <h4 className="text-lg font-bold">Occupancy Rate</h4>
          <p className="text-2xl">{selectedOccupancy}%</p>
        </div>
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-3 rounded">
          <h4 className="text-lg font-bold">Earnings</h4>
          <p className="text-2xl">KES {dummyAnalytics.earnings[selectedMonth].toLocaleString()}</p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white p-4 border rounded shadow">
        <h3 className="text-md font-bold mb-2">📊 Earnings Overview</h3>
        <Bar data={earningsData} />
      </div>
    </div>
  );
};

export default AdminAnalytics;
