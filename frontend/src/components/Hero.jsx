const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[calc(100vh-64px)] flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/66/85/7c/66857c67d85932c2e2c9b0904e15ce4d.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-white text-center p-8 sm:p-12">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Find Your Next Home Easily
          </h1>
          <p className="text-md sm:text-lg mb-6">
            Discover trusted rentals, connect with verified landlords, and make secure payments — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white">
              Get Started
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;