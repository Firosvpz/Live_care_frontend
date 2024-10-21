import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Button, Pagination, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserHeader from "../../components/user/Header";
import TableShimmer from "../../components/common/Table";
import Footer from "../../components/common/Footer";
import { getScheduledIbookings, cancelBooking, addReview } from "../../api/user_api";
import StarRating from "../../components/user/StarRating";


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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
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


  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {  
      setErrorMessage("Review cannot be empty.");
      return;
    }
    if (selectedBooking) {
      try {
        await addReview(selectedBooking.serviceProviderId, selectedRating, reviewText); // Call the API to submit the review
        setShowReviewForm(false); // Hide the review form after submission
        setReviewText(""); // Reset the review text
        fetchScheduledBookings(currentPage, limit); // Optionally refresh bookings
      } catch (error) {
        console.error("Failed to submit review:", error);
        setErrorMessage("An error occurred while submitting the review.");
      }
    }
  };

  const handleOpenReviewForm = (booking: IScheduledBooking) => {
    setSelectedBooking(booking);
    setShowReviewForm(true);
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
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-[#595b60] to-[#0d80f3]">
                      <tr>
                        {["ROLL NAME", "SCHEDULED ON", "PRICE", "STATUS", "ACTION"].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-xs md:text-sm font-bold text-left text-white uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {loading ? (
                      <TableShimmer columns={5} />
                    ) : (
                      <tbody className="divide-y divide-gray-200">
                        {scheduledBookings.map((booking: IScheduledBooking) => (
                          <tr
                            key={booking._id}
                            className="hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer"
                          >
                            {/* Roll Name */}
                            <td className="px-4 py-4 text-xs md:text-sm font-medium text-gray-800">
                              {booking.title}
                            </td>

                            {/* Scheduled On */}
                            <td className="px-4 py-4 text-xs md:text-sm text-gray-600">
                              {new Date(booking.date).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>

                            {/* Price */}
                            <td className="px-4 py-4 text-xs md:text-sm text-gray-600">
                              <div className="flex items-center">
                                <MdOutlineCurrencyRupee className="text-blue-500 mr-1" />
                                <span>{booking.price}</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${booking.status === "Completed" ? "bg-green-100 text-green-800"
                                    : booking.status === "Scheduled" ? "bg-blue-100 text-blue-800"
                                      : booking.status === "Cancelled" ? "bg-yellow-100 text-yellow-800"
                                        : booking.status === "Expired" ? "bg-gray-100 text-gray-800"
                                          : booking.status === "Refunded" ? "bg-red-100 text-red-800"
                                            : ""}`}
                              >
                                {booking.status}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenDetailsModal(booking)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-150 ease-in-out shadow-md"
                              >
                                Booking Details
                              </button>

                              {booking.status === "Completed" && (
                                <button
                                  onClick={() => handleOpenReviewForm(booking)}
                                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-150 ease-in-out shadow-md"
                                >
                                  Leave a Review
                                </button>
                              )}

                              {booking.status !== "Completed" && (
                                <button
                                  onClick={() => handleOpenCancellationModal(booking)}
                                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-150 ease-in-out shadow-md"
                                >
                                  Cancel Booking
                                </button>
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
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          centered
          size="lg"
          className="rounded-lg shadow-lg"
        >
          <Modal.Header
            closeButton
            className="bg-gradient-to-r from-[#0d80f3] to-[#595b60] text-white"
          >
            <Modal.Title className="text-lg md:text-xl font-semibold">
              Booking Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-6 bg-gray-100">
            {selectedBooking && (
              <div className="space-y-4">
                {/* Title */}
                <h5 className="text-lg font-bold text-gray-800">{selectedBooking.title}</h5>

                {/* Description */}
                <p className="text-sm text-gray-700">{selectedBooking.description}</p>

                {/* Scheduled On */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <strong>Scheduled On:</strong>{" "}
                    {new Date(selectedBooking.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Time Slot */}
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <strong>From:</strong>{" "}
                    {new Date(selectedBooking.fromTime).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>To:</strong> {new Date(selectedBooking.toTime).toLocaleTimeString()}
                  </p>
                </div>

                {/* Price */}
                <p className="text-sm text-gray-600 flex items-center">
                  <MdOutlineCurrencyRupee className="text-blue-500 mr-1" />
                  <span className="ml-1">{selectedBooking.price}</span>
                </p>

                {/* Status */}
                <p className={`text-sm font-semibold ${selectedBooking.status === "Completed" ? "text-green-600" :
                  selectedBooking.status === "Scheduled" ? "text-blue-600" :
                    selectedBooking.status === "Cancelled" ? "text-red-600" :
                      selectedBooking.status === "Expired" ? "text-gray-600" : "text-yellow-600"
                  }`}>
                  <strong>Status:</strong> {selectedBooking.status}
                </p>

                {/* Join Call Button */}
                {selectedBooking.status === "Scheduled" &&
                  isTimeWithinSlot(selectedBooking.fromTime, selectedBooking.toTime) && (
                    <Button
                      onClick={handleJoinCall}
                      className="mt-3 bg-blue-600 text-white hover:bg-blue-700 transition ease-in-out duration-150 shadow-lg"
                    >
                      Join Call
                    </Button>
                  )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-gray-50">
            <Button
              variant="secondary"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition duration-150 ease-in-out"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Cancellation Modal */}
        <Modal
          show={showCancellationModal}
          onHide={() => setShowCancellationModal(false)}
          centered
          size="md"
          className="rounded-lg shadow-lg"
        >
          <Modal.Header
            closeButton
            className="bg-gradient-to-r from-[#d9534f] to-[#b52f29] text-white"
          >
            <Modal.Title className="text-lg md:text-xl font-semibold">
              Cancel Booking
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-6 bg-gray-100 space-y-4">
            {/* Reason for Cancellation */}
            <div>
              <p className="font-medium text-gray-700">
                Please provide a reason for cancellation:
              </p>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Write your reason here..."
              />

              {/* Error Message */}
              {errorMessage && (
                <p className="text-sm text-red-600 font-medium mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer className="bg-gray-50 flex justify-end space-x-4">
            <Button
              variant="secondary"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition duration-150 ease-in-out"
              onClick={() => setShowCancellationModal(false)}
            >
              Close
            </Button>
            <Button
              variant="danger"
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-150 ease-in-out shadow-lg"
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
      <Modal
        show={showReviewForm}
        onHide={() => setShowReviewForm(false)}
        centered
        size="lg"
        className="rounded-lg shadow-lg"
      >
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-[#0d80f3] to-[#595b60] text-white"
        >
          <Modal.Title className="text-lg md:text-xl font-semibold">
            Leave a Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6 bg-gray-100 space-y-4">
          {/* Star Rating Component */}
          <div className="flex flex-col items-center space-y-2">
            <h6 className="text-gray-800 font-semibold">Rate your experience</h6>
            <StarRating onRatingChange={setSelectedRating} />
          </div>

          {/* Review Text Area */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="form-control w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your review here..."
          />

          {/* Error Message */}
          {errorMessage && (
            <p className="text-sm text-red-600 font-medium mt-2">{errorMessage}</p>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-gray-50 flex justify-end space-x-4">
          <Button
            variant="secondary"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition duration-150 ease-in-out"
            onClick={() => setShowReviewForm(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-150 ease-in-out shadow-lg"
            onClick={handleReviewSubmit}
          >
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default OutsourcedBookings;
