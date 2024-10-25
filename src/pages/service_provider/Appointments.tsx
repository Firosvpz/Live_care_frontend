import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaRegClock,
  FaHistory,
  FaUserCircle,
  FaPhoneAlt,
  FaVenusMars,
  FaTint,
  FaNotesMedical,
} from "react-icons/fa";
import {
  MdVideoCameraBack,
  MdCancel,
  MdCheckCircle,
  MdAccessTime,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import {
  getScheduledIbookings,
  leaveAndRefund,
  processRefund,
  updateBookingStatus,
  getUserPreviousRecordings,
} from "../../api/sp_api";
import SpHeader from "../../components/serviceprovider/SpHeader";
import Footer from "../../components/common/Footer";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduledBooking {
  _id: string;
  date: Date;
  fromTime: Date;
  toTime: Date;
  description: string;
  title: string;
  price: number;
  serviceProviderId: string;
  userId: string;
  status: string;
  roomId: string;
  cancellationReason?: string;
  prescription?: string;
}

interface UserRecord {
  name: string;
  phone_number: string;
  gender: string;
  medical_history: string;
  blood_type: string;
}

const ScheduledBookings: React.FC = () => {
  const [scheduledBookings, setScheduledBookings] = useState<
    ScheduledBooking[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] =
    useState<ScheduledBooking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showUserRecordsModal, setShowUserRecordsModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [prescription, setPrescription] = useState("");
  const [userRecords, setUserRecords] = useState<UserRecord | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const checkAndUpdateStatus = (booking: ScheduledBooking) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(booking.toTime);
    if (bookingEndTime < currentTime && booking.status === "Scheduled") {
      return { ...booking, status: "Expired" };
    }
    return booking;
  };

  const fetchScheduledBookings = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getScheduledIbookings(page, limit);
      const updatedBookings = response.data.map((booking: ScheduledBooking) =>
        checkAndUpdateStatus(booking),
      );
      setScheduledBookings(updatedBookings);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = useCallback(
    (roomId: string, serviceProviderId: string) => {
      navigate(`/video-call/${roomId}/${serviceProviderId}`);
    },
    [navigate],
  );

  const handleCancelBooking = async () => {
    if (selectedBooking && cancelReason.trim()) {
      try {
        await leaveAndRefund(selectedBooking._id, cancelReason);
        await updateBookingStatus(selectedBooking._id, "Cancelled", "");
        await processRefund(selectedBooking._id, selectedBooking.price);
        toast.success("Booking canceled and refund processed successfully");
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        toast.error("An error occurred while processing the cancellation");
      } finally {
        setShowCancelModal(false);
        setCancelReason("");
      }
    } else {
      toast.error("Please provide a reason for cancellation");
    }
  };

  const handleMarkAsCompleted = async () => {
    if (selectedBooking && prescription.trim()) {
      try {
        await updateBookingStatus(
          selectedBooking._id,
          "Completed",
          prescription,
        );
        toast.success(
          "Booking marked as completed successfully with prescription",
        );
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        toast.error("Error updating booking status");
      } finally {
        setShowCompletedModal(false);
        setPrescription("");
      }
    } else {
      toast.error("Please enter a prescription before completing the booking");
    }
  };

  const handleViewUserRecords = async (userId: string) => {
    try {
      const records = await getUserPreviousRecordings(userId);
      setUserRecords(records.data);
      setShowUserRecordsModal(true);
    } catch (error) {
      toast.error("Failed to fetch user records");
    }
  };

  useEffect(() => {
    fetchScheduledBookings(currentPage, limit);
  }, [currentPage, limit]);

  const renderUserDetailsContent = () => {
    if (!userRecords) {
      return (
        <p className="text-center text-gray-500">No user records available</p>
      );
    }

    switch (activeTab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" />
                Name
              </h3>
              <p>{userRecords.name}</p>
            </div>
            {/* Phone Number */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaPhoneAlt className="mr-2 text-blue-500" />
                Phone Number
              </h3>
              <p>{userRecords.phone_number}</p>
            </div>
            {/* Gender */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaVenusMars className="mr-2 text-blue-500" />
                Gender
              </h3>
              <p>{userRecords.gender}</p>
            </div>
          </div>
        );

      case "medical":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medical History */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaNotesMedical className="mr-2 text-blue-500" />
                Medical History
              </h3>
              <p className="whitespace-pre-wrap">
                {userRecords.medical_history || "No medical history provided"}
              </p>
            </div>
            {/* Prescription */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaHistory className="mr-2 text-blue-500" />
                Prescription
              </h3>
              <p>
                {scheduledBookings.length > 0
                  ? scheduledBookings.map((a, b) => (
                      <span key={b}>{a.prescription}</span>
                    ))
                  : "Not provided"}
              </p>
            </div>
            {/* Blood Type */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaTint className="mr-2 text-blue-500" />
                Blood Type
              </h3>
              <p>{userRecords.blood_type || "Not provided"}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SpHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Scheduled Bookings
            </h1>
            <p className="text-gray-600">See information about all bookings</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scheduledBookings.map((booking) => {
              const currentTime = new Date();
              const fromTime = new Date(booking.fromTime);
              const toTime = new Date(booking.toTime);
              const isWithinSchedule =
                currentTime >= fromTime && currentTime <= toTime;
              const isExpired = currentTime > toTime;

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {booking.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "Expired"
                            ? "bg-gray-100 text-gray-800"
                            : booking.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <MdAccessTime className="inline-block mr-2" />
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <FaRegClock className="inline-block mr-2" />
                      {new Date(booking.fromTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(booking.toTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isWithinSchedule && (
                        <button
                          onClick={() =>
                            handleStartCall(
                              booking.roomId,
                              booking.serviceProviderId,
                            )
                          }
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <MdVideoCameraBack className="mr-2" />
                          Start Call
                        </button>
                      )}
                      {booking.status !== "Completed" && !isExpired && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <MdCancel className="mr-2" />
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCompletedModal(true);
                            }}
                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <MdCheckCircle className="mr-2" />
                            Mark Completed
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewUserRecords(booking.userId)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <FaHistory className="mr-2" />
                        View Medical Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : "bg-white  border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      </main>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Cancel Booking
                </h3>
                <div className="mt-2 px-7 py-3">
                  <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                    rows={4}
                    placeholder="Reason for cancellation"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  ></textarea>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={handleCancelBooking}
                  >
                    Confirm Cancellation
                  </button>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="cancel-btn"
                    className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed Modal */}
      <AnimatePresence>
        {showCompletedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Enter Prescription
                </h3>
                <div className="mt-2 px-7 py-3">
                  <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                    rows={4}
                    placeholder="Enter prescription here"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={handleMarkAsCompleted}
                  >
                    Mark as Completed
                  </button>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="cancel-btn"
                    className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowCompletedModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserRecordsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={() => setShowUserRecordsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  User Details
                </h2>
                <div className="mb-4 flex border-b">
                  <button
                    className={`flex items-center px-4 py-2 font-medium text-sm focus:outline-none ${
                      activeTab === "medical"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("medical")}
                  >
                    <FaNotesMedical className="mr-2" />
                    Medical History
                  </button>
                  <button
                    className={`flex items-center px-4 py-2 font-medium text-sm focus:outline-none ${
                      activeTab === "personal"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("personal")}
                  >
                    <FaUserCircle className="mr-2" />
                    Personal Info
                  </button>
                </div>
                <div className="mt-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderUserDetailsContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    onClick={() => setShowUserRecordsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ScheduledBookings;
