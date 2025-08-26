import React, { useState } from 'react';
import { Palette, Home, Calendar, User, Package, CheckCircle } from 'lucide-react';
import { Button, Card, Typography } from './ui';

const InteriorDesign = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    property: '',
    serviceType: '',
    preferredDate: '',
    additionalNotes: ''
  });
  const [submittedRequests, setSubmittedRequests] = useState([]);

  // Interior design service packages
  const servicePackages = [
    {
      id: 1,
      name: 'Furniture Setup',
      description: 'Professional furniture arrangement and setup for your new home. Includes furniture placement, assembly, and styling advice.',
      price: 'From KES 5,000',
      duration: '2-4 hours',
      features: [
        'Furniture assembly and setup',
        'Room layout optimization',
        'Basic styling consultation',
        'Post-setup walkthrough'
      ],
      icon: '🪑',
      category: 'Basic'
    },
    {
      id: 2,
      name: 'Painting & Wall Design',
      description: 'Transform your space with professional painting services and creative wall designs. Choose from our curated color palettes.',
      price: 'From KES 8,000',
      duration: '1-3 days',
      features: [
        'Color consultation',
        'Professional painting',
        'Wall texture options',
        'Cleanup included'
      ],
      icon: '🎨',
      category: 'Intermediate'
    },
    {
      id: 3,
      name: 'Full Interior Design',
      description: 'Complete interior transformation with our comprehensive design package. From concept to completion, we handle everything.',
      price: 'From KES 25,000',
      duration: '1-2 weeks',
      features: [
        'Initial consultation',
        '3D design mockups',
        'Material selection',
        'Project management',
        'Final styling'
      ],
      icon: '🏠',
      category: 'Premium'
    },
    {
      id: 4,
      name: 'Lighting Design',
      description: 'Illuminate your space with strategic lighting design. Create ambiance and functionality with modern lighting solutions.',
      price: 'From KES 6,000',
      duration: '1-2 days',
      features: [
        'Lighting consultation',
        'Fixture installation',
        'Smart lighting options',
        'Energy efficiency tips'
      ],
      icon: '💡',
      category: 'Intermediate'
    },
    {
      id: 5,
      name: 'Storage Solutions',
      description: 'Maximize your space with custom storage solutions. From closets to multipurpose furniture, we optimize every corner.',
      price: 'From KES 4,500',
      duration: '1-2 days',
      features: [
        'Space assessment',
        'Custom storage design',
        'Installation service',
        'Organization tips'
      ],
      icon: '📦',
      category: 'Basic'
    },
    {
      id: 6,
      name: 'Garden & Balcony Design',
      description: 'Transform your outdoor spaces into beautiful, functional areas. Perfect for balconies, patios, and small gardens.',
      price: 'From KES 7,000',
      duration: '2-3 days',
      features: [
        'Outdoor space planning',
        'Plant selection',
        'Furniture arrangement',
        'Maintenance guide'
      ],
      icon: '🌿',
      category: 'Intermediate'
    }
  ];

  const handleRequestService = (service) => {
    setSelectedService(service);
    setRequestForm(prev => ({
      ...prev,
      serviceType: service.name
    }));
    setShowRequestForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Create request object
    const newRequest = {
      id: Date.now(),
      ...requestForm,
      service: selectedService,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    // Add to submitted requests
    setSubmittedRequests(prev => [newRequest, ...prev]);

    // Log to console (stub backend)
    console.log('Interior Design Service Request:', newRequest);

    // Reset form and close modal
    setRequestForm({
      name: '',
      property: '',
      serviceType: '',
      preferredDate: '',
      additionalNotes: ''
    });
    setShowRequestForm(false);
    setSelectedService(null);

    // Show success message
    alert('Service request submitted successfully! We will contact you soon.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Basic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-primary-600" />
          <Typography.Heading level={2} className="text-secondary-900">
            Interior Design Services
          </Typography.Heading>
        </div>
        <Typography.BodyText variant="muted" className="text-lg max-w-2xl mx-auto">
          Transform your living space with our professional interior design services. 
          From furniture setup to complete home makeovers, we bring your vision to life.
        </Typography.BodyText>
      </div>

      {/* Service Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicePackages.map((service) => (
          <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              {/* Service Header */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{service.icon}</div>
                <Typography.Heading level={4} className="text-secondary-900 mb-2">
                  {service.name}
                </Typography.Heading>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(service.category)}`}>
                  {service.category}
                </span>
              </div>

              {/* Service Description */}
              <Typography.BodyText variant="muted" className="text-center mb-4">
                {service.description}
              </Typography.BodyText>

              {/* Service Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-primary-600">{service.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-800">{service.duration}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <Typography.Heading level={6} className="text-gray-700 mb-3">
                  What's Included:
                </Typography.Heading>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Request Button */}
              <Button
                onClick={() => handleRequestService(service)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                size="lg"
              >
                Request Service
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <Typography.Heading level={4} className="text-secondary-900">
                  Request {selectedService?.name}
                </Typography.Heading>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Package className="w-6 h-6" />
                </button>
              </div>

              {/* Request Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={requestForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    name="property"
                    value={requestForm.property}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter your property address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    name="serviceType"
                    value={requestForm.serviceType}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={requestForm.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={requestForm.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Requests Section */}
      {submittedRequests.length > 0 && (
        <div className="mt-12">
          <Typography.Heading level={3} className="text-secondary-900 mb-6">
            Your Service Requests
          </Typography.Heading>
          <div className="space-y-4">
            {submittedRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography.Heading level={5} className="text-secondary-900 mb-1">
                      {request.serviceType}
                    </Typography.Heading>
                    <Typography.BodyText variant="muted" className="text-sm">
                      Property: {request.property} • Date: {new Date(request.preferredDate).toLocaleDateString()}
                    </Typography.BodyText>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    {request.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteriorDesign;
