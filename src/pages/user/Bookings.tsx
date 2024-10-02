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
  const [scheduledBookings, setScheduledBookings] = useState<
    IScheduledBooking[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<IScheduledBooking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const navigate = useNavigate();

  // Utility to update the status of a booking if it has expired
  const checkAndUpdateStatus = (booking: IScheduledBooking) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(booking.toTime);
    if (bookingEndTime < currentTime && booking.status === "Scheduled") {
      booking.status = "Expired";
    }
    return booking;
  };

  // Fetch bookings and update their status
  const fetchScheduledBookings = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getScheduledIbookings(page, limit);
      const updatedBookings = response.data.map((booking: IScheduledBooking) =>
        checkAndUpdateStatus(booking),
      );
      setScheduledBookings(updatedBookings);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  // Handle booking cancellation
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
        setShowConfirmationModal(false);
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        setErrorMessage("An error occurred while cancelling the booking.");
      }
    }
  };

  // Handle modal opening for booking details
  const handleOpenModal = (booking: IScheduledBooking) => {
    setSelectedBooking(booking);
    setShowConfirmationModal(true);
  };

  // Check if cancellation is allowed based on the time left before the booking
  const isCancellationAllowed = (fromTime: Date) => {
    const currentTime = new Date();
    const bookingTime = new Date(fromTime);
    const hoursDifference =
      (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
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
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Bookings List
          </h1>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="overflow-hidden border rounded-lg shadow-lg bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#595b60] to-[#0d80f3]">
                      <tr>
                        {[
                          "ROLL NAME",
                          "SCHEDULED ON",
                          "PRICE",
                          "STATUS",
                          "ACTION",
                        ].map((header) => (
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
                            onClick={() => handleOpenModal(booking)}
                          >
                            <td className="px-2 py-3 text-xs md:text-sm font-medium text-gray-800 whitespace-nowrap">
                              {booking.title}
                            </td>
                            <td className="px-2 py-3 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                              {new Date(booking.date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td className="px-2 py-3 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                              <div className="flex items-center">
                                <MdOutlineCurrencyRupee className="text-blue-500 mr-1" />
                                <span>{booking.price}</span>
                              </div>
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === "Completed"
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
                            <td className="px-2 py-3 whitespace-nowrap">
                              {booking.status === "Refunded" ? (
                                <span className="text-red-600">Refunded</span>
                              ) : booking.status === "Cancelled" ? (
                                <span className="text-red-600">
                                  You are eligible for a refund
                                </span>
                              ) : booking.status === "Expired" ? (
                                <button
                                  disabled
                                  className="px-4 py-2 bg-gray-400 text-dark rounded-lg font-semibold cursor-not-allowed"
                                >
                                  Expired
                                </button>
                              ) : (
                                isCancellationAllowed(booking.fromTime) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedBooking(booking);
                                      setShowConfirmationModal(true);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-dark rounded-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                  >
                                    Cancel Slot
                                  </button>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Pagination>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* React Bootstrap Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this booking?</p>
          <textarea
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Please provide a reason for cancellation (at least 15 characters)"
            className="w-full h-24 px-3 py-2 border rounded-lg"
          />
          {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationModal(false)}
          >
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelBooking}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OutsourcedBookings;
