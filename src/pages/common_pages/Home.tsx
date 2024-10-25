import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { fetchCategories } from "../../api/sp_api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ServiceProvider } from "../../types/serviceproviders";
import { fetchApprovedAndUnblockedProvidersPublic } from "../../api/user_api";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    [],
  );
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        const providersData = await fetchApprovedAndUnblockedProvidersPublic();
        setProviders(providersData);
        setFilteredProviders(providersData);
      } catch (err) {
        console.error("Error fetching service providers:", err);
        toast.error("Failed to fetch service providers");
      } finally {
        setLoading(false);
      }
    };

    loadServiceProviders();
  }, []);

  useEffect(() => {
    const filterProviders = () => {
      const filtered = providers.filter((provider) =>
        categories.includes(provider.service),
      );
      setFilteredProviders(filtered);
    };

    filterProviders();
  }, [providers, categories]);

  const groupedProviders = [];
  for (let i = 0; i < filteredProviders.length; i += 3) {
    groupedProviders.push(filteredProviders.slice(i, i + 3));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          <img
            src="/images/home.jpg"
            alt="Background"
            className="w-full h-full object-cover "
          />
        </div>

        <div className="container relative z-10 px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <Carousel
              indicators={false}
              controls={false}
              interval={2000}
              className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
            >
              <h5 className="text-center py-8">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                >
                  {/* Welcome text preserved as in original */}
                </motion.div>
              </h5>

              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <Carousel.Item key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="p-8 md:p-12"
                    >
                      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-cyan-400 mb-6">
                        {category} Services
                      </div>
                      <div className="text-lg md:text-xl text-gray-200 leading-relaxed italic max-w-3xl mx-auto">
                        Discover exceptional {category} services tailored to
                        your needs. At LiveCare, we prioritize your comfort and
                        well-being with the utmost care and professionalism.
                      </div>
                    </motion.div>
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="p-8 md:p-12 text-center"
                  >
                    <h3 className="text-3xl font-semibold text-red-500 mb-4">
                      No Services Available
                    </h3>
                    <p className="text-lg text-cyan-400 italic leading-relaxed">
                      Please check back soon. We're expanding our services to
                      offer the best care experience for you.
                    </p>
                  </motion.div>
                </Carousel.Item>
              )}
            </Carousel>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-center"
            >
              <Link to="/user/service-providers">
                <button className="px-8 py-4 border-2 border-cyan-500 bg-transparent hover:bg-cyan-500 text-cyan-500 hover:text-white rounded-lg transform transition-all hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:outline-none">
                  <span className="text-lg font-semibold">
                    Go for a Service
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80" />
          <img
            src="/images/register.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-10 px-4 py-16 md:py-24">
          <div className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Our Service Providers
          </div>

          <Carousel
            indicators={false}
            controls={true}
            interval={2000}
            className="p-4"
          >
            {loading ? (
              <Carousel.Item>
                <div className="flex justify-center items-center h-64">
                  <div className="text-2xl text-gray-400">Loading...</div>
                </div>
              </Carousel.Item>
            ) : groupedProviders.length > 0 ? (
              groupedProviders.map((providerGroup, index) => (
                <Carousel.Item key={index}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {providerGroup.map((provider) => (
                      <motion.div
                        key={provider._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105"
                      >
                        <div className="relative mb-6">
                          <img
                            src={
                              provider.profile_picture ||
                              "/api/placeholder/150/150"
                            }
                            alt={provider.name}
                            className="w-32 h-32 rounded-full mx-auto border-4 border-cyan-500 shadow-xl"
                          />
                          {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-cyan-500 px-4 py-1 rounded-full">
                            <span className="text-sm font-medium text-white text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                              {provider.service}
                            </span>
                          </div> */}
                        </div>
                        <h3 className="text-2xl font-bold text-white text-center mb-2">
                          {provider.name}
                        </h3>
                        <p className="text-gray-300 text-center mb-4">
                          {provider.specialization}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </Carousel.Item>
              ))
            ) : (
              <Carousel.Item>
                <div className="text-center text-xl text-gray-400">
                  No service providers found.
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
