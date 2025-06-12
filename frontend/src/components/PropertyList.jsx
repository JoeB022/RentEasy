import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PropertyList = ({ onBook }) => {
  const [filter, setFilter] = useState({ location: '', price: '', available: true });

  const properties = [
    {
      id: 1,
      name: '2 Bedroom Apartment',
      location: 'Nairobi',
      price: 45000,
      image: 'https://i.pinimg.com/736x/ac/5f/08/ac5f0881bbaff0ba37d10f4a711dca3a.jpg',
      available: true,
      amenities: ['Wi-Fi', 'Parking', 'Balcony'],
    },
    {
      id: 2,
      name: '1 Bedroom Studio',
      location: 'Kilimani',
      price: 30000,
      image: 'https://i.pinimg.com/736x/d5/61/d3/d561d3aebc2d7db4098851c2c61f01ac.jpg',
      available: true,
      amenities: ['Wi-Fi', 'Water Included'],
    },
    {
      id: 3,
      name: '3 Bedroom House',
      location: 'Westlands',
      price: 70000,
      image: 'https://i.pinimg.com/736x/f0/ac/91/f0ac91b9c88b7376d913a427ce749825.jpg',
      available: true,
      amenities: ['Wi-Fi', 'Garden', 'Garage'],
    },
    {
      id: 4,
      name: '4 Bedroom Mansion',
      location: 'Ngong',
      price: 85000,
      image: 'https://i.pinimg.com/736x/95/0d/f5/950df56507ba44d737bcbcc2a81819fe.jpg',
      available: true,
      amenities: ['Wi-Fi', 'Garden', 'Garage'],
    },
    {
      id: 6,
      name: '2 Bedroom Apartment',
      location: 'Kasarani',
      price: 60000,
      image: 'https://i.pinimg.com/736x/64/3b/5f/643b5fbdcbf9decd41e743ba0f1ba60d.jpg',
      available: true,
      amenities: ['Fully furnished', 'Wi-Fi', 'Parking', 'Balcony'],
    },
    {
      id: 5,
      name: '3 Bedroom Apartment',
      location: 'Rwaka',
      price: 64000,
      image: 'https://i.pinimg.com/736x/39/10/52/391052f247cbb55bf81762ef11f39143.jpg',
      available: true,
      amenities: ['Wi-Fi', 'Parking', 'Balcony'],
    },
  ];

  const filtered = properties.filter((p) => {
    const matchLocation = p.location.toLowerCase().includes(filter.location.toLowerCase());
    const matchPrice = !filter.price || p.price <= parseInt(filter.price);
    const matchAvailable = filter.available ? p.available : true;
    return matchLocation && matchPrice && matchAvailable;
  });

  const handleExpressInterest = (property) => {
    toast.success(`📨 Interest sent for ${property.name} in ${property.location}`);
    if (onBook) onBook(property);
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Available Properties</h2>

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

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => (
          <div key={property.id} className="bg-[#f9fafb] rounded-lg shadow-md p-4">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-bold">{property.name}</h3>
            <p className="text-sm text-gray-500">{property.location}</p>
            <p className="text-sm text-gray-700">
              Ksh {property.price.toLocaleString()}
            </p>
            <ul className="text-xs mt-2 text-gray-500">
              {property.amenities.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
            <button
              className="mt-3 w-full bg-[#003B4C] text-white py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => handleExpressInterest(property)}
            >
              Express Interest
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 col-span-full">
            No properties found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
