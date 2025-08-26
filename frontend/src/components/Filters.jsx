import React from 'react';
import { Search, Filter, MapPin, DollarSign, Home } from 'lucide-react';
import { Input, Button } from './ui';
import { ALL_PROPERTY_TYPES, PROPERTY_CATEGORIES } from '../utils/propertyTypes';

const Filters = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const locations = [
    'All Locations',
    'Nairobi',
    'Kilimani',
    'Westlands',
    'Ngong',
    'Kasarani',
    'Rwaka',
    'Lavington',
    'Karen',
    'Muthaiga'
  ];

  const priceRanges = [
    'All Prices',
    'Under 30K',
    '30K - 50K',
    '50K - 80K',
    '80K - 120K',
    'Over 120K'
  ];

  const propertyTypes = [
    'All Types',
    ...ALL_PROPERTY_TYPES
  ];

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by location or keyword..."
              value={searchQuery}
              onChange={onSearchChange}
              className="pl-10 pr-4 py-3 w-full text-base border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-xl"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3 flex-1">
            {/* Location Filter */}
            <div className="relative min-w-[140px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="pl-10 pr-8 py-2.5 w-full text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500 bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors duration-200"
              >
                {locations.map((location) => (
                  <option key={location} value={location === 'All Locations' ? '' : location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="relative min-w-[140px]">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filters.priceRange}
                onChange={(e) => onFilterChange('priceRange', e.target.value)}
                className="pl-10 pr-8 py-2.5 w-full text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500 bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors duration-200"
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range === 'All Prices' ? '' : range}>
                    {range}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="relative min-w-[140px]">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filters.propertyType}
                onChange={(e) => onFilterChange('propertyType', e.target.value)}
                className="pl-10 pr-8 py-2.5 w-full text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500 bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors duration-200"
              >
                <option value="">All Types</option>
                {PROPERTY_CATEGORIES.map((category) => (
                  <optgroup key={category.name} label={`${category.icon} ${category.name}`}>
                    {category.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Active Filters Display */}
        {(filters.location || filters.priceRange || filters.propertyType) && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                📍 {filters.location}
                <button
                  onClick={() => onFilterChange('location', '')}
                  className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                💰 {filters.priceRange}
                <button
                  onClick={() => onFilterChange('priceRange', '')}
                  className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {filters.propertyType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                🏠 {filters.propertyType}
                <button
                  onClick={() => onFilterChange('propertyType', '')}
                  className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
