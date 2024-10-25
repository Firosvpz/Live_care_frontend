import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-3xl font-bold">LiveCare</h2>
            <p className="text-gray-400">Your health is our priority</p>
            <p className="text-sm text-gray-500 mt-4">
              LiveCare is committed to providing exceptional healthcare
              services, ensuring your well-being and comfort at every step of
              your journey.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeInUp} className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Services",
                "Contact",
                "Privacy Policy",
                "Terms of Service",
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div {...fadeInUp} className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2 text-blue-400" />
                <a
                  href="mailto:support@livecare.com"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  support@livecare.com
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2 text-blue-400" />
                <a
                  href="tel:+12345678901"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  +1 234 567 8901
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="h-5 w-5 mr-2 text-blue-400 mt-1" />
                <span>
                  123 Health Street,
                  <br />
                  Wellness City, WC 12345
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div
          {...fadeInUp}
          className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center"
        >
          <div className="flex space-x-6 mb-4 sm:mb-0">
            {[
              { icon: Facebook, href: "https://www.facebook.com" },
              { icon: Twitter, href: "https://www.twitter.com" },
              { icon: Instagram, href: "https://www.instagram.com" },
              { icon: Linkedin, href: "https://www.linkedin.com" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} LiveCare. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
