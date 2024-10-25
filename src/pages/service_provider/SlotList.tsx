import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getSlotsList,
  getSpProfileDetails,
  deleteSlot,
} from "../../api/sp_api";
// import { RootState } from '../../redux/store/store'
import { debounce } from "lodash";
import { updateServiceProviderInfo } from "../../redux/slices/sp_slice";
import Footer from "../../components/common/Footer";
import SpHeader from "../../components/serviceprovider/SpHeader";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaEdit,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

interface Schedule {
  from: string;
  to: string;
  title: string;
  price: number;
  description: string;
  status: "open" | "booked";
  services: string[];
}

interface Slot {
  _id: string;
  date: Date;
  schedule: Schedule[];
}

const SlotsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [slotsList, setSlotsList] = useState<Slot[]>([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");
  //   const providerInfo = useSelector((state: RootState) => state.spInfo.spInfo)

  const handleAddSlot = async () => {
    const refreshedProviderInfo = await fetchProviderInfo();

    if (
      !refreshedProviderInfo ||
      refreshedProviderInfo.is_approved !== "Approved"
    ) {
      setShowPopUp(true);
      return;
    }
    navigate("/sp/add-slot");
  };

  const handleEditSlot = (slotId: string) => {
    navigate(`/sp/edit-slot/${slotId}`);
  };

  const fetchProviderInfo = async () => {
    const response = await getSpProfileDetails();
    if (response.success) {
      dispatch(updateServiceProviderInfo(response.data));
      return response.data;
    }
    return null;
  };

  const fetchProviderSlotsList = async (
    page: number,
    limit: number,
    query = "",
  ) => {
    setLoading(true);
    const response = await getSlotsList(page, limit, query);
    if (response.success) {
      setSlotsList(response.data);
      setTotalPages(response.totalPages);
    } else {
      console.error("Error fetching slots:", response.message);
    }
    setLoading(false);
  };

  const debouncedFetchSlotsList = useCallback(
    debounce((page: number, limit: number, query: string) => {
      fetchProviderSlotsList(page, limit, query);
    }, 500),
    [],
  );

  useEffect(() => {
    if (location.state?.refresh) {
      fetchProviderSlotsList(currentPage, limit, searchQuery);
    } else {
      debouncedFetchSlotsList(currentPage, limit, searchQuery);
    }
  }, [currentPage, limit, searchQuery, location.state]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      search: e.target.value,
    });
  };

  const isExpired = (endDate: Date, status: string) => {
    return status === "open" && new Date() > new Date(endDate);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      search: searchQuery,
    });
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const providerInfo = await fetchProviderInfo();
      if (!providerInfo?._id) {
        Swal.fire(
          "Error",
          "Could not verify service provider information",
          "error",
        );
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await deleteSlot(providerInfo._id, slotId);

        // Update local state first
        setSlotsList((prevSlots) =>
          prevSlots.filter((slot) => slot._id !== slotId),
        );

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your slot has been deleted.",
          timer: 1500,
        });

        // Check if current page is empty
        const remainingSlots = slotsList.filter((slot) => slot._id !== slotId);
        if (remainingSlots.length === 0 && currentPage > 1) {
          // If current page is empty, go to previous page
          const newPage = currentPage - 1;
          setSearchParams({
            page: newPage.toString(),
            limit: limit.toString(),
            search: searchQuery,
          });
        } else {
          // Refresh current page
          await fetchProviderSlotsList(currentPage, limit, searchQuery);
        }
      }
    } catch (error) {
      console.error("Error in delete handler:", error);
      await Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: "An unexpected error occurred. Please try again.",
      });
      // Refresh the list to ensure consistent state
      await fetchProviderSlotsList(currentPage, limit, searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SpHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Your Upcoming Bookings!
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <button
            className="mb-4 sm:mb-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleAddSlot}
          >
            Add Slot <FaArrowRight className="ml-2" />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or date..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {slotsList.flatMap((slot) =>
                slot.schedule.map((schedule, index) => (
                  <motion.div
                    key={`${slot._id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {schedule.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(schedule.from).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FaClock className="mr-2" />
                        {new Date(schedule.from).toLocaleTimeString()} -{" "}
                        {new Date(schedule.to).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <FaDollarSign className="mr-2" />
                        {schedule.price}
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            isExpired(new Date(schedule.from), schedule.status)
                              ? "bg-gray-100 text-gray-800"
                              : schedule.status === "open"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isExpired(new Date(schedule.from), schedule.status)
                            ? "Expired"
                            : schedule.status}
                        </span>
                        {!isExpired(new Date(schedule.from), schedule.status) &&
                          schedule.status === "open" && (
                            <>
                              {/* <button
                            onClick={() => handleEditSlot(slot._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button> */}
                              <button
                                onClick={() => handleDeleteSlot(slot._id)}
                                className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Delete
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  </motion.div>
                )),
              )}
            </div>
          </AnimatePresence>
        )}

        {slotsList.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No slots available</p>
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
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      </main>

      <Footer />

      {showPopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Approval Required</h2>
            <p className="text-gray-600 mb-6">
              Your profile needs to be approved before you can add a slot.
            </p>
            <button
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowPopUp(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsList;
