import React from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#003B4C] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">RentEasy</h3>
            <p className="text-sm text-gray-300">
              Your trusted platform for verified rentals, direct connections, and secure payments across Kenya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Properties</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <p className="text-sm text-gray-300">Email: joebrian.dev@gmail.com</p>
            <p className="text-sm text-gray-300">Phone: +254 742 386 703</p>
            <p className="text-sm text-gray-300 mt-2">Nairobi, Kenya</p>

            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-400">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-400">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex justify-center items-center text-sm text-gray-400 space-x-2">
  <a
    href="https://joeb022.github.io/Portfolio"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-blue-500 transition flex items-center space-x-1"
  >
    <span>&copy; {new Date().getFullYear()} RentEasy. All rights reserved.</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </a>
</div>

      </div>
    </footer>
  );
};

export default Footer;
