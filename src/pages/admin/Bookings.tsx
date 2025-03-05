import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import { getBookings } from "../../api/admin_api";
import "../../css/admin/bookings.css";

interface Booking {
  _id: string;
  date: string;
  fromTime: string;
  toTime: string;
  title: string;
  serviceProviderId: {
    _id: string;
    name: string;
  };
  userId: {
    _id: string;
    name: string;
  };
  status: string;
  price: number;
}

const AdminBookingList: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [startDate] = useState<string>(""); // Start date state
  const [endDate] = useState<string>(""); // End date state
  const [statusFilter] = useState<string>("All"); // Status filter state
  const limit = 10; // Number of items per page

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings(page, limit);
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page]); // Re-fetch data when page changes

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setStartDate(e.target.value);
  // };

  // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEndDate(e.target.value);
  // };

  // const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setStatusFilter(e.target.value);
  // };

  // Convert date strings to Date objects for comparison
  const isWithinDateRange = (bookingDate: string) => {
    const bookingDateObj = new Date(bookingDate);
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    if (startDateObj && bookingDateObj < startDateObj) return false;
    if (endDateObj && bookingDateObj > endDateObj) return false;

    return true;
  };

  // Filter bookings based on search query, date range, and status
  const filteredBookings = bookings
    .filter((booking) =>
      booking.serviceProviderId?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    .filter((booking) => isWithinDateRange(booking.date))
    .filter(
      (booking) => statusFilter === "All" || booking.status === statusFilter,
    ); // Filter by status

  if (loading)
    return (
      <Container className="text-center my-5" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error)
    return (
      <Container className="my-5" style={{ minHeight: "80vh" }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <>
      <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="booking-list-container">
        <Container className="booking-list">
          <h1 className="title">Booking Lists</h1>

          {/* Search input for filtering by service provider */}
          <Form.Group controlId="searchServiceProvider" className="mb-3">
            <Form.Label className="form-label">
              Search Service Provider
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter service provider's name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control"
            />
          </Form.Group>

          <Table responsive striped bordered hover className="booking-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Title</th>
                <th>Service Provider</th>
                <th>User</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{new Date(booking.fromTime).toLocaleTimeString()}</td>
                    <td>{new Date(booking.toTime).toLocaleTimeString()}</td>
                    <td>{booking.title}</td>
                    <td>
                      {booking.serviceProviderId
                        ? booking.serviceProviderId.name
                        : "Unknown"}
                    </td>
                    <td>{booking.userId ? booking.userId.name : "Unknown"}</td>
                    <td>
                      <span
                        className={`badge ${
                          booking.status === "Scheduled"
                            ? "badge-scheduled"
                            : booking.status === "Completed"
                              ? "badge-completed"
                              : booking.status === "Cancelled"
                                ? "badge-cancelled"
                                : booking.status === "Refunded"
                                  ? "badge-refunded"
                                  : "badge-default"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>${booking.price.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination controls */}
          <div className="pagination-controls">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="pagination-button"
            >
              Previous
            </Button>
            <span className="pagination-text">Page {page}</span>
            <Button onClick={handleNextPage} className="pagination-button">
              Next
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AdminBookingList;
