import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  approveServiceProvider,
  getServiceProviderDetails,
} from "../../api/admin_api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiClock,
  FiBook,
  FiFileText,
} from "react-icons/fi";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/common/Footer";
import { Button, Spinner } from "react-bootstrap";

// Interface for service provider details
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

const SingleServiceProviderDetails: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [serviceProviderDetails, setServiceProviderDetails] =
    useState<ServiceProviderDetails | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  // Fetch service provider details on mount
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
      } else {
        throw new Error("Failed to fetch service provider details");
      }
    } catch (error) {
      toast.error("Failed to fetch service provider details");
    } finally {
      setLoading(false);
    }
  };

  // Handle service provider approval
  const handleApproval = async () => {
    try {
      const response = await approveServiceProvider(id as string);

      if (response) {
        setOpenModal(false);
        toast.success("Service Provider Approved");
        fetchServiceProviderDetails(id as string);
      }
    } catch (error) {
      toast.error("Failed to approve service provider");
    }
  };

  // Document viewing handler
  const handleDocumentView = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("Document not available");
    }
  };

  return (
    <>
      <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex min-h-screen">
        <AdminSidebar isOpen={isSidebarOpen} />
        <main className="flex-grow p-6 bg-gradient-to-br from-teal-100 via-white to-teal-50">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : serviceProviderDetails ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto bg-gradient-to-br from-teal-300 to-teal-900 shadow-lg rounded-2xl p-8 w-50 h-75 mt-4"
            >
              <button
                className=" inline-flex text-sm font-medium text-gray-1000  hover:text-white"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft className="mr-2 mb-3" /> Back to Home
              </button>
              <div className="md:flex ">
                <ProfileSidebar serviceProvider={serviceProviderDetails} />
                <MainContent
                  serviceProvider={serviceProviderDetails}
                  onDocumentView={handleDocumentView}
                  onApprove={() => setOpenModal(true)}
                />
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-white">
              Service Provider details not found.
            </p>
          )}
          <ApprovalModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onApprove={handleApproval}
          />
        </main>
      </div>
      <Footer />
    </>
  );
};

// Profile Sidebar Component
const ProfileSidebar: React.FC<{ serviceProvider: ServiceProviderDetails }> = ({
  serviceProvider,
}) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="md:w-1/3 h-50 bg-teal-700 text-white  rounded-2xl p-3 flex flex-col items-center justify-center "
  >
    <motion.img
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      src={serviceProvider.profile_picture || "https://via.placeholder.com/150"}
      alt={serviceProvider.name}
      className="w-40 h-40 rounded-full mb-3 border-4 border-white shadow-lg"
    />
    <div className="">
      <DetailItem icon={<FiUser />} label="Name" value={serviceProvider.name} />
      <DetailItem
        icon={<FiMail />}
        label="Email"
        value={serviceProvider.email}
      />
      <DetailItem
        icon={<FiPhone />}
        label="Mobile"
        value={serviceProvider.phone_number.toString()}
      />
    </div>
  </motion.div>
);

// Main Content Component
const MainContent: React.FC<{
  serviceProvider: ServiceProviderDetails;
  onDocumentView: (url?: string) => void;
  onApprove: () => void;
}> = ({ serviceProvider, onDocumentView, onApprove }) => (
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="md:w-2/3 p-8 mb-20"
  >
    {serviceProvider.hasCompletedDetails ? (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3 text-white">
          Professional Profile
        </h2>
        <DetailItem
          icon={<FiBriefcase />}
          label="Gender"
          value={serviceProvider.gender}
        />
        <DetailItem
          icon={<FiClock />}
          label="Years of Experience"
          value={serviceProvider.exp_year.toString()}
        />
        <DetailItem
          icon={<FiBook />}
          label="Specialization"
          value={serviceProvider.specialization}
        />
        <DetailItem
          icon={<FiBook />}
          label="Qualification"
          value={serviceProvider.qualification}
        />

        <div className="mt-8 space-y-4">
          <div className="flex justify-center space-x-4 mb-5">
            {" "}
            {/* Flex container for buttons */}
            <DocumentButton
              icon={<FiFileText />}
              label="View Experience Certificate"
              onClick={() => onDocumentView(serviceProvider.experience_crt)}
            />
            {/* Approve Button */}
            {!serviceProvider.is_approved && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onApprove}
                className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-transform"
              >
                Approve
              </motion.button>
            )}
          </div>
        </div>
      </div>
    ) : (
      <p className="text-white">Profile registration is incomplete.</p>
    )}
  </motion.div>
);

// Document Button Component
const DocumentButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center justify-center bg-teal-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300"
  >
    <span className="mr-2">{icon}</span>
    {label}
  </motion.button>
);

const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center mb-4 text-white">
    <div className="text-2xl mr-3">{icon}</div>
    <div className="text-left">
      <h4 className="text-lg font-semibold">{label}</h4>
      <p>{value}</p>
    </div>
  </div>
);

// Modal for Approval Confirmation
const ApprovalModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
}> = ({ open, onClose, onApprove }) => {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Confirm Approval</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to approve this service provider?
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={onApprove}>
            Approve
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleServiceProviderDetails;
