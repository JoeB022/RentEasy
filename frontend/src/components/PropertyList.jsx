import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Transition } from '@headlessui/react';

const PropertyList = ({ onBook }) => {
  const [filter, setFilter] = useState({ location: '', price: '' });
  const [view, setView] = useState('all'); // all | available | occupied
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // track per property

  const properties = [
    {
      id: 1,
      name: '2 Bedroom Apartment',
      location: 'Nairobi',
      price: 45000,
      images: [
        'https://i.pinimg.com/736x/7e/33/2c/7e332c464daacb0ccf6b815a2ae48f52.jpg',
        'https://i.pinimg.com/736x/bf/dc/99/bfdc994f338254356bcffe0dba331043.jpg',
        'https://i.pinimg.com/736x/95/3f/a5/953fa5c3b7d08fd3056d75d59bdc6701.jpg',
        'https://i.pinimg.com/736x/4d/74/91/4d749135ff9d06382ddab8be8df24ab9.jpg',
      ],
      available: true,
      amenities: ['Wi-Fi', 'Parking', 'Balcony'],
    },
    {
      id: 2,
      name: '1 Bedroom Studio',
      location: 'Kilimani',
      price: 30000,
      images: [
        'https://i.pinimg.com/736x/ce/c5/cf/cec5cf7a64b78eaa5c024dd28596120c.jpg',
        'https://i.pinimg.com/736x/d5/61/d3/d561d3aebc2d7db4098851c2c61f01ac.jpg',
        'https://i.pinimg.com/736x/d8/86/23/d88623ae05e01bf83a51317eaec7d730.jpg',
        'https://i.pinimg.com/736x/c7/42/83/c742839462aafb24caf56eca82cf0b74.jpg',
      ],
      available: false,
      amenities: ['Wi-Fi', 'Water Included'],
    },
    {
      id: 3,
      name: '3 Bedroom House',
      location: 'Westlands',
      price: 70000,
      images: [
        'https://i.pinimg.com/736x/f0/ac/91/f0ac91b9c88b7376d913a427ce749825.jpg',
        'https://i.pinimg.com/736x/d7/fa/14/d7fa14163f07e93d3e311b6a91b00d07.jpg',
        'https://i.pinimg.com/736x/14/ed/ad/14edadd2ea8e21289d68202061d36551.jpg',
        'https://i.pinimg.com/736x/bd/8a/36/bd8a365f185433b1623946d97e347ca7.jpg',
      ],
      available: true,
      amenities: ['Wi-Fi', 'Garden', 'Garage'],
    },
    {
      id: 4,
      name: '4 Bedroom Mansion',
      location: 'Ngong',
      price: 85000,
      images: [
        'https://i.pinimg.com/736x/95/0d/f5/950df56507ba44d737bcbcc2a81819fe.jpg',
        'https://i.pinimg.com/736x/b8/8e/9e/b88e9e285fe604366acbccb49f65ad7c.jpg',
        'https://i.pinimg.com/736x/13/45/c7/1345c7ab56a190908323de42444cbac5.jpg',
        'https://i.pinimg.com/736x/0d/e4/52/0de4527e9ecd53b286c3359b9ef06003.jpg',
      ],
      available: false,
      amenities: ['Wi-Fi', 'Garden', 'Garage'],
    },
    {
      id: 5,
      name: '2 Bedroom Apartment',
      location: 'Kasarani',
      price: 60000,
      images: [
        'https://i.pinimg.com/736x/64/3b/5f/643b5fbdcbf9decd41e743ba0f1ba60d.jpg',
        'https://i.pinimg.com/736x/d5/97/9e/d5979ef2d75d75079cd7098713db9c5e.jpg',
        'https://i.pinimg.com/736x/71/d1/42/71d142cd08c73e85bc1893429a66ba56.jpg',
        'https://i.pinimg.com/736x/1b/04/41/1b04414e2a29da8f5d9aa8b5ea738ea7.jpg',
      ],
      available: true,
      amenities: ['Fully furnished', 'Wi-Fi', 'Parking', 'Balcony'],
    },
    {
      id: 6,
      name: '3 Bedroom Apartment',
      location: 'Rwaka',
      price: 64000,
      images: [
        'https://i.pinimg.com/736x/ef/a9/c1/efa9c18ac521f877f4eae4bb2b6df21e.jpg',
        'https://i.pinimg.com/736x/6b/2a/84/6b2a84fa2987ed1f9be0feb9f3ff685c.jpg',
        'https://i.pinimg.com/736x/36/ec/d4/36ecd46e886f097c7126306e264abd7b.jpg',
        'https://i.pinimg.com/736x/04/b9/11/04b9112c7c315412164720cb4e0ec592.jpg',
      ],
      available: true,
      amenities: ['Wi-Fi', 'Parking', 'Balcony'],
    },
  ];

  const handleExpressInterest = (property) => {
    toast.success(`📨 Interest sent for ${property.name} in ${property.location}`);
    if (onBook) onBook(property);
  };

  const filtered = properties.filter((p) => {
    const matchLocation = p.location.toLowerCase().includes(filter.location.toLowerCase());
    const matchPrice = !filter.price || p.price <= parseInt(filter.price);

    if (view === 'available') return p.available && matchLocation && matchPrice;
    if (view === 'occupied') return !p.available && matchLocation && matchPrice;
    return matchLocation && matchPrice;
  });

  const handleNext = (id, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] >= total - 1 ? 0 : (prev[id] || 0) + 1,
    }));
  };

  const handlePrev = (id, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] <= 0 ? total - 1 : (prev[id] || 0) - 1,
    }));
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Property Listings</h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {['all', 'available', 'occupied'].map((type) => (
          <button
            key={type}
            onClick={() => setView(type)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              view === type
                ? 'bg-[#003B4C] text-white border-[#003B4C]'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {type === 'all' ? 'All' : type === 'available' ? 'Available' : 'Occupied'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by location"
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          className="px-3 py-2 border rounded-md w-full sm:w-auto"
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => setFilter({ ...filter, price: e.target.value })}
          className="px-3 py-2 border rounded-md w-full sm:w-auto"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => {
          const index = currentImageIndex[property.id] || 0;
          const totalImages = property.images.length;

          return (
            <Transition
              key={property.id}
              appear
              show={true}
              enter="transition transform duration-500 ease-out"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
            >
              <div className="bg-white rounded-lg shadow-md p-4 relative">
                {/* Image with controls */}
                <div className="relative mb-4">
                  <img
                    src={property.images[index]}
                    alt={`${property.name} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={() => handlePrev(property.id, totalImages)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border shadow px-2 py-1 rounded-full text-sm"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => handleNext(property.id, totalImages)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border shadow px-2 py-1 rounded-full text-sm"
                      >
                        ▶
                      </button>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-bold">{property.name}</h3>
                <p className="text-sm text-gray-500">{property.location}</p>

                {/* Availability */}
                <div className="mt-2 mb-1">
                  <span
                    title={
                      property.available
                        ? 'This property is currently open for booking.'
                        : 'This property is currently unavailable.'
                    }
                    className={`inline-block px-3 py-1 text-xs rounded-full font-medium shadow-sm cursor-help ${
                      property.available
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                  >
                    {property.available ? 'Available' : 'Occupied'}
                  </span>
                </div>

                <p className="text-sm text-gray-700">Ksh {property.price.toLocaleString()}</p>

                <ul className="text-xs mt-2 text-gray-500">
                  {property.amenities.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>

                {property.available && (
                  <button
                    className="mt-3 w-full bg-[#003B4C] text-white py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={() => handleExpressInterest(property)}
                  >
                    Express Interest
                  </button>
                )}
              </div>
            </Transition>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
