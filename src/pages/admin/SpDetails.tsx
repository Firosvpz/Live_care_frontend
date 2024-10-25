import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  approveServiceProvider,
  rejectServiceProvider,
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
import { FaArrowLeft } from "react-icons/fa";
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/common/Footer";
import { Button, Modal, Spinner } from "react-bootstrap";

// Interface for review
interface Review {
  reviewerName: string;
  rating: number;
  comment: string;
}

// Interface for service provider details
interface ServiceProviderDetails {
  name: string;
  email: string;
  phone_number: string;
  service: string;
  gender: string;
  specialization: string;
  is_approved: "Approved" | "Pending" | "Rejected";
  is_blocked: boolean;
  qualification: string;
  profile_picture: string;
  experience_crt: string;
  rate: string;
  exp_year: string;
  hasCompletedDetails: boolean;
  reviews: Review[];
  ratingAverage: number;
}

const SingleServiceProviderDetails: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [serviceProviderDetails, setServiceProviderDetails] =
    useState<ServiceProviderDetails | null>(null);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
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
        setOpenApprovalModal(false);
        toast.success("Service Provider Approved");
        fetchServiceProviderDetails(id as string);
      }
    } catch (error) {
      toast.error("Failed to approve service provider");
    }
  };

  // Handle service provider rejection
  const handleReject = async () => {
    try {
      const response = await rejectServiceProvider(id as string);
      if (response) {
        setOpenRejectModal(false);
        toast.success("Service Provider Rejected");
        fetchServiceProviderDetails(id as string);
      }
    } catch (error) {
      toast.error("Failed to reject service provider");
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
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
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
              className="max-w-7xl mx-auto bg-gradient-to-br from-teal-300 to-teal-900 shadow-lg rounded-2xl p-8 mt-4"
            >
              <button
                className="inline-flex text-sm font-medium text-gray-1000 hover:text-white mb-4"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft className="mr-2" /> Back to Home
              </button>
              <div className="md:flex">
                <ProfileSidebar serviceProvider={serviceProviderDetails} />
                <MainContent
                  serviceProvider={serviceProviderDetails}
                  onDocumentView={handleDocumentView}
                  onApprove={() => setOpenApprovalModal(true)}
                  onReject={() => setOpenRejectModal(true)}
                />
              </div>
              {/* Display reviews and average rating */}
              <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Reviews and Ratings
                </h2>
                <p className="text-white mb-2">
                  Average Rating:{" "}
                  <span className="font-semibold text-yellow-400">
                    {serviceProviderDetails.ratingAverage}
                  </span>
                  /5
                </p>
                {serviceProviderDetails.reviews.length > 0 ? (
                  serviceProviderDetails.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 mb-4 shadow-lg "
                    >
                      <p className="text-yellow-300 text-lg font-semibold">
                        Rating: {review.rating} ⭐
                      </p>
                      <p className="text-white mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No reviews yet.</p>
                )}
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-white">
              Service Provider details not found.
            </p>
          )}
          <ApprovalModal
            open={openApprovalModal}
            onClose={() => setOpenApprovalModal(false)}
            onApprove={handleApproval}
          />
          <RejectModal
            open={openRejectModal}
            onClose={() => setOpenRejectModal(false)}
            onReject={handleReject}
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
    className="md:w-1/3 h-50 bg-teal-700 text-white rounded-2xl p-3 flex flex-col items-center justify-center"
  >
    <motion.img
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      src={serviceProvider.profile_picture || "https://via.placeholder.com/150"}
      alt={serviceProvider.name}
      className="w-40 h-40 rounded-full mb-3 border-4 border-white shadow-lg"
    />
    <div>
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
  onReject: () => void;
}> = ({ serviceProvider, onDocumentView, onApprove, onReject }) => (
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
            <DocumentButton
              icon={<FiFileText />}
              label="View Experience Certificate"
              onClick={() => onDocumentView(serviceProvider.experience_crt)}
            />
            {serviceProvider.is_approved !== "Approved" &&
              serviceProvider.is_approved !== "Rejected" && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onApprove}
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReject}
                    className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                  >
                    Reject
                  </motion.button>
                </>
              )}
          </div>
        </div>
      </div>
    ) : (
      <p className="text-center text-white">
        Profile details are not complete.
      </p>
    )}
  </motion.div>
);

// Document Button Component
const DocumentButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

// Detail Item Component
const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    <div className="mr-2 text-lg">{icon}</div>
    <span className="text-lg font-semibold">{label}: </span>
    <span className="text-lg ml-1">{value}</span>
  </div>
);

// Approval Modal Component
const ApprovalModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
}> = ({ open, onClose, onApprove }) => (
  <Modal show={open} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Approve Service Provider</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Are you sure you want to approve this service provider?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onApprove}>
        Approve
      </Button>
    </Modal.Footer>
  </Modal>
);

// Reject Modal Component
const RejectModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onReject: () => void;
}> = ({ open, onClose, onReject }) => (
  <Modal show={open} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Reject Service Provider</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Are you sure you want to reject this service provider?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onReject}>
        Reject
      </Button>
    </Modal.Footer>
  </Modal>
);

export default SingleServiceProviderDetails;
