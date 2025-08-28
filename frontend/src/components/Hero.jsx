const Hero = ({ isSkeleton = false, onGetStarted }) => {
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/66/85/7c/66857c67d85932c2e2c9b0904e15ce4d.jpg')",
      }}
    >
      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/15 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/8 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-blue-400/10 rounded-full blur-md animate-pulse delay-1500"></div>
      </div>

      {/* Main content - only show when not used as skeleton */}
      {!isSkeleton && (
        <div className="relative z-10 w-full max-w-5xl mx-auto text-white text-center p-8 sm:p-12">
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-12 transform transition-all duration-700 hover:scale-105 group">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg group-hover:text-shadow-xl transition-all duration-500">
              Find Your Next Home <span className="text-blue-300">Easily</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-shadow-md opacity-95 leading-relaxed max-w-3xl mx-auto group-hover:opacity-100 transition-all duration-500">
              Discover trusted rentals, connect with verified landlords, and make secure payments — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl cursor-pointer shadow-lg"
              >
                Get Started
              </button>
              <button 
                onClick={scrollToFeatures}
                className="bg-white/20 text-white border-2 border-white/40 px-8 py-4 rounded-2xl hover:bg-white/30 hover:border-white/60 transition-all duration-500 backdrop-blur-sm cursor-pointer transform hover:scale-110 hover:shadow-xl"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
      
      {/* Scroll indicator */}
      {!isSkeleton && (
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
      )}
    </section>
  );
};

export default Hero;