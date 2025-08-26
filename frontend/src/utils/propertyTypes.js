// Property Types Configuration
// This file centralizes all property type definitions used across the app

export const PROPERTY_TYPES = {
  // Residential Properties
  RESIDENTIAL: {
    APARTMENT: 'Apartment',
    STUDIO: 'Studio',
    HOUSE: 'House',
    MANSION: 'Mansion',
    PENTHOUSE: 'Penthouse',
    TOWNHOUSE: 'Townhouse',
    BEDSITTER: 'Bedsitter',
    BUNGALOW: 'Bungalow',
    MAISONETTE: 'Maisonette',
    VILLA: 'Villa'
  },
  
  // Commercial Properties
  COMMERCIAL: {
    SHOP: 'Shop',
    OFFICE_SPACE: 'Office Space',
    WAREHOUSE: 'Warehouse',
    OTHER: 'Other'
  }
};

// Flat array of all property types for dropdowns
export const ALL_PROPERTY_TYPES = [
  // Residential
  PROPERTY_TYPES.RESIDENTIAL.APARTMENT,
  PROPERTY_TYPES.RESIDENTIAL.STUDIO,
  PROPERTY_TYPES.RESIDENTIAL.HOUSE,
  PROPERTY_TYPES.RESIDENTIAL.MANSION,
  PROPERTY_TYPES.RESIDENTIAL.PENTHOUSE,
  PROPERTY_TYPES.RESIDENTIAL.TOWNHOUSE,
  PROPERTY_TYPES.RESIDENTIAL.BEDSITTER,
  PROPERTY_TYPES.RESIDENTIAL.BUNGALOW,
  PROPERTY_TYPES.RESIDENTIAL.MAISONETTE,
  PROPERTY_TYPES.RESIDENTIAL.VILLA,
  
  // Commercial
  PROPERTY_TYPES.COMMERCIAL.SHOP,
  PROPERTY_TYPES.COMMERCIAL.OFFICE_SPACE,
  PROPERTY_TYPES.COMMERCIAL.WAREHOUSE,
  PROPERTY_TYPES.COMMERCIAL.OTHER
];

// Property type categories for grouping
export const PROPERTY_CATEGORIES = [
  {
    name: 'Residential',
    types: Object.values(PROPERTY_TYPES.RESIDENTIAL),
    icon: '🏠'
  },
  {
    name: 'Commercial Space',
    types: Object.values(PROPERTY_TYPES.COMMERCIAL),
    icon: '🏢'
  }
];

// Helper function to get property type category
export const getPropertyCategory = (propertyType) => {
  if (Object.values(PROPERTY_TYPES.RESIDENTIAL).includes(propertyType)) {
    return 'Residential';
  }
  if (Object.values(PROPERTY_TYPES.COMMERCIAL).includes(propertyType)) {
    return 'Commercial Space';
  }
  return 'Other';
};

// Helper function to check if property type is commercial
export const isCommercialProperty = (propertyType) => {
  return Object.values(PROPERTY_TYPES.COMMERCIAL).includes(propertyType);
};

// Helper function to check if property type is residential
export const isResidentialProperty = (propertyType) => {
  return Object.values(PROPERTY_TYPES.RESIDENTIAL).includes(propertyType);
};
