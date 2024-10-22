import React, { useState, useEffect } from "react";
import Footer from "../../components/common/Footer";
import SpHeader from "../../components/serviceprovider/SpHeader";
import { getSpProfileDetails, fetchCategories } from "../../api/sp_api";
import { fetchApprovedAndUnblockedProvidersPublic } from "../../api/user_api";
import { ServiceProvider } from "../../types/serviceproviders";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateServiceProviderInfo } from "../../redux/slices/sp_slice";
import { useDispatch } from "react-redux";

const ServiceProviderLanding: React.FC = () => {
  const [profileData, setProfileData] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    [],
  );
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch services and service providers
  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await fetchCategories();
        setServices(servicesData);
      } catch (error) {
        toast.error("Failed to load services");
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        const providersData = await fetchApprovedAndUnblockedProvidersPublic();
        setProviders(providersData);
        setFilteredProviders(providersData);
      } catch (err) {
        toast.error("Failed to fetch service providers");
      } finally {
        setLoading(false);
      }
    };
    loadServiceProviders();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getSpProfileDetails();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const fetchProviderInfo = async () => {
    const response = await getSpProfileDetails();
    if (response.success) {
      dispatch(updateServiceProviderInfo(response.data));
      return response.data;
    }
    return null;
  };

  const handleScheduleSlot = async () => {
    const providerInfo = await fetchProviderInfo();
    console.log("userinfo", providerInfo);

    if (providerInfo.hasCompletedDetails !== true) {
      navigate(`/sp/verify-details`);
    } else {
      navigate("/sp/get-slots");
    }
  };

  return (
    <>
      <SpHeader />

      {/* Hero Section */}
      <div
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/home.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative flex flex-col items-center justify-center h-full w-full text-white text-center p-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-5xl lg:text-6xl font-extrabold mb-8"
          >
            Welcome <span className="text-yellow-400">{profileData?.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl mb-6"
          >
            Discover exceptional services for senior care
          </motion.p>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <div className="text-5xl font-bold text-gray-800 mb-8">
            Explore Our Services
          </div>
          <p className="text-lg text-gray-600 mb-12">
            We offer a wide range of services to meet the needs of senior
            citizens and their families, all delivered through our convenient
            video call and chat system.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gradient-to-b from-blue-600 to-black shadow-lg rounded-lg transform transition hover:scale-105 hover:shadow-xl"
                whileHover={{ y: -10 }}
              >
                <h3 className="text-3xl font-bold text-white mb-4">
                  {service}
                </h3>
                <p className="text-lg text-white mb-4 italic">
                  Connect with expert providers specializing in {service} via
                  video calls or chat.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Your Slot Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <div className="container mx-auto  text-center">
          <div className="text-5xl text-white font-bold mb-8">
            Welcome to the Team!
          </div>
          <div className="text-lg mb-12">
            Thank you for joining our dedicated team of professionals! You’re
            making a difference in the lives of senior citizens every day. Now,
            let’s schedule your consultation slots to connect with those in
            need.
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-red-400 hover:bg-orange-500 px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition mb-4"
            onClick={handleScheduleSlot} // Use the new function here
          >
            Schedule a Slot
          </motion.button>
        </div>
      </section>

      {/* Service Providers Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <div className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Top Service Providers
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProviders.map((provider) => (
                <motion.div
                  key={provider._id}
                  className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={
                      provider.profile_picture ||
                      "https://via.placeholder.com/150"
                    }
                    alt={provider.name}
                    className="h-32 w-32 rounded-full mx-auto mb-4 shadow-md"
                  />
                  <h3 className="text-2xl font-bold text-indigo-600 mb-2">
                    {provider.name}
                  </h3>
                  <p className="text-lg text-gray-500 mb-4">
                    {provider.specialization}
                  </p>
                  <p className="text-lg text-gray-500 mb-4">
                    {/* {provider.ratingAverage} */}
                  </p>
                  {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                    onClick={() => navigate(`/provider/${provider._id}`)}
                  >
                    View Profile
                  </motion.button> */}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No service providers found.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ServiceProviderLanding;
