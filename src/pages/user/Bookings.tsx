import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Button, Pagination, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserHeader from "../../components/user/Header";
import TableShimmer from "../../components/common/Table";
import Footer from "../../components/common/Footer";
import { getScheduledIbookings, cancelBooking } from "../../api/user_api";

export interface IScheduledBooking {
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
}

const OutsourcedBookings = () => {
  const [scheduledBookings, setScheduledBookings] = useState<IScheduledBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IScheduledBooking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const navigate = useNavigate();

  const checkAndUpdateStatus = (booking: IScheduledBooking) => {
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
      const updatedBookings = response.data.map((booking: IScheduledBooking) =>
        checkAndUpdateStatus(booking)
      );
      setScheduledBookings(updatedBookings);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      setErrorMessage("Cancellation reason is required.");
      return;
    }
    if (cancellationReason.length < 15) {
      setErrorMessage("Cancellation reason must be at least 15 characters.");
      return;
    }

    if (selectedBooking) {
      try {
        await cancelBooking(selectedBooking._id, cancellationReason);
        setShowCancellationModal(false);
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        setErrorMessage("An error occurred while cancelling the booking.");
      }
    }
  };

  const handleOpenCancellationModal = (booking: IScheduledBooking) => {
    setSelectedBooking(booking);
    setCancellationReason(""); // Reset cancellation reason when opening modal
    setShowCancellationModal(true);
  };

  const handleOpenDetailsModal = (booking: IScheduledBooking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleJoinCall = () => {
    if (selectedBooking) {
      console.log(
        "Room IDs:",
        selectedBooking.roomId,
        "User IDs:",
        selectedBooking.userId
      );

      navigate(
        `/user/video-call/${selectedBooking.roomId}/${selectedBooking.userId}`
      );
    }
  };

  const isTimeWithinSlot = (fromTime: string, toTime: string): boolean => {
    const currentTime = new Date();
    const startTime = new Date(fromTime);
    const endTime = new Date(toTime);

    return currentTime >= startTime && currentTime <= endTime;
  };

  const isCancellationAllowed = (fromTime: Date) => {
    const currentTime = new Date();
    const bookingTime = new Date(fromTime);
    const hoursDifference = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= 24; // Allows cancellation only if there's more than 24 hours before the booking
  };

  useEffect(() => {
    fetchScheduledBookings(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <UserHeader />
      <div
        style={{
          backgroundImage: `url('../../images/register.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="max-w-7xl text-[#070913] mx-auto w-full">
          <h1 className="text-2xl font-bold text-center mb-5 text-[#333]">Bookings List</h1>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="overflow-hidden border rounded-lg shadow-lg bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#595b60] to-[#0d80f3]">
                      <tr>
                        {["ROLL NAME", "SCHEDULED ON", "PRICE", "STATUS", "ACTION"].map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-2 py-3 text-xs md:text-sm font-bold text-left text-white uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {loading ? (
                      <TableShimmer columns={5} />
                    ) : (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {scheduledBookings.map((booking: IScheduledBooking) => (
                          <tr
                            key={booking._id}
                            className="hover:bg-blue-50 transition-colors duration-200 ease-in-out cursor-pointer"
                          >
                            <td className="px-2 py-3 text-xs md:text-sm font-medium text-gray-800 whitespace-nowrap">
                              {booking.title}
                            </td>
                            <td className="px-2 py-3 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                              {new Date(booking.date).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-2 py-3 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                              <div className="flex items-center">
                                <MdOutlineCurrencyRupee className="text-blue-500 mr-1" />
                                <span>{booking.price}</span>
                              </div>
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "Scheduled"
                                      ? "bg-blue-100 text-blue-800"
                                      : booking.status === "Cancelled"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : booking.status === "Expired"
                                          ? "bg-gray-100 text-gray-800"
                                          : booking.status === "Refunded"
                                            ? "bg-red-100 text-red-800"
                                            : ""
                                  }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenDetailsModal(booking)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-150 ease-in-out shadow-md"
                              >
                                Booking Details
                              </button>
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap">
                              {booking.status === "Refunded" ? (
                                <span className="text-red-600">Refunded</span>
                              ) : booking.status === "Cancelled" ? (
                                <span className="text-red-600">You are eligible for a refund</span>
                              ) : booking.status === "Expired" ? (
                                <span className="text-red-600">Expired</span>
                              ) : booking.status === "Completed" ? (
                                <span className="text-gray-500">Booking Completed</span> 
                              ) : (
                              <>
                                <button
                                  onClick={() => handleOpenCancellationModal(booking)}
                                  className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                                  disabled={booking.status === "Completed"} // Disable button for completed bookings
                                >
                                  Cancel Booking
                                </button>
                              </>
                             )}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                  <Pagination
                    className="mt-4"
                    currentPage={currentPage}
                    totalCount={scheduledBookings.length}
                    pageSize={limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details Modal */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking && (
              <div>
                <h5>{selectedBooking.title}</h5>
                <p>{selectedBooking.description}</p>
                <p>Scheduled On: {new Date(selectedBooking.date).toLocaleDateString()}</p>
                <p>From: {new Date(selectedBooking.fromTime).toLocaleTimeString()}</p>
                <p>To: {new Date(selectedBooking.toTime).toLocaleTimeString()}</p>
                <p>
                  Price: <MdOutlineCurrencyRupee /> {selectedBooking.price}
                </p>
                <p>Status: {selectedBooking.status}</p>

                {/* Join Call Button */}
                {selectedBooking.status === "Scheduled" && isTimeWithinSlot(selectedBooking.fromTime, selectedBooking.toTime) && (
                  <Button onClick={handleJoinCall} className="mt-3" variant="primary">
                    Join Call
                  </Button>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Cancellation Modal */}
        <Modal show={showCancellationModal} onHide={() => setShowCancellationModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>Please provide a reason for cancellation:</p>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancellationModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={handleCancelBooking}>
              Confirm Cancellation
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default OutsourcedBookings;
