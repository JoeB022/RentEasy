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
import {
  TrendingUp,
  Users,
  Home,
  DollarSign,
  Calendar,
  BarChart3,
} from 'lucide-react';

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
  },
  properties: {
    Jan: 45,
    Feb: 48,
    Mar: 52,
    Apr: 50,
    May: 55,
    Jun: 53,
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
        backgroundColor: 'rgba(0, 124, 153, 0.8)',
        borderColor: 'rgba(0, 124, 153, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(0, 124, 153, 1)',
        hoverBorderColor: 'rgba(0, 124, 153, 1)',
      },
    ],
  };

  const selectedTenants = dummyAnalytics.tenants[selectedMonth];
  const selectedOccupancy = dummyAnalytics.occupancy[selectedMonth];
  const selectedEarnings = dummyAnalytics.earnings[selectedMonth];
  const selectedProperties = dummyAnalytics.properties[selectedMonth];

  // Calculate growth percentages
  const getGrowthPercentage = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const previousMonth = months[Math.max(0, months.indexOf(selectedMonth) - 1)];
  const earningsGrowth = getGrowthPercentage(
    dummyAnalytics.earnings[selectedMonth], 
    dummyAnalytics.earnings[previousMonth]
  );
  const tenantsGrowth = getGrowthPercentage(
    dummyAnalytics.tenants[selectedMonth], 
    dummyAnalytics.tenants[previousMonth]
  );
  const occupancyGrowth = getGrowthPercentage(
    dummyAnalytics.occupancy[selectedMonth], 
    dummyAnalytics.occupancy[previousMonth]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Analytics Dashboard</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Month Selector */}
      <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#007C99]" />
            <label htmlFor="month" className="text-[#003B4C] font-medium">Select Month:</label>
          </div>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-green-600 font-medium mb-1">Active Tenants</h4>
              <p className="text-2xl font-bold text-green-800">{selectedTenants}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={`w-4 h-4 ${tenantsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-xs font-medium ${tenantsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tenantsGrowth >= 0 ? '+' : ''}{tenantsGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-blue-600 font-medium mb-1">Occupancy Rate</h4>
              <p className="text-2xl font-bold text-blue-800">{selectedOccupancy}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={`w-4 h-4 ${occupancyGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                <span className={`text-xs font-medium ${occupancyGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {occupancyGrowth >= 0 ? '+' : ''}{occupancyGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-yellow-600 font-medium mb-1">Monthly Earnings</h4>
              <p className="text-2xl font-bold text-yellow-800">KES {selectedEarnings.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={`w-4 h-4 ${earningsGrowth >= 0 ? 'text-yellow-600' : 'text-red-600'}`} />
                <span className={`text-xs font-medium ${earningsGrowth >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {earningsGrowth >= 0 ? '+' : ''}{earningsGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-purple-600 font-medium mb-1">Total Properties</h4>
              <p className="text-2xl font-bold text-purple-800">{selectedProperties}</p>
              <div className="text-xs text-purple-600 mt-1">
                Available for rent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-gradient-to-br from-white to-[#f8fafc] p-8 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#003B4C] mb-2">📊 Earnings Overview</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
        </div>
        <div className="h-80">
          <Bar 
            data={earningsData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    color: '#003B4C'
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 124, 153, 0.9)',
                  titleColor: '#ffffff',
                  bodyColor: '#ffffff',
                  borderColor: '#007C99',
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: false,
                  callbacks: {
                    label: function(context) {
                      return `KES ${context.parsed.y.toLocaleString()}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 124, 153, 0.1)',
                    borderColor: 'rgba(0, 124, 153, 0.3)'
                  },
                  ticks: {
                    color: '#003B4C',
                    font: {
                      weight: 'bold'
                    },
                    callback: function(value) {
                      return 'KES ' + value.toLocaleString();
                    }
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(0, 124, 153, 0.1)',
                    borderColor: 'rgba(0, 124, 153, 0.3)'
                  },
                  ticks: {
                    color: '#003B4C',
                    font: {
                      weight: 'bold'
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-[#003B4C]">Performance Insights</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
              <span className="text-[#003B4C] font-medium">Best Month</span>
              <span className="font-bold text-[#007C99]">May (KES 67,000)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
              <span className="text-[#003B4C] font-medium">Average Monthly</span>
              <span className="font-bold text-[#007C99]">KES 54,167</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
              <span className="text-[#003B4C] font-medium">Growth Trend</span>
              <span className="font-bold text-green-600">↗️ Positive</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-[#003B4C]">User Growth</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
              <span className="text-[#003B4C] font-medium">New Tenants</span>
              <span className="font-bold text-[#007C99]">+{selectedTenants - dummyAnalytics.tenants[previousMonth]}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
              <span className="text-[#003B4C] font-medium">Occupancy Increase</span>
              <span className="font-bold text-[#007C99]">+{selectedOccupancy - dummyAnalytics.occupancy[previousMonth]}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
              <span className="text-[#003B4C] font-medium">Revenue Growth</span>
              <span className="font-bold text-green-600">+{earningsGrowth}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
