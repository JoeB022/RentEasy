import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  Calendar,
  XCircle,
  Trash2,
} from 'lucide-react';

const Services = () => {
  const [bookedService, setBookedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showForm, setShowForm] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirmAction, setConfirmAction] = useState(null);

  const services = [
    { id: 1, name: 'Moving Assistance', description: 'Professional movers to help you relocate smoothly.', price: 3500 },
    { id: 2, name: 'Deep Cleaning', description: 'Thorough cleaning before or after you move.', price: 2000 },
    { id: 3, name: 'Home Repairs', description: 'Minor repairs handled by qualified technicians.', price: 1500 },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('tenant_service_bookings');
    console.log('Services: Loading from localStorage:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Services: Parsed data:', parsed);
        setBookingHistory(parsed);
      } catch (error) {
        console.error('Services: Error parsing localStorage data:', error);
        // Clear corrupted data
        localStorage.removeItem('tenant_service_bookings');
        setBookingHistory([]);
      }
    } else {
      console.log('Services: No saved data found in localStorage');
    }
    
    // Cleanup function
    return () => {
      console.log('Services: Component unmounting, current state:', bookingHistory);
    };
  }, []);

  useEffect(() => {
    console.log('Services: Saving to localStorage:', bookingHistory);
    localStorage.setItem('tenant_service_bookings', JSON.stringify(bookingHistory));
    console.log('Services: Data saved successfully');
  }, [bookingHistory]);

  const handleBookClick = (serviceId) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = String(now.getHours()).padStart(2, '0');
    const defaultTime = `${hour}:00`;

    setShowForm(serviceId);
    setReschedulingId(null);
    setSelectedDate(today);
    setSelectedTime(defaultTime);
  };

  const handleConfirmBooking = (service) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time.');
      return;
    }

    if (reschedulingId) {
      setBookingHistory(prev =>
        prev.map(b =>
          b.id === reschedulingId
            ? { ...b, date: selectedDate, time: selectedTime, status: 'Booked' }
            : b
        )
      );
      toast.success('Service rescheduled successfully.');
    } else {
      const booking = {
        id: Date.now(),
        name: service.name,
        price: service.price,
        date: selectedDate,
        time: selectedTime,
        status: 'Booked',
      };
      const updatedHistory = [...bookingHistory, booking];
      console.log('Services: Adding new booking:', booking);
      console.log('Services: Updated history:', updatedHistory);
      setBookingHistory(updatedHistory);
      setBookedService(booking);
      toast.success(`Booked ${service.name} on ${selectedDate} at ${selectedTime}`);
    }

    setShowForm(null);
    setReschedulingId(null);
    setTimeout(() => setBookedService(null), 5000);
  };

  const handleReschedule = (booking) => {
    setReschedulingId(booking.id);
    setSelectedDate(booking.date);
    setSelectedTime(booking.time);
    setShowForm(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setBookingHistory(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, status: newStatus } : entry
      )
    );
    toast.success(`Service marked as ${newStatus}`);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => {
      setBookingHistory(prev => prev.filter(entry => entry.id !== id));
      toast.success('Service deleted.');
      setConfirmAction(null);
    });
  };

  const getServiceByName = (name) => services.find(s => s.name === name) || { name, price: 0 };
  const formService = reschedulingId
    ? getServiceByName(bookingHistory.find(b => b.id === reschedulingId)?.name || '')
    : showForm
      ? services.find(s => s.id === showForm)
      : null;

  const filteredBookings = bookingHistory.filter((b) =>
    statusFilter === 'All' ? true : b.status === statusFilter
  );

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#003B4C] mb-2">Available Services</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
      </div>

      {/* Success Notification */}
      {bookedService && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 text-green-800 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
            <div>
              <p className="font-semibold">
                You have booked <strong>{bookedService.name}</strong> on <strong>{bookedService.date}</strong> at <strong>{bookedService.time}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form */}
      {(showForm || reschedulingId) && formService && (
        <div className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-[#007C99]/20 rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#003B4C] mb-2">
              {reschedulingId ? 'Reschedule' : 'Book'} {formService.name}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#003B4C] mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#007C99]/30 rounded-xl text-sm focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#003B4C] mb-2">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#007C99]/30 rounded-xl text-sm focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => handleConfirmBooking(formService)} 
              className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white px-6 py-3 rounded-xl font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Confirm
            </button>
            <button 
              onClick={() => { setShowForm(null); setReschedulingId(null); }} 
              className="px-6 py-3 border-2 border-[#007C99] text-[#007C99] rounded-xl font-medium hover:bg-[#007C99] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {services.map((service) => (
          <div key={service.id} className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-white/50 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#003B4C] mb-3 group-hover:text-[#007C99] transition-colors duration-300">{service.name}</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
            </div>
            <p className="text-sm text-[#007C99] mb-4 leading-relaxed">{service.description}</p>
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-[#003B4C] bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm">
                Ksh {service.price.toLocaleString()}
              </span>
            </div>
            <button 
              onClick={() => handleBookClick(service.id)} 
              className="w-full bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white py-3 rounded-xl font-medium hover:from-[#004A5F] hover:to-[#006B8A] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking History */}
      {bookingHistory.length > 0 && (
        <div className="mt-12">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-[#003B4C] mb-2">My Booked Services</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
          </div>
          
          {/* Status Filters */}
          <div className="bg-gradient-to-r from-white to-[#f8fafc] p-6 rounded-2xl shadow-lg border border-white/50 mb-8 backdrop-blur-sm">
            <div className="flex gap-3 flex-wrap items-center">
              {['All', 'Booked', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-[#003B4C] to-[#005A6E] text-white border-[#003B4C] shadow-lg'
                      : 'text-[#003B4C] border-[#007C99] hover:bg-gradient-r hover:from-[#007C99]/10 hover:to-[#0099B3]/10 hover:border-[#007C99] hover:shadow-md'
                  }`}
                >
                  {status}
                </button>
              ))}
              
              {/* Debug Button - Remove this later */}
              <button
                onClick={() => {
                  console.log('Services: Current bookingHistory state:', bookingHistory);
                  console.log('Services: localStorage data:', localStorage.getItem('tenant_service_bookings'));
                  console.log('Services: All localStorage keys:', Object.keys(localStorage));
                }}
                className="px-4 py-3 bg-gray-500 text-white rounded-xl text-sm font-medium hover:bg-gray-600 transition-all duration-300"
              >
                🐛 Debug
              </button>
              
              {/* Reload Button */}
              <button
                onClick={() => {
                  const saved = localStorage.getItem('tenant_service_bookings');
                  if (saved) {
                    try {
                      const parsed = JSON.parse(saved);
                      setBookingHistory(parsed);
                      toast.success('Data reloaded from localStorage');
                    } catch (error) {
                      toast.error('Failed to reload data');
                    }
                  } else {
                    toast.error('No saved data found');
                  }
                }}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all duration-300"
              >
                🔄 Reload
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E6F8FA] to-[#F0FDFF] text-[#003B4C]">
                    <th className="px-8 py-4 font-bold text-left border-b border-white/50">Service</th>
                    <th className="px-8 py-4 font-bold text-left border-b border-white/50">Date</th>
                    <th className="px-8 py-4 font-bold text-left border-b border-white/50">Time</th>
                    <th className="px-8 py-4 font-bold text-left border-b border-white/50">Cost</th>
                    <th className="px-8 py-4 font-bold text-left border-b border-white/50">Status</th>
                    <th className="px-8 py-4 font-bold text-left border-b border-white/50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/50">
                  {filteredBookings.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#e5e7eb] transition-all duration-300 group">
                      <td className="px-8 py-6 font-medium text-[#003B4C] group-hover:text-[#007C99]">{entry.name}</td>
                      <td className="px-8 py-6 text-[#003B4C] group-hover:text-[#007C99]">{entry.date}</td>
                      <td className="px-8 py-6 text-[#003B4C] group-hover:text-[#007C99]">{entry.time}</td>
                      <td className="px-8 py-6 font-semibold text-[#003B4C] group-hover:text-[#007C99]">Ksh {entry.price.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border shadow-md ${
                          entry.status === 'Booked' 
                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300' 
                            : entry.status === 'Completed' 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300' 
                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300'
                        }`}>
                          {entry.status === 'Booked' && '⏳'}
                          {entry.status === 'Completed' && '✅'}
                          {entry.status === 'Cancelled' && '❌'}
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2 flex-wrap items-center">
                          {entry.status === 'Booked' ? (
                            <>
                              <button 
                                onClick={() => handleStatusChange(entry.id, 'Completed')} 
                                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                              >
                                <CheckCircle size={14} /> Complete
                              </button>
                              <button 
                                onClick={() => handleReschedule(entry)} 
                                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                              >
                                <Calendar size={14} /> Reschedule
                              </button>
                              <button 
                                onClick={() => handleStatusChange(entry.id, 'Cancelled')} 
                                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                              >
                                <XCircle size={14} /> Cancel
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleDelete(entry.id)} 
                              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-medium hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-2xl p-8 w-[400px] text-center border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h4 className="text-xl font-bold text-[#003B4C] mb-4">Are you sure?</h4>
            <p className="text-[#007C99] mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => { confirmAction(); }} 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setConfirmAction(null)} 
                className="px-6 py-3 border-2 border-[#007C99] text-[#007C99] rounded-xl font-medium hover:bg-[#007C99] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
