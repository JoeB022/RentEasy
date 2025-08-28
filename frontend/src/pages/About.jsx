import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Lock, Home, CreditCard, Star } from 'lucide-react';

const About = ({ onAuthOpen }) => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-white" />,
      title: "Trust & Security",
      description: "Every property and user is verified to ensure a safe rental experience."
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Direct Connection",
      description: "Connect directly with landlords and tenants without middlemen fees."
    },
    {
      icon: <Lock className="h-8 w-8 text-white" />,
      title: "Secure Payments",
      description: "Escrow-backed transactions with full transparency and traceability."
    },
    {
      icon: <Home className="h-8 w-8 text-white" />,
      title: "Quality Listings",
      description: "Curated properties that meet our high standards for quality and safety."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-white" />,
      title: "Transparent Pricing",
      description: "No hidden fees, no surprises. Clear pricing from day one."
    },
    {
      icon: <Star className="h-8 w-8 text-white" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help with any questions or issues."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Tenants" },
    { number: "5,000+", label: "Verified Properties" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" }
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
            About RentEasy
          </h1>
          <p className="text-xl sm:text-2xl opacity-95 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing the rental experience by connecting tenants and landlords directly, 
            eliminating middlemen, and ensuring transparency in every transaction.
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

      {/* Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="group">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mb-8 group-hover:text-[#003B4C] transition-colors duration-500">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed group-hover:text-gray-800 transition-colors duration-500">
                At RentEasy, we believe finding and managing rental properties should be simple, 
                transparent, and secure. We're on a mission to eliminate the complexity and 
                hidden costs that have plagued the rental industry for decades.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-500">
                By connecting tenants directly with landlords and providing secure payment 
                infrastructure, we're creating a rental ecosystem that works for everyone.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#003B4C] to-[#005A6E] rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group">
              <h3 className="text-3xl font-bold mb-6 group-hover:text-white transition-colors duration-300">
                Why We Started
              </h3>
              <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Frustrated with high broker fees, hidden charges, and lack of transparency 
                in traditional rental platforms, our team set out to build something better. 
                RentEasy was born from the simple idea that renting should be easy, fair, 
                and transparent for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#111827] mb-20">
            RentEasy by the <span className="text-[#003B4C]">Numbers</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold text-[#003B4C] mb-4 group-hover:text-[#005A6E] transition-colors duration-500 group-hover:scale-110 transform">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold text-lg group-hover:text-gray-800 transition-colors duration-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f9fafb] to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#111827] mb-20">
            What Makes Us <span className="text-[#003B4C]">Different</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-[#003B4C] to-[#005A6E] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 text-white text-center group cursor-pointer"
              >
                <div className="flex justify-center items-center w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-[#003B4C] via-[#004A5F] to-[#005A6E] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-20">
            How RentEasy <span className="text-white/90">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 text-3xl font-bold group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                1
              </div>
              <h3 className="text-2xl font-bold mb-6 group-hover:text-white transition-colors duration-300">
                Browse & Select
              </h3>
              <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Browse through our curated selection of verified properties. 
                Filter by location, price, and amenities to find your perfect match.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 text-3xl font-bold group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                2
              </div>
              <h3 className="text-2xl font-bold mb-6 group-hover:text-white transition-colors duration-300">
                Connect Directly
              </h3>
              <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Connect directly with landlords through our secure messaging system. 
                No middlemen, no hidden fees, just direct communication.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 text-3xl font-bold group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                3
              </div>
              <h3 className="text-2xl font-bold mb-6 group-hover:text-white transition-colors duration-300">
                Secure Payment
              </h3>
              <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Complete your rental agreement with our secure payment system. 
                All transactions are protected and fully traceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#f9fafb]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mb-8">
            Ready to Experience <span className="text-[#003B4C]">Better Renting?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands of satisfied tenants and landlords who have already 
            discovered the RentEasy difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => onAuthOpen('signup')}
              className="bg-gradient-to-r from-[#003B4C] to-[#005A6E] hover:from-[#004A5F] hover:to-[#006B7A] text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              Get Started Today
            </button>
            <button 
              onClick={() => navigate('/')}
              className="border-2 border-[#003B4C] text-[#003B4C] hover:bg-[#003B4C] hover:text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-500 transform hover:scale-105 cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
