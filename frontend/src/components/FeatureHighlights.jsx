import React from "react";
import { ShieldCheck, Users, Lock } from "lucide-react";

const features = [
  {
    title: "No Middlemen",
    description: "Connect directly with landlords or tenants for full transparency.",
    icon: <ShieldCheck className="h-10 w-10 text-white" title="No Middlemen" />,
  },
  {
    title: "Secure Payments",
    description: "Escrow-backed transactions with full traceability.",
    icon: <Lock className="h-10 w-10 text-white" title="Secure Payments" />,
  },
  {
    title: "Verified Listings",
    description: "Each property is vetted before going live to ensure quality.",
    icon: <Users className="h-10 w-10 text-white" title="Verified Listings" />,
  },
];

const FeatureHighlights = () => {
  return (
    <section
      id="features"
      className="bg-gradient-to-br from-[#f9fafb] via-white to-[#e5e7eb] py-24 px-0 mb-16 relative overflow-hidden"
      aria-labelledby="feature-highlights-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#003B4C]/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#005A6E]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#003B4C]/8 rounded-full blur-md animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          id="feature-highlights-heading"
          className="text-4xl sm:text-5xl font-bold text-[#111827] mb-16"
        >
          Why Rent With <span className="text-[#003B4C]">Us?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-gradient-to-br from-[#003B4C] to-[#005A6E] rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 text-white group cursor-pointer"
            >
              <div className="flex justify-center items-center w-20 h-20 mx-auto mb-8 bg-white/20 rounded-full group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
