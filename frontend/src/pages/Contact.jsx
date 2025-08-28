import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-8 w-8 text-white" />,
      title: "Email Support",
      details: "support@renteasy.com",
      description: "Get help with your account or rental questions"
    },
    {
      icon: <Phone className="h-8 w-8 text-white" />,
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Speak directly with our support team"
    },
    {
      icon: <MapPin className="h-8 w-8 text-white" />,
      title: "Office Address",
      details: "123 Rental Street, City, State 12345",
      description: "Visit our headquarters during business hours"
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM EST",
      description: "We're here to help during business hours"
    }
  ];

  const supportTopics = [
    {
      icon: <HelpCircle className="h-8 w-8 text-[#003B4C]" />,
      title: "General Inquiries",
      description: "Questions about our services and platform"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-[#003B4C]" />,
      title: "Technical Support",
      description: "Help with website or app issues"
    },
    {
      icon: <Mail className="h-8 w-8 text-[#003B4C]" />,
      title: "Account Issues",
      description: "Problems with login, registration, or account settings"
    },
    {
      icon: <Phone className="h-8 w-8 text-[#003B4C]" />,
      title: "Rental Disputes",
      description: "Issues with properties, payments, or agreements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003B4C] via-[#004A5F] to-[#005A6E] text-white py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-shadow-lg">
            Contact Us
          </h1>
          <p className="text-xl sm:text-2xl opacity-95 max-w-4xl mx-auto leading-relaxed">
            Have questions? Need help? We're here to assist you with anything 
            related to your rental experience on RentEasy.
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center text-white/90 group cursor-pointer">
            <span className="text-xs font-medium mb-2 opacity-80 group-hover:opacity-100 transition-all duration-300 tracking-wide">
              Scroll to see more
            </span>
            <div className="relative">
              <div className="w-6 h-8 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white/80 transition-all duration-300">
                <div className="w-1 h-2 bg-white/80 rounded-full mt-1.5 animate-bounce group-hover:bg-white transition-all duration-300"></div>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-white/60 rounded-full group-hover:bg-white/80 transition-all duration-300"></div>
            </div>
            <div className="mt-1 text-xs opacity-60 group-hover:opacity-80 transition-all duration-300">
              ↓
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-[#003B4C] to-[#005A6E] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 text-white text-center group"
              >
                <div className="flex justify-center items-center w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                  {info.title}
                </h3>
                <p className="text-white/90 font-semibold mb-3 text-lg group-hover:text-white transition-colors duration-300">
                  {info.details}
                </p>
                <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#111827] mb-20">
            How Can We <span className="text-[#003B4C]">Help You?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportTopics.map((topic, index) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 group cursor-pointer"
              >
                <div className="flex justify-center items-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#003B4C]/10 to-[#005A6E]/10 rounded-full group-hover:from-[#003B4C]/20 group-hover:to-[#005A6E]/20 transition-all duration-300 group-hover:scale-110">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-bold text-center text-[#111827] mb-4 group-hover:text-[#003B4C] transition-colors duration-300">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#f9fafb]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#111827] mb-20">
            Send Us a <span className="text-[#003B4C]">Message</span>
          </h2>
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-[#003B4C] transition-colors duration-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#003B4C]/20 focus:border-[#003B4C] focus:outline-none transition-all duration-300 text-lg placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-[#003B4C] transition-colors duration-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#003B4C]/20 focus:border-[#003B4C] focus:outline-none transition-all duration-300 text-lg placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-[#003B4C] transition-colors duration-300">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#003B4C]/20 focus:border-[#003B4C] focus:outline-none transition-all duration-300 text-lg placeholder-gray-400 hover:border-gray-300"
                  placeholder="What is this about?"
                />
              </div>
              
              <div className="group">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-[#003B4C] transition-colors duration-300">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#003B4C]/20 focus:border-[#003B4C] focus:outline-none transition-all duration-300 text-lg placeholder-gray-400 hover:border-gray-300 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] hover:from-[#004A5F] hover:to-[#006B7A] disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f9fafb] to-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#111827] mb-20">
            Frequently Asked <span className="text-[#003B4C]">Questions</span>
          </h2>
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-100 group cursor-pointer">
              <h3 className="text-xl font-bold text-[#111827] mb-4 group-hover:text-[#003B4C] transition-colors duration-300">
                How do I report a problem with a property?
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                You can report property issues through our contact form above, or directly email us at support@renteasy.com. 
                Include photos and detailed descriptions for faster resolution.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-100 group cursor-pointer">
              <h3 className="text-xl font-bold text-[#111827] mb-4 group-hover:text-[#003B4C] transition-colors duration-300">
                What are your business hours?
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                Our support team is available Monday through Friday, 9 AM to 6 PM EST. 
                For urgent matters outside business hours, please email us and we'll respond within 24 hours.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-100 group cursor-pointer">
              <h3 className="text-xl font-bold text-[#111827] mb-4 group-hover:text-[#003B4C] transition-colors duration-300">
                How can I become a verified landlord?
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                To become a verified landlord, complete your profile, provide property documentation, 
                and pass our verification process. Contact us for detailed requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
