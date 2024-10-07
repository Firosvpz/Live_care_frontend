import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { fetchCategories } from "../../api/sp_api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ServiceProvider } from "../../types/serviceproviders";
import { fetchApprovedAndUnblockedProviders } from "../../api/user_api";
import { Link, useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    [],
  );
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
        const providersData = await fetchApprovedAndUnblockedProviders();
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

  useEffect(() => {
    const filterProviders = () => {
      const filtered = providers.filter((provider) =>
        categories.includes(provider.service),
      );
      setFilteredProviders(filtered);
    };

    filterProviders();
  }, [providers, categories]);

  // const handleViewDetails = (providerId: string) => {
  //   navigate(`/user/sp-details/${providerId}`);
  // };

  const groupedProviders = [];
  for (let i = 0; i < filteredProviders.length; i += 3) {
    groupedProviders.push(filteredProviders.slice(i, i + 3));
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/home.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/80 z-0"></div>
        <div className="container relative z-10 text-center lg:text-left">
          <div className="row align-items-center justify-center lg:justify-start">
            <Carousel
              indicators={false}
              controls={false}
              interval={2000}
              className="py-8 w-100 md:w-6/4 mx-auto text-center shadow-lg rounded-lg"
            >
              <h5 className="mb-14">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-5xl lg:text-5xl font-bold leading-tight text-white"
                >
                  {/* Welcome to <span className="text-info">LiveCare</span> */}
                </motion.div>
              </h5>

              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <Carousel.Item key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="p-8 shadow-xl rounded-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="text-6xl font-bold text-info mb-4">
                        {category} Services
                      </div>
                      <div className="mt-4 text-lg text-white leading-relaxed italic">
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
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="p-8 shadow-xl rounded-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                  >
                    <h3 className="text-3xl font-semibold text-red-600 mb-4">
                      No Services Available
                    </h3>
                    <p className="mt-4 text-lg italic text-info leading-relaxed">
                      Please check back soon. We’re expanding our services to
                      offer the best care experience for you.
                    </p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="mt-8"
                    >
                      <button className="px-6 py-3 bg-info text-white rounded-lg text-lg font-semibold shadow-md hover:bg-blue-500 transition">
                        Book a Service
                      </button>
                    </motion.div>
                  </motion.div>
                </Carousel.Item>
              )}
            </Carousel>
            <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mt-8"
                      >
                        <Link to="/user/service-providers">
                          <button
                            className="px-6 py-3 btn btn-outline-info border-r-2 text-info rounded-lg 
                        ext-lg font-semibold shadow-md hover:bg-transparent transition flex items-center justify-center space-x-2"
                          >
                            <span>Go for a Service</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-info"
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

      {/* Services Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/register.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/80 z-0"></div>{" "}
        {/* Overlay for depth */}
        <div className="container text-center relative z-10">
          <div className="text-5xl font-bold text-white mb-12 tracking-wide">
            Our Service Providers
          </div>
          <Carousel indicators={false} controls={true} interval={2000}>
            {loading ? (
              <Carousel.Item>
                <div className="text-center text-gray-500">Loading...</div>
              </Carousel.Item>
            ) : groupedProviders.length > 0 ? (
              groupedProviders.map((providerGroup, index) => (
                <Carousel.Item key={index}>
                  <div className="row justify-content-center p-5">
                    {providerGroup.map((provider) => (
                      <div
                        key={provider._id}
                        className="col-lg-3 col-md-6 mb-4 ms-5"
                      >
                        <div className="text-center p-5">
                          <img
                            src={
                              provider.profile_picture ||
                              "https://via.placeholder.com/150"
                            }
                            alt={provider.name}
                            className="h-48 w-48 rounded-full border-4 border-blue-500 mb-4 shadow-md "
                          />
                          <h3 className="text-2xl font-bold text-primary mb-1">
                            {provider.name}
                          </h3>
                          <div className="text-base text-white mb-3">
                            {provider.specialization}
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          >
                            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300" onClick={() => handleViewDetails(provider._id)}>View Details</button> */}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))
            ) : (
              <Carousel.Item>
                <div className="text-center text-gray-500">
                  No service providers found.
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
