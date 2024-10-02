import React, { useEffect, useState } from "react";
import {
  fetchApprovedAndUnblockedProviders,
  getProfileDetails,
} from "../../api/user_api";
import { ServiceProvider } from "../../types/serviceproviders";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";
import { AiOutlineLoading } from "react-icons/ai"; // Loading spinner icon
import { motion } from "framer-motion";
import { updateUserInfo } from "../../redux/slices/user_slice";
import { useDispatch } from "react-redux";

const ApprovedSp: React.FC = () => {
  const dispatch = useDispatch();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    [],
  );
  const navigate = useNavigate();

  // Fetch service providers on component load
  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        const providersData = await fetchApprovedAndUnblockedProviders();
        setProviders(providersData);
        setFilteredProviders(providersData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadServiceProviders();
  }, []);

  // Filter providers based on search term
  useEffect(() => {
    const filterProviders = () => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = providers.filter((provider) => {
        return (
          provider.name.toLowerCase().includes(lowercasedSearchTerm) ||
          provider.service.toLowerCase().includes(lowercasedSearchTerm)
        );
      });
      setFilteredProviders(filtered);
    };

    filterProviders();
  }, [searchTerm, providers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchUserInfo = async () => {
    const response = await getProfileDetails();
    if (response.success) {
      dispatch(updateUserInfo(response.data));
      return response.data;
    }
    return null;
  };

  const handleViewDetails = async (providerId: string) => {
    navigate(`/user/sp-details/${providerId}`);
  };

  const handleSlotDetails = async (serviceProviderId: string) => {
    const userInfo = await fetchUserInfo();
    console.log("userinfo", userInfo);

    if (userInfo.hasCompletedDetails !== true) {
      navigate(`/user/verify-userdetails`);
    } else {
      navigate(`/user/slot-details/${serviceProviderId}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <>
      <UserHeader />
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat py-24 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('../../images/login.jpg')",
        }}
      >
        <div className="flex-grow p-6 bg-gray-100 bg-opacity-70 backdrop-blur-lg">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold mb-8 text-gray-800">
              Service Providers
            </div>

            {/* Search Filter */}
            <div className="w-full max-w-md mb-6">
              <input
                type="text"
                placeholder="Search by name, service"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-md"
              />
            </div>

            {/* Cards for displaying providers */}
            <div className="container">
              <div className="row">
                {filteredProviders.length > 0 ? (
                  filteredProviders.map((provider) => (
                    <div key={provider._id} className="col-md-4 mb-4 ">
                      <div className="card h-100 shadow-lg border border-gray-200  bg-gray-100 rounded-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="p-4 flex flex-col items-center  bg-opacity-90 rounded-lg">
                          <img
                            src={
                              provider.profile_picture ||
                              "https://via.placeholder.com/60"
                            }
                            alt={provider.name}
                            className="h-16 w-16 rounded-full border-2 border-blue-500 shadow-md"
                          />
                          <div className="text-center mt-4">
                            <h5 className="text-xl font-semibold text-gray-700">
                              {provider.name}
                            </h5>
                            <p className="text-sm text-gray-500">
                              <strong>Service:</strong> {provider.service}
                            </p>
                            <p className="text-sm text-gray-500">
                              <strong>Specialization:</strong>{" "}
                              {provider.specialization}
                            </p>
                          </div>

                          {/* Flexbox container for buttons */}
                          <div className="mt-4 flex space-x-4">
                            <button
                              className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md"
                              onClick={() => handleViewDetails(provider._id)}
                            >
                              View Details
                            </button>

                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                onClick={() => handleSlotDetails(provider._id)}
                              >
                                View Slots
                              </button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No service providers found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApprovedSp;
