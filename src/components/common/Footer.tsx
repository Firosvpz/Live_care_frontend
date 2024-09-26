import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold">LiveCare</h2>
            <p className="text-gray-400">Your health is our priority</p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-12 mb-6 md:mb-0">
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-info">About Us</a></li>
                <li><a href="/services" className="hover:text-info">Services</a></li>
                <li><a href="/contact" className="hover:text-info">Contact</a></li>
                <li><a href="/privacy" className="hover:text-info">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p className="mt-2 text-gray-400">Email: support@livecare.com</p>
              <p className="text-gray-400">Phone: +1 234 567 890</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} className="hover:text-info transition-colors duration-200" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} className="hover:text-info transition-colors duration-200" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="hover:text-info transition-colors duration-200" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="hover:text-info transition-colors duration-200" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          <p className="text-gray-400">&copy; 2024 LiveCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
