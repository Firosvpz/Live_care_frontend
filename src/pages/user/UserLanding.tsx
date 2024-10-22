import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronRight, Video, MessageSquare, Star, Shield, Clock } from "lucide-react";
import UserHeader from "../../components/user/Header";
import Footer from "../../components/common/Footer";
import { fetchApprovedAndUnblockedProviders, getProfileDetails } from "../../api/user_api";
import { fetchCategories } from "../../api/sp_api";
import { ServiceProvider } from '../../types/serviceproviders';

export default function UserLanding() {
  const [profileData, setProfileData] = useState<{ name: string } | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, providersData, { data: userData }] = await Promise.all([
          fetchCategories(),
          fetchApprovedAndUnblockedProviders(),
          getProfileDetails()
        ]);
        setCategories(categoriesData);
        setProviders(providersData);
        setFilteredProviders(providersData);
        setProfileData(userData);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const filterProviders = () => {
      const filtered = providers.filter((provider) =>
        categories.includes(provider.service)
      );
      setFilteredProviders(filtered);
    };
    filterProviders();
  }, [providers, categories]);

  const handleViewDetails = (providerId: string) => {
    navigate(`/user/sp-details/${providerId}`);
  };

  const getCategoryIcon = (index: number) => {
    switch (index % 3) {
      case 0:
        return <Star className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Shield className="w-6 h-6 text-blue-500" />;
      case 2:
        return <Clock className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/images/userLand.jpg')` }}>
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="container relative z-10 text-center px-4">
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Welcome <span className="text-blue-400">{profileData?.name}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 italic"
            >
              Discover and book premium care services tailored just for you.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/user/service-providers" className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300">
                Explore Services
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Carousel */}
        <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16"
            >
              Our Premium Services
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-semibold text-gray-800">{category}</div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getCategoryIcon(index)}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Discover exceptional {category.toLowerCase()} services tailored to your unique needs and preferences.
                    </p>
                    <div className="flex items-center justify-between text-blue-600">
                      <span className="text-sm font-medium">Learn more</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Service Providers Section */}
        <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
          <div className="container mx-auto px-4">
            <div className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Our Expert Service Providers
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProviders.map((provider, index) => (
                  <motion.div
                    key={provider._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="relative">
                      <img
                        src={provider.profile_picture || "/placeholder.svg?height=200&width=200"}
                        alt={provider.name}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-xl font-semibold text-white mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-300">{provider.specialization}</p>
                      </div>
                    </div>
                    <div className="p-6">
                    
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{provider.exp_year || "5+"} years exp.</span>
                        <button
                          onClick={() => handleViewDetails(provider._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 flex items-center"
                        >
                          View Profile
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {filteredProviders.length === 0 && !loading && (
              <div className="text-center text-gray-600 mt-8">
                No service providers found. Please check back later.
              </div>
            )}
          </div>
        </section>

        {/* Video Call and Chat Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Connect Through Video Calls & Chats</div>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Our innovative platform allows you to communicate directly with service providers via video calls and chat. Enjoy personalized care and support from the comfort of your home.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-blue-50 rounded-lg shadow-md"
              >
                <Video className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                <div className="text-xl font-semibold text-gray-800 mb-2">Video Calls</div>
                <p className="text-gray-600">Face-to-face consultations from anywhere</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-indigo-50 rounded-lg shadow-md"
              >
                <MessageSquare className="w-12 h-12 text-indigo-600 mb-4 mx-auto" />
                <div className="text-xl font-semibold text-gray-800 mb-2">Chat Support</div>
                <p className="text-gray-600">Instant messaging for quick queries and support</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}