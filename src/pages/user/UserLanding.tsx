import React, { useState, useEffect } from "react";
import UserHeader from "../../components/user/Header";
import { getProfileDetails } from "../../api/user_api";
import Footer from "../../components/common/Footer";
import toast from "react-hot-toast";
import { fetchCategories } from "../../api/sp_api";
import { motion } from "framer-motion";
import { Carousel } from "react-bootstrap";

const UserLanding: React.FC = () => {
  const [profileData, setProfileData] = useState<{ name: string } | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        console.log("categoriesData", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getProfileDetails();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <UserHeader />
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/userLand.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/80 z-0"></div>
        <div className="container relative z-10 text-center lg:text-left">
          <div className="row align-items-center justify-center">
            <Carousel
              indicators={false}
              controls={false}
              interval={3000}
              className="py-8 w-100 md:w-6/4 mx-auto text-center shadow-lg rounded-lg"
            >
              <h5 className="mb-14">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-5xl lg:text-5xl font-bold leading-tight text-white"
                >
                  Welcome <span className="text-info">{profileData?.name}</span>
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
                      <div className="text-6xl font-bold text-info mb-4 text-center lg:text-left">
                        {category} Services
                      </div>
                      <div className="mt-4 text-lg text-white leading-relaxed italic text-center lg:text-left">
                        Discover exceptional {category} services tailored to
                        your needs. At LiveCare, we prioritize your comfort and
                        well-being with the utmost care and professionalism.
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mt-8"
                      >
                        <button className="px-6 py-3 btn btn-outline-info border-r-2 text-info rounded-lg text-lg font-semibold shadow-md hover:bg-transparent transition flex items-center justify-center space-x-2">
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
                      </motion.div>
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
                    <h3 className="text-3xl font-semibold text-red-600 mb-4 text-center lg:text-left">
                      No Services Available
                    </h3>
                    <p className="mt-4 text-lg italic text-info leading-relaxed text-center lg:text-left">
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
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-50 via-white to-gray-100 overflow-hidden">
        {/* Container for content */}
        <div className="container text-center relative z-10">
          <div className="text-5xl font-bold text-primary mb-12 tracking-wide">
            Our Premium Services
          </div>

          {/* Carousel Component */}
          <Carousel
            indicators={true}
            controls={true}
            interval={2000} // Slightly faster interval
            className="py-8"
          >
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Carousel.Item key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="row justify-center"
                  >
                    <div className="col-lg-10 col-md-8">
                      {/* Animated Content Block */}
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="p-8 bg-white shadow-xl rounded-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                      >
                        <h3 className="text-3xl font-semibold text-purple-600 mb-4">
                          {category} Services
                        </h3>
                        <p className="mt-4 text-lg text-gray-700 leading-relaxed italic">
                          Discover exceptional {category} services tailored to
                          your needs. At LiveCare, we prioritize your comfort
                          and well-being with the utmost care and
                          professionalism.
                        </p>
                      </motion.div>
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
                  className="row justify-center"
                >
                  <div className="col-lg-10 col-md-8">
                    {/* Fallback Content Block */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="p-8 bg-white shadow-xl rounded-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                      <h3 className="text-3xl font-semibold text-red-600 mb-4">
                        No Services Available
                      </h3>
                      <p className="mt-4 text-lg italic text-gray-700 leading-relaxed">
                        Please check back soon. We’re expanding our services to
                        offer the best care experience for you.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>

        {/* Background Visual Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-300 opacity-50"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 rounded-full opacity-20 mix-blend-multiply filter blur-xl"></div>
      </section>

      <Footer />
    </>
  );
};

export default UserLanding;
