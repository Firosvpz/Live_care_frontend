import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceProviderDetails } from "../../api/user_api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiClock, FiBook } from "react-icons/fi";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";
import { FaArrowLeft } from "react-icons/fa";

interface ServiceProviderDetails {
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
}

const ProviderDetails: React.FC = () => {
  const [serviceProviderDetails, setServiceProviderDetails] =
    useState<ServiceProviderDetails | null>(null);
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

  return (
    <>
      <UserHeader />
      <div className="min-h-screen flex justify-center items-center p-6 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl w-full rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-white"
        >
          <ProfileSidebar serviceProvider={serviceProviderDetails} />
          <MainContent serviceProvider={serviceProviderDetails} />
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

const ProfileSidebar: React.FC<{ serviceProvider: ServiceProviderDetails }> = ({
  serviceProvider,
}) => (
  <div className="md:w-1/3 bg-indigo-600 text-white flex flex-col items-center p-8">
    <button
      className="inline-flex items-center text-gray-200 hover:text-white mb-12 transition-all"
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
    <h3 className="text-2xl font-bold">{serviceProvider.name}</h3>
    <p className="text-gray-200">{serviceProvider.specialization}</p>
  </div>
);

const MainContent: React.FC<{ serviceProvider: ServiceProviderDetails }> = ({
  serviceProvider,
}) => (
  <div className="md:w-2/3 p-10 flex flex-col justify-center bg-white rounded-lg shadow-lg">
    {serviceProvider.hasCompletedDetails ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full"
      >
        <div className="text-4xl font-bold mb-8 text-gray-900 text-center">
          Professional Profile
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <DetailItem
            icon={<FiUser className="text-2xl text-indigo-600" />}
            label="Name"
            value={serviceProvider.name}
          />
          {/* <DetailItem
            icon={<FiMail className="text-2xl text-indigo-600" />}
            label="Email"
            value={serviceProvider.email}
          /> */}
          {/* <DetailItem
            icon={<FiPhone className="text-2xl text-indigo-600" />}
            label="Mobile"
            value={serviceProvider.phone_number.toString()}
          /> */}
          <DetailItem
            icon={<FiBriefcase className="text-2xl text-indigo-600" />}
            label="Gender"
            value={serviceProvider.gender}
          />
          <DetailItem
            icon={<FiClock className="text-2xl text-indigo-600" />}
            label="Years of Experience"
            value={serviceProvider.exp_year}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-indigo-600" />}
            label="Service"
            value={serviceProvider.service}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-indigo-600" />}
            label="Specialization"
            value={serviceProvider.specialization}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-indigo-600" />}
            label="Qualification"
            value={serviceProvider.qualification}
          />
          <DetailItem
            icon={<FiBook className="text-2xl text-indigo-600" />}
            label="Rate"
            value={`$${serviceProvider.rate}/hr`}
          />
        </div>
      </motion.div>
    ) : (
      <div className="text-center text-gray-500">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Incomplete Profile
        </h2>
        <p className="text-xl">The service provider's profile registration is incomplete.</p>
      </div>
    )}
  </div>
);

const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start w-full">
    <div className="text-2xl mr-4">{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default ProviderDetails;
