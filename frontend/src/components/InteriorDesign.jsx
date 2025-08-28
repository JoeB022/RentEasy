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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-2xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <Typography.Heading level={2} className="text-3xl font-bold text-[#003B4C]">
              Interior Design Services
            </Typography.Heading>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full mx-auto"></div>
        </div>
        <Typography.BodyText variant="muted" className="text-lg max-w-3xl mx-auto text-[#007C99] font-medium leading-relaxed">
          Transform your living space with our professional interior design services. 
          From furniture setup to complete home makeovers, we bring your vision to life.
        </Typography.BodyText>
      </div>

      {/* Service Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicePackages.map((service) => (
          <Card key={service.id} className="group bg-gradient-to-br from-white to-[#f8fafc] border-2 border-white/50 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="p-8">
              {/* Service Header */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <Typography.Heading level={4} className="text-xl font-bold text-[#003B4C] mb-3 group-hover:text-[#007C99] transition-colors duration-300">
                  {service.name}
                </Typography.Heading>
                <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border-2 shadow-md ${
                  service.category === 'Basic' 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300' 
                    : service.category === 'Intermediate' 
                    ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300' 
                    : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300'
                }`}>
                  {service.category === 'Basic' && '🌟'}
                  {service.category === 'Intermediate' && '⭐'}
                  {service.category === 'Premium' && '💎'}
                  {service.category}
                </span>
              </div>

              {/* Service Description */}
              <Typography.BodyText variant="muted" className="text-center mb-6 text-[#007C99] leading-relaxed">
                {service.description}
              </Typography.BodyText>

              {/* Service Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
                  <span className="text-[#003B4C] font-medium">Price:</span>
                  <span className="font-bold text-[#007C99]">{service.price}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f8fafc] to-[#e5e7eb] rounded-xl border border-white/50">
                  <span className="text-[#003B4C] font-medium">Duration:</span>
                  <span className="font-bold text-[#007C99]">{service.duration}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <Typography.Heading level={6} className="text-[#003B4C] font-bold mb-4 text-center">
                  What's Included:
                </Typography.Heading>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50 backdrop-blur-sm">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-[#003B4C] font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Request Button */}
              <Button
                onClick={() => handleRequestService(service)}
                className="w-full bg-gradient-to-r from-[#003B4C] to-[#005A6E] hover:from-[#004A5F] hover:to-[#006B8A] text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/50">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Typography.Heading level={4} className="text-xl font-bold text-[#003B4C] mb-2">
                    Request {selectedService?.name}
                  </Typography.Heading>
                  <div className="w-12 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full"></div>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-110"
                >
                  <Package className="w-5 h-5 text-[#003B4C]" />
                </button>
              </div>

              {/* Request Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={requestForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-3">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    name="property"
                    value={requestForm.property}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your property address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-3">
                    Service Type
                  </label>
                  <input
                    type="text"
                    name="serviceType"
                    value={requestForm.serviceType}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-[#003B4C] font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-3">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={requestForm.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#003B4C] mb-3">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={requestForm.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#007C99]/30 rounded-xl focus:border-[#007C99] focus:ring-2 focus:ring-[#007C99]/20 transition-all duration-300 hover:border-[#007C99]/50 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-[#007C99] text-[#007C99] rounded-xl font-medium hover:bg-[#007C99] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#003B4C] to-[#005A6E] hover:from-[#004A5F] hover:to-[#006B8A] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
        <div className="mt-16">
          <div className="mb-8">
            <Typography.Heading level={3} className="text-3xl font-bold text-[#003B4C] mb-2 text-center">
              Your Service Requests
            </Typography.Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#007C99] to-[#0099B3] rounded-full mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            {submittedRequests.map((request) => (
              <Card key={request.id} className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Typography.Heading level={5} className="text-lg font-bold text-[#003B4C] mb-2">
                      {request.serviceType}
                    </Typography.Heading>
                    <div className="flex items-center gap-4 text-sm text-[#007C99]">
                      <span className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        {request.property}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 rounded-xl border border-yellow-300 shadow-md">
                    ⏳ {request.status}
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
