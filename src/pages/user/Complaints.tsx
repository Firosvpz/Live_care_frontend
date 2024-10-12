import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table, Pagination } from "react-bootstrap";
import { getProfileDetails, getUserComplaints } from "../../api/user_api";
import UserHeader from "../../components/user/Header";
import Footer from "../../components/common/Footer";

// Tailwind Utility Classes
const tableStyle = "min-w-full divide-y divide-gray-200 text-left ";
const buttonStyle = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
const pendingStyle = "text-red-600 font-bold";
const resolvedStyle = "text-green-600 font-bold";
const paginationButtonStyle = (isActive: boolean) =>
  `mx-1 px-4 py-2 border rounded ${isActive ? "bg-blue-500 text-white" : "bg-white text-black"}`;

const ComplaintsList: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(5);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfileAndComplaints = async () => {
      try {
        const userData = await getProfileDetails();
        if (userData && userData.success && userData.data) {
          setUserId(userData.data._id);
          const userComplaints = await getUserComplaints(userData.data._id);
          if (Array.isArray(userComplaints)) {
            setComplaints(userComplaints);
          } else {
            console.error("Complaints data not found or API response format is incorrect.");
          }
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Failed to fetch user profile or complaints:", error);
      }
    };

    fetchUserProfileAndComplaints();
  }, []);

  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
  const totalPages = Math.ceil(complaints.length / complaintsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleNewComplaint = () => {
    navigate("/user/new-complaint");
  };

  return (
   <>
    <Container fluid className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('../../images/login.jpg')" }}>
      <UserHeader />
      <Container className="flex-grow py-5 bg-white/60 bg-opacity-85 backdrop-filter backdrop-blur-lg rounded-lg shadow-md mt-4 max-w-6xl mx-auto">
        <Row>
          <Col>
            <h1 className="text-2xl font-semibold mb-4  text-center">Your Complaints</h1>
            <Button className={buttonStyle} onClick={handleNewComplaint}>
              File New Complaint
            </Button>
          </Col>
        </Row><br />
        
        {complaints.length > 0 ? (
          <Row>
            <Col>
              <Table striped bordered hover responsive className={tableStyle}>
                <thead className="bg-gray-100">
                  <tr>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  {currentComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>{complaint.subject}</td>
                      <td>{complaint.message}</td>
                      <td>
                        {complaint.isResolved ? (
                          <span className={resolvedStyle}>Resolved</span>
                        ) : (
                          <span className={pendingStyle}>Pending</span>
                        )}
                      </td>
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td>{complaint.isResolved ? complaint.response : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <p className="text-center mt-4 text-lg text-gray-600">No complaints found.</p>
            </Col>
          </Row>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i}
                className={paginationButtonStyle(currentPage === i + 1)}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
      </Container>
     
    </Container>
     <Footer />
   </>
  );
};

export default ComplaintsList;
