import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, SelectInput, TextArea, SubmitButton } from './forms';
import { ALL_PROPERTY_TYPES, PROPERTY_CATEGORIES } from '../utils/propertyTypes';

// Validation schema for property form
const propertySchema = yup.object({
  name: yup
    .string()
    .required('Property name is required')
    .min(3, 'Property name must be at least 3 characters')
    .max(100, 'Property name must be less than 100 characters'),
  location: yup
    .string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(1000, 'Price must be at least Ksh 1,000'),
  type: yup
    .string()
    .required('Property type is required'),
  bedrooms: yup
    .number()
    .required('Number of bedrooms is required')
    .positive('Bedrooms must be positive')
    .max(10, 'Maximum 10 bedrooms allowed'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  amenities: yup
    .array()
    .min(1, 'At least one amenity is required')
    .max(10, 'Maximum 10 amenities allowed'),
});

const PropertyForm = ({ onSubmit, initialData = null, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(propertySchema),
    mode: 'onChange',
    defaultValues: initialData || {
      name: '',
      location: '',
      price: '',
      type: '',
      bedrooms: '',
      description: '',
      amenities: [],
    },
  });

  const watchedAmenities = watch('amenities') || [];

  const propertyTypes = PROPERTY_CATEGORIES.flatMap(category => 
    category.types.map(type => ({
      value: type.toLowerCase().replace(/\s+/g, '-'),
      label: `${category.icon} ${type}`,
      category: category.name
    }))
  );

  const bedroomOptions = [
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5+', label: '5+ Bedrooms' },
  ];

  const commonAmenities = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'parking', label: 'Parking' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'garden', label: 'Garden' },
    { value: 'garage', label: 'Garage' },
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'gym', label: 'Gym' },
    { value: 'security', label: 'Security' },
    { value: 'furnished', label: 'Fully Furnished' },
    { value: 'water', label: 'Water Included' },
  ];

  const handleAmenityToggle = (amenityValue) => {
    const currentAmenities = watchedAmenities;
    const isSelected = currentAmenities.includes(amenityValue);
    
    if (isSelected) {
      setValue('amenities', currentAmenities.filter(a => a !== amenityValue));
    } else {
      setValue('amenities', [...currentAmenities, amenityValue]);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Name */}
        <TextInput
          label="Property Name"
          name="name"
          placeholder="Enter property name"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Location */}
        <TextInput
          label="Location"
          name="location"
          placeholder="Enter property location"
          required
          error={errors.location?.message}
          {...register('location')}
        />

        {/* Price */}
        <TextInput
          label="Monthly Rent (Ksh)"
          name="price"
          type="number"
          placeholder="Enter monthly rent"
          required
          error={errors.price?.message}
          {...register('price')}
        />

        {/* Property Type */}
        <SelectInput
          label="Property Type"
          name="type"
          options={propertyTypes}
          placeholder="Select property type"
          required
          error={errors.type?.message}
          {...register('type')}
        />

        {/* Bedrooms */}
        <SelectInput
          label="Bedrooms"
          name="bedrooms"
          options={bedroomOptions}
          placeholder="Select number of bedrooms"
          required
          error={errors.bedrooms?.message}
          {...register('bedrooms')}
        />
      </div>

      {/* Description */}
      <TextArea
        label="Property Description"
        name="description"
        placeholder="Describe the property, features, and neighborhood..."
        rows={4}
        maxLength={500}
        required
        error={errors.description?.message}
        {...register('description')}
      />

      {/* Amenities */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Amenities
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {commonAmenities.map((amenity) => (
            <label
              key={amenity.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={watchedAmenities.includes(amenity.value)}
                onChange={() => handleAmenityToggle(amenity.value)}
                className="rounded border-gray-300 text-[#003B4C] focus:ring-[#007C99]"
              />
              <span className="text-sm text-gray-700">{amenity.label}</span>
            </label>
          ))}
        </div>
        {errors.amenities && (
          <p className="text-sm text-red-600" role="alert">
            {errors.amenities.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <SubmitButton
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </SubmitButton>
        <SubmitButton
          type="submit"
          loading={isSubmitting || loading}
          disabled={isSubmitting || loading}
          size="lg"
        >
          {initialData ? 'Update Property' : 'Create Property'}
        </SubmitButton>
      </div>
    </form>
  );
};

export default PropertyForm;
