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
    const saved = localStorage.getItem('serviceBookings');
    if (saved) setBookingHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('serviceBookings', JSON.stringify(bookingHistory));
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
      setBookingHistory(prev => [...prev, booking]);
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
      <h2 className="text-2xl font-bold text-[#003B4C] mb-4">Available Services</h2>

      {bookedService && (
        <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md">
          You have booked <strong>{bookedService.name}</strong> on <strong>{bookedService.date}</strong> at <strong>{bookedService.time}</strong>.
        </div>
      )}

      {(showForm || reschedulingId) && formService && (
        <div className="bg-white border border-gray-300 rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-bold mb-2">
            {reschedulingId ? 'Reschedule' : 'Book'} {formService.name}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleConfirmBooking(formService)} className="bg-[#003B4C] text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Confirm
            </button>
            <button onClick={() => { setShowForm(null); setReschedulingId(null); }} className="text-sm text-gray-500 hover:text-red-500">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-bold text-[#003B4C]">{service.name}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-2">{service.description}</p>
            <p className="text-sm font-medium text-gray-800">Ksh {service.price.toLocaleString()}</p>
            <button onClick={() => handleBookClick(service.id)} className="mt-4 w-full bg-[#003B4C] text-white py-2 rounded-md hover:bg-blue-700 transition">
              Book Now
            </button>
          </div>
        ))}
      </div>

      {bookingHistory.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-[#003B4C] mb-4">My Booked Services</h3>
          <div className="flex gap-3 mb-4">
            {['All', 'Booked', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1 rounded-full text-sm border transition ${
                  statusFilter === status
                    ? 'bg-[#003B4C] text-white border-[#003B4C]'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-[#E6F8FA] text-[#003B4C] text-left">
                  <th className="px-6 py-3 font-semibold">Service</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Time</th>
                  <th className="px-6 py-3 font-semibold">Cost</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">{entry.name}</td>
                    <td className="px-6 py-4">{entry.date}</td>
                    <td className="px-6 py-4">{entry.time}</td>
                    <td className="px-6 py-4">Ksh {entry.price.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${entry.status === 'Booked' ? 'bg-yellow-100 text-yellow-700' : entry.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 flex flex-wrap items-center">
                      {entry.status === 'Booked' ? (
                        <>
                          <button onClick={() => handleStatusChange(entry.id, 'Completed')} className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium hover:bg-green-200 transition">
                            <CheckCircle size={14} /> Complete
                          </button>
                          <button onClick={() => handleReschedule(entry)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium hover:bg-blue-200 transition">
                            <Calendar size={14} /> Reschedule
                          </button>
                          <button onClick={() => handleStatusChange(entry.id, 'Cancelled')} className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition">
                            <XCircle size={14} /> Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleDelete(entry.id)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium hover:bg-red-100 hover:text-red-600 transition">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
            <h4 className="text-lg font-semibold mb-4">Are you sure?</h4>
            <div className="flex justify-center gap-4">
              <button onClick={() => { confirmAction(); }} className="bg-red-600 text-white px-4 py-1 rounded-md">
                Yes
              </button>
              <button onClick={() => setConfirmAction(null)} className="text-gray-600 border px-4 py-1 rounded-md">
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
