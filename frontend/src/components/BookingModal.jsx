import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { X, Phone, Mail, MessageCircle, User, MapPin, Home } from 'lucide-react';
import { Button, Typography } from './ui';
import useAuthFetch from '../hooks/useAuthFetch';

const BookingModal = ({ isOpen, onClose, property }) => {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  const { get } = useAuthFetch();

  useEffect(() => {
    if (isOpen && property?.id) {
      fetchLandlordDetails();
    }
  }, [isOpen, property?.id]);

  const fetchLandlordDetails = async () => {
    setLoading(true);
    try {
      const response = await get(`/api/properties/${property.id}/landlord`);
      if (response.ok) {
        const data = await response.json();
        setLandlord(data.landlord);
      } else {
        console.error('Failed to fetch landlord details');
      }
    } catch (error) {
      console.error('Error fetching landlord details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (landlord?.phone) {
      const message = `Hello ${landlord.username}, I'm interested in your property "${landlord.property_name}" in ${landlord.property_location}. Could you please provide more details?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${landlord.phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Fallback to email if no phone
      handleEmail();
    }
  };

  const handleEmail = () => {
    if (landlord?.email) {
      const subject = `Interest in ${landlord.property_name}`;
      const body = `Hello ${landlord.username},\n\nI'm interested in your property "${landlord.property_name}" located in ${landlord.property_location}.\n\nCould you please provide more details about:\n- Availability\n- Viewing schedule\n- Any additional requirements\n\nThank you!\n\nBest regards`;
      const mailtoUrl = `mailto:${landlord.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
    }
  };

  const handleCall = () => {
    if (landlord?.phone) {
      window.open(`tel:${landlord.phone}`);
    } else {
      alert('Phone number not available. Please use email or WhatsApp.');
    }
  };

  const handleSMS = () => {
    if (landlord?.phone) {
      const message = `Hello ${landlord.username}, I'm interested in your property "${landlord.property_name}" in ${landlord.property_location}. Could you please provide more details?`;
      const smsUrl = `sms:${landlord.phone}?body=${encodeURIComponent(message)}`;
      window.open(smsUrl);
    } else {
      alert('Phone number not available. Please use email or WhatsApp.');
    }
  };

  if (!isOpen) return null;

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          </Transition.Child>

          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Typography.Heading level={4} className="text-primary-600">
                  Contact Landlord
                </Typography.Heading>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Property Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <Typography.Heading level={6} className="text-gray-900 mb-1">
                      {property?.name}
                    </Typography.Heading>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <Typography.BodyText size="sm" variant="muted">
                        {property?.location}
                      </Typography.BodyText>
                    </div>
                    <Typography.BodyText size="sm" className="text-primary-600 font-medium mt-1">
                      KES {property?.price?.toLocaleString()}/month
                    </Typography.BodyText>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <Typography.BodyText variant="muted">
                    Loading landlord details...
                  </Typography.BodyText>
                </div>
              )}

              {/* Landlord Details */}
              {!loading && landlord && (
                <div className="space-y-4">
                  {/* Landlord Info */}
                  <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Typography.Heading level={6} className="text-gray-900">
                        {landlord.username}
                      </Typography.Heading>
                      <Typography.BodyText size="sm" variant="muted">
                        Property Owner
                      </Typography.BodyText>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="space-y-3">
                    <Typography.BodyText className="font-medium text-gray-700">
                      Choose how to contact:
                    </Typography.BodyText>

                    {/* WhatsApp */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                      {landlord.phone ? (
                        <span className="ml-auto text-sm font-normal">
                          {landlord.phone}
                        </span>
                      ) : (
                        <span className="ml-auto text-sm font-normal text-gray-500">
                          Via Email
                        </span>
                      )}
                    </Button>

                    {/* Call */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      onClick={handleCall}
                      disabled={!landlord.phone}
                    >
                      <Phone className="w-5 h-5" />
                      Call
                      {landlord.phone ? (
                        <span className="ml-auto text-sm font-normal">
                          {landlord.phone}
                        </span>
                      ) : (
                        <span className="ml-auto text-sm font-normal text-gray-500">
                          Not Available
                        </span>
                      )}
                    </Button>

                    {/* SMS */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                      onClick={handleSMS}
                      disabled={!landlord.phone}
                    >
                      <MessageCircle className="w-5 h-5" />
                      SMS
                      {landlord.phone ? (
                        <span className="ml-auto text-sm font-normal">
                          {landlord.phone}
                        </span>
                      ) : (
                        <span className="ml-auto text-sm font-normal text-gray-500">
                          Not Available
                        </span>
                      )}
                    </Button>

                    {/* Email */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      onClick={handleEmail}
                    >
                      <Mail className="w-5 h-5" />
                      Email
                      <span className="ml-auto text-sm font-normal">
                        {landlord.email}
                      </span>
                    </Button>
                  </div>

                  {/* Note */}
                  <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Typography.BodyText size="sm" className="text-yellow-800">
                      💡 <strong>Tip:</strong> WhatsApp is the fastest way to get a response. 
                      Include your preferred viewing time and any questions about the property.
                    </Typography.BodyText>
                  </div>
                </div>
              )}

              {/* Error State */}
              {!loading && !landlord && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <Typography.Heading level={6} className="text-gray-900 mb-2">
                    Unable to load landlord details
                  </Typography.Heading>
                  <Typography.BodyText variant="muted" className="mb-4">
                    There was an error fetching the landlord's contact information.
                  </Typography.BodyText>
                  <Button variant="secondary" size="sm" onClick={fetchLandlordDetails}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default BookingModal;
