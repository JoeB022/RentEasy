import React from "react";
import { ShieldCheck, Users, Lock } from "lucide-react";

const features = [
  {
    title: "No Middlemen",
    description: "Connect directly with landlords or tenants for full transparency.",
    icon: <Users className="h-8 w-8 text-white" title="No Middlemen" />,
  },
  {
    title: "Secure Payments",
    description: "Escrow-backed transactions with full traceability.",
    icon: <Lock className="h-8 w-8 text-white" title="Secure Payments" />,
  },
  {
    title: "Verified Listings",
    description: "Each property is vetted before going live to ensure quality.",
    icon: <ShieldCheck className="h-8 w-8 text-white" title="Verified Listings" />,
  },
];

const FeatureHighlights = () => {
  return (
    <section
      className="bg-[#f9fafb] py-20 px-0"
      aria-labelledby="feature-highlights-heading"
    >
      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2
          id="feature-highlights-heading"
          className="text-3xl sm:text-4xl font-bold text-[#111827] mb-12"
        >
          Why Rent With Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#003B4C] rounded-2xl p-8 shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] text-white"
              role="region"
              aria-label={feature.title}
            >
              <div className="flex justify-center items-center w-14 h-14 mx-auto mb-6 bg-white/10 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
