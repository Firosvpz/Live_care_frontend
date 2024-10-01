import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserHeader from "../../components/user/Header";
import { Pagination } from "react-bootstrap";
import TableShimmer from "../../components/common/Table";
import Footer from "../../components/common/Footer";
import { getScheduledIbookings } from "../../api/user_api";


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
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IScheduledBooking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const navigate = useNavigate();

  const checkAndUpdateStatus = (booking: IScheduledBooking) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(booking.toTime); // Use `toTime` for checking expiration

    // Check if the booking's end time is before the current time
    if (bookingEndTime < currentTime && booking.status === "Scheduled") {
      booking.status = "Expired";
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
        setShowConfirmationModal(false);
        fetchScheduledBookings(currentPage, limit);
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        setErrorMessage("An error occurred while cancelling the booking.");
      }
    }
  };

  const handleOpenModal = (booking: IScheduledBooking) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

  const handleJoinCall = () => {
    if (selectedBooking) {
      navigate(`/user/video-call/${selectedBooking.roomId}/${selectedBooking.userId}`);
    }
  };

  const isCancellationAllowed = (fromTime: Date) => {
    const currentTime = new Date();
    const bookingTime = new Date(fromTime);
    const timeDifference = bookingTime.getTime() - currentTime.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  const isTimeWithinSlot = (fromTime: string, toTime: string): boolean => {
    const currentTime = new Date();
    const startTime = new Date(fromTime);
    const endTime = new Date(toTime);
  
    return currentTime >= startTime && currentTime <= endTime;
  };

  useEffect(() => {
    fetchScheduledBookings(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
    
      <UserHeader />
      <div style={{
        backgroundImage: `url('https://www.healthymummy.com/wp-content/uploads/2016/10/Pregnant-woman-in-hospital-1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>        
        <div className="max-w-7xl text-[#070913] mx-auto w-full">
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: "20px" }}>Bookings List</h1>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="overflow-hidden border rounded-lg shadow-lg bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#595b60] to-[#0d80f3]">
                      <tr>
                        {["ROLL NAME", "SCHEDULED ON", "PRICE", "STATUS", "ACTION"].map(
                          (header) => (
                            <th
                              key={header}
                              scope="col"
                              className="px-2 py-3 text-xs md:text-sm font-bold text-left text-white uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          )
                        )}
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
                                }
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
                              <td>
                              <button
            onClick={() => handleOpenModal(booking)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Booking Details
          </button>

                              </td>
                              
          
                            </td>
                            <td className="px-2 py-3 whitespace-nowrap">
                              {booking.status === "Refunded" ? (
                                <span className="text-red-600">Refunded</span>
                              ) : booking.status === "Cancelled" ? (
                                <span className="text-red-600">You are eligible for a refund</span>
                              ) : booking.status === "Expired" ? (
                                <button
                                  disabled
                                  className="px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
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
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
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
            <div className="flex-grow"></div>
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal for Viewing Booking Details */}
      <Dialog open={openModal} size="sm" handler={() => setOpenModal(false)}>
        <DialogHeader>Booking Details</DialogHeader>
        <DialogBody divider>
          <div>
            <p className="font-bold">Category: {selectedBooking?.title}</p>
            <p className="font-bold">Scheduled On: {new Date(selectedBooking?.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p className="font-bold">From: {new Date(selectedBooking?.fromTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
            <p className="font-bold">To: {new Date(selectedBooking?.toTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
            <p className="font-bold">Description: {selectedBooking?.description}</p>
            <p className="font-bold">Price: <MdOutlineCurrencyRupee className="inline" /> {selectedBooking?.price}</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            color="red"
            onClick={() => setOpenModal(false)}
            className="mr-1"
          >
            Close
          </Button>
          {selectedBooking?.status === "Scheduled" && (
  <Button
    color="green"
    onClick={handleJoinCall}
    disabled={!isTimeWithinSlot(selectedBooking.fromTime, selectedBooking.toTime)} // Disable button outside the slot time
  >
    Join Call
  </Button>
)}

        </DialogFooter>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} size="sm" handler={() => setShowConfirmationModal(false)}>
        <DialogHeader>Cancel Booking</DialogHeader>
        <DialogBody divider>
          <div>
            <p className="font-bold">Are you sure you want to cancel this booking?</p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter cancellation reason"
              className="mt-2 w-full h-20 p-2 border rounded-lg"
            />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            color="red"
            onClick={() => setShowConfirmationModal(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleCancelBooking}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default OutsourcedBookings;