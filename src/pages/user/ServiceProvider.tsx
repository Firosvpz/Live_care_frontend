import React, { useEffect, useState } from "react";
import { fetchApprovedAndUnblockedProviders, getProfileDetails } from "../../api/user_api";
import { ServiceProvider } from "../../types/serviceproviders";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";
import { AiOutlineLoading } from "react-icons/ai"; // Loading spinner icon
import { motion } from "framer-motion";
import { updateUserInfo } from "../../redux/slices/user_slice";
import { useDispatch } from "react-redux";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";

const ApprovedSp: React.FC = () => {
  const dispatch = useDispatch();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const navigate = useNavigate();

  // Fetch service providers on component load
  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        const providersData = await fetchApprovedAndUnblockedProviders();
        setProviders(providersData);
        setFilteredProviders(providersData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadServiceProviders();
  }, []);

  // Filter providers based on search term
  useEffect(() => {
    const filterProviders = () => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = providers.filter((provider) => {
        return (
          provider.name.toLowerCase().includes(lowercasedSearchTerm) ||
          provider.service.toLowerCase().includes(lowercasedSearchTerm)
        );
      });
      setFilteredProviders(filtered);
    };
    filterProviders();
  }, [searchTerm, providers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchUserInfo = async () => {
    const response = await getProfileDetails();
    if (response.success) {
      dispatch(updateUserInfo(response.data));
      return response.data;
    }
    return null;
  };

  const handleViewDetails = async (providerId: string) => {
    navigate(`/user/sp-details/${providerId}`);
  };

  const handleSlotDetails = async (serviceProviderId: string) => {
    const userInfo = await fetchUserInfo();
    if (userInfo.hasCompletedDetails !== true) {
      navigate(`/user/verify-userdetails`);
    } else {
      navigate(`/user/slot-details/${serviceProviderId}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); 
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; 
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <span key={index} className="text-yellow-500">★</span>
          ))}
        {halfStar === 1 && <span className="text-yellow-500">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <span key={index} className="text-gray-400">☆</span>
          ))}
      </>
    );
  };

  return (
    <>
      <UserHeader />
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: "url('../../images/login.jpg')" }}
      >
        <Container className="bg-black/60 rounded-lg p-5">
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <div className="text-4xl font-bold mt-4 text-gray-100">
                Service Providers
              </div>
              <Form.Control
                type="text"
                placeholder="Search by name or service"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mt-3 p-3 shadow-sm"
              />
            </Col>
          </Row>

          {/* Table for displaying providers */}
          <Table striped bordered hover responsive className="table-dark table-striped mt-4">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Service</th>
                <th>Specialization</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <tr key={provider._id}>
                    <td>
                      <img
                        src={provider.profile_picture || "https://via.placeholder.com/60"}
                        alt={provider.name}
                        className="rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                      />
                    </td>
                    <td>{provider.name}</td>
                    <td>{provider.service}</td>
                    <td>{provider.specialization}</td>
                    <td>{renderStars(provider.ratingAverage)}</td>
                    <td>
                      <Button
                        variant="primary"
                        className="me-2"
                        onClick={() => handleViewDetails(provider._id)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleSlotDetails(provider._id)}
                      >
                        View Slots
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No service providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ApprovedSp;
