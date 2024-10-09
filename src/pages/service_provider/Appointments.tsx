import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { MdVideoCameraBack } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";
import {
  getScheduledIbookings,
  leaveAndRefund,
  processRefund,
  updateBookingStatus,
} from "../../api/sp_api";
import SpHeader from "../../components/serviceprovider/SpHeader";
import { Button, Modal, Pagination } from "react-bootstrap";
import TableShimmer from "../../components/common/Table";
import Footer from "../../components/common/Footer";

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
}

const ScheduledBookings = () => {
  const [scheduledBookings, setScheduledBookings] = useState<ScheduledBooking[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<ScheduledBooking | null>(null);
  const [refundProcessing, setRefundProcessing] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showReasonInputModal, setShowReasonInputModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleRefund = async () => {
    if (selectedBooking) {
      setRefundProcessing(true);
      try {
        await processRefund(selectedBooking._id, selectedBooking.price);
        toast.success("Refund processed successfully");
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        toast.error("An error occurred while processing the refund");
      } finally {
        setRefundProcessing(false);
        setShowRefundModal(false);
      }
    }
  };

  const handleCancelBooking = () => {
    setShowCancelConfirmModal(true);
  };

  const handleCancelConfirmed = () => {
    setShowCancelConfirmModal(false);
    setShowReasonInputModal(true);
  };

  const handleReasonEntered = async () => {
    if (selectedBooking) {
      try {
        await leaveAndRefund(selectedBooking._id, cancelReason);
        await updateBookingStatus(selectedBooking._id, "Cancelled");
        await processRefund(selectedBooking._id, selectedBooking.price);
        toast.success("Booking canceled and refund processed successfully");
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        toast.error("An error occurred while processing the cancellation");
      } finally {
        setShowReasonInputModal(false);
      }
    }
  };

  const checkAndUpdateStatus = (booking: ScheduledBooking) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(booking.toTime);

    if (bookingEndTime < currentTime && booking.status === "Scheduled") {
      booking.status = "Expired";
    }

    return booking;
  };

  const fetchScheduledBookings = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getScheduledIbookings(page, limit);
      const updatedBookings = response.data.map((booking: ScheduledBooking) =>
        checkAndUpdateStatus(booking)
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
    [navigate]
  );

  const handleMarkAsCompleted = async () => {
    if (selectedBooking) {
      try {
        await updateBookingStatus(selectedBooking._id, "Completed");
        toast.success("Booking marked as completed successfully");
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        toast.error("Error updating booking status");
      } finally {
        setShowCompletedModal(false);
      }
    }
  };

  useEffect(() => {
    fetchScheduledBookings(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <SpHeader />
      <div
        style={{
          backgroundImage: `url('../../images/home.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Scheduled Bookings
              </h1>
              <p className="text-gray-600">See information about all bookings</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From-To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              {loading ? (
                <TableShimmer columns={5} />
              ) : (
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduledBookings.map((booking) => {
                    const currentTime = new Date();
                    const fromTime = new Date(booking.fromTime);
                    const toTime = new Date(booking.toTime);
                    const isWithinSchedule =
                      currentTime >= fromTime && currentTime <= toTime;
                    const isExpired = currentTime > toTime;

                    return (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaRegClock className="h-5 w-5 mr-2 text-red-400" />
                            {new Date(booking.fromTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            {" - "}
                            {new Date(booking.toTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full">
                            {booking.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              booking.status === "Expired"
                                ? "bg-gray-100 text-gray-800"
                                : booking.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isWithinSchedule && (
                            <Button
                              variant="success"
                              onClick={() =>
                                handleStartCall(
                                  booking.roomId,
                                  booking.serviceProviderId
                                )
                              }
                              className="me-2"
                            >
                              <MdVideoCameraBack className="h-5 w-5 mr-1" />
                              Start Call
                            </Button>
                          )}
                          {booking.status === "Completed" ? null : (
                            <>
                              <Button
                                variant="danger"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  handleCancelBooking();
                                }}
                                className="me-2"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCompletedModal(true);
                                }}
                              >
                                Mark Completed
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>

            <Pagination className="p-3 d-flex justify-content-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>

        <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Refund</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to refund this booking?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleRefund}
              disabled={refundProcessing}
            >
              {refundProcessing ? "Processing..." : "Refund"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showReasonInputModal}
          onHide={() => setShowReasonInputModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Enter Cancellation Reason</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              className="form-control"
              placeholder="Enter the reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={handleReasonEntered}
              disabled={refundProcessing}
            >
              {refundProcessing ? "Processing..." : "Submit Reason"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showCancelConfirmModal}
          onHide={() => setShowCancelConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this booking? This will also trigger
            a refund.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCancelConfirmModal(false)}
            >
              Close
            </Button>
            <Button variant="danger" onClick={handleCancelConfirmed}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showCompletedModal}
          onHide={() => setShowCompletedModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Completion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure this booking is completed?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCompletedModal(false)}
            >
              Close
            </Button>
            <Button variant="success" onClick={handleMarkAsCompleted}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Footer />
      </div>
    </>
  );
};

export default ScheduledBookings;
