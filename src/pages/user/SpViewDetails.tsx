import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceProviderDetails } from "../../api/user_api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiClock,
  FiBook,
  FiStar,
} from "react-icons/fi";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";
import { FaArrowLeft } from "react-icons/fa";

interface ServiceProviderDetails {
  _id: string; // Ensure _id is included in the interface
  name: string;
  email: string;
  phone_number: string;
  service: string;
  gender: string;
  specialization: string;
  is_approved: boolean;
  is_blocked: boolean;
  qualification: string;
  profile_picture: string;
  experience_crt: string;
  rate: string;
  exp_year: string;
  hasCompletedDetails: boolean;
  ratingAverage: number;
}

const ProviderDetails: React.FC = () => {
  const [serviceProviderDetails, setServiceProviderDetails] =
    useState<ServiceProviderDetails | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchServiceProviderDetails(id);
    }
  }, [id]);

  const fetchServiceProviderDetails = async (id: string) => {
    try {
      const response = await getServiceProviderDetails(id);
      if (response.success) {
        setServiceProviderDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching ServiceProvider details:", error);
      toast.error("Failed to fetch ServiceProvider details");
    }
  };

  if (!serviceProviderDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Updated the handleSlotDetails function to navigate properly
  const handleSlotDetails = async (serviceProviderId: string) => {
    navigate(`/user/slot-details/${serviceProviderId}`);
  };

  return (
    <>
      <UserHeader />
      <div
        className="min-h-screen flex justify-center items-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('../../images/login.jpg')`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl w-full rounded-xl shadow-2xl overflow-hidden bg-gradient bg-opacity-90 flex flex-col md:flex-row"
        >
          <ProfileSidebar serviceProvider={serviceProviderDetails} />
          <MainContent
            serviceProvider={serviceProviderDetails}
            onSlotDetails={handleSlotDetails} // Pass the function as a prop
          />
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

const ProfileSidebar: React.FC<{ serviceProvider: ServiceProviderDetails }> = ({
  serviceProvider,
}) => (
  <div className="md:w-1/3  bg-black/60 text-white flex flex-col items-center p-8">
    <button
      className="inline-flex items-center text-white hover:text-gray-300 mb-12 transition-all"
      onClick={() => window.history.back()}
    >
      <FaArrowLeft className="mr-2" />
      Back to Home
    </button>
    <motion.img
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      src={serviceProvider.profile_picture || "https://via.placeholder.com/150"}
      alt={serviceProvider.name}
      className="w-40 h-40 rounded-full mb-4 border-4 border-white shadow-xl"
    />
    <div className="text-3xl font-bold">{serviceProvider.name}</div>
    <div className="text-gray-200">{serviceProvider.specialization}</div>
  </div>
);

const MainContent: React.FC<{
  serviceProvider: ServiceProviderDetails;
  onSlotDetails: (serviceProviderId: string) => void; // Prop type for function
}> = ({ serviceProvider, onSlotDetails }) => (
  <div className="md:w-2/3 p-10 flex flex-col justify-center bg-black/95">
    {serviceProvider.hasCompletedDetails ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full"
      >
        <div className="text-4xl font-bold mb-6 text-gray-100 text-center">
          Professional Profile
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailItem
            icon={<FiUser className="text-2xl text-blue-400" />}
            label="Name"
            value={serviceProvider.name}
          />
          <DetailItem
            icon={<FiBriefcase className="text-2xl text-blue-400" />}
            label="Gender"
            value={serviceProvider.gender}
          />
          <DetailItem
            icon={<FiClock className="text-2xl text-blue-400" />}
            label="Years of Experience"
            value={serviceProvider.exp_year}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-blue-400" />}
            label="Service"
            value={serviceProvider.service}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-blue-400" />}
            label="Specialization"
            value={serviceProvider.specialization}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-blue-400" />}
            label="Qualification"
            value={serviceProvider.qualification}
          />
          <DetailItem
            icon={<FiStar className="text-2xl text-blue-400" />}
            label="Rating"
            value={`${serviceProvider.ratingAverage} / 5`}
          />
          <DetailItem
            icon={<FiStar className="text-2xl text-blue-400" />}
            label="Rate"
            value={`$${serviceProvider.rate}/hr`}
          />
        </div>
        {/* Ensure the button calls onSlotDetails with the correct id */}
        <button
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
          onClick={() => onSlotDetails(serviceProvider._id)} // Call the passed function
        >
          View Available Slots
        </button>
      </motion.div>
    ) : (
      <div className="text-center text-gray-500">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Incomplete Profile
        </h2>
        <p className="text-xl">
          The service provider's profile registration is incomplete.
        </p>
      </div>
    )}
  </div>
);

const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start w-full p-2">
    <div className="text-2xl mr-4">{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-100">{value}</div>
    </div>
  </div>
);

export default ProviderDetails;
