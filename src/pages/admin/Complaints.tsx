import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchComplaints, respondToComplaint } from "../../api/admin_api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminHeader";
import Footer from "../../components/common/Footer";


const ComplaintsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);

  // State for response management
  const [response, setResponse] = useState<string>("");
  const [responseError, setResponseError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "responded" | "unresponded">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [complaintsPerPage] = useState<number>(10);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
      } catch (err) {
        setError("Failed to load complaints");
        console.error("Error loading complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const handleRespondClick = (complaint: any) => {
    setSelectedComplaint(complaint);
    Swal.fire({
      title: "Respond to Complaint",
      input: "textarea",
      inputPlaceholder: "Write your response here...",
      inputAttributes: {
        "aria-label": "Write your response here...",
      },
      showCancelButton: true,
      confirmButtonText: "Submit Response",
      cancelButtonText: "Close",
      inputValidator: (value) => {
        if (!value || value.length < 15) {
          return "Response must be at least 15 characters long.";
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          console.log("Sending response:", {
            complaintId: complaint._id,
            response: result.value,
          });
          await respondToComplaint({
            complaintId: complaint._id,
            response: result.value,
          });
          Swal.fire("Response sent successfully");
          setSelectedComplaint(null);
          setResponse("");
          const data = await fetchComplaints();
          setComplaints(data);
        } catch (err) {
          console.error("Error sending response:", err);
          Swal.fire("Failed to send response");
        }
      }
    });
  };

  const getFilteredComplaints = () => {
    if (filter === "responded") {
      return complaints.filter((complaint) => complaint.isResolved);
    } else if (filter === "unresponded") {
      return complaints.filter((complaint) => !complaint.isResolved);
    }
    return complaints;
  };

  const getPaginatedComplaints = () => {
    const startIndex = (currentPage - 1) * complaintsPerPage;
    const endIndex = startIndex + complaintsPerPage;
    return getFilteredComplaints().slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    getFilteredComplaints().length / complaintsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  if (error)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        {error}
      </div>
    );

  return (
    <>
       <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          padding: "20px",
          backgroundImage:
            "url('')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background for contrast
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "white",
            }}
          >
            Complaints
          </h1>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#45a049")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4CAF50")
              }
            >
              All
            </button>
            <button
              onClick={() => setFilter("responded")}
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976D2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2196F3")
              }
            >
              Responded
            </button>
            <button
              onClick={() => setFilter("unresponded")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#d32f2f")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f44336")
              }
            >
              Unresponded
            </button>
          </div>

          {getPaginatedComplaints().length === 0 ? (
            <div
              style={{ textAlign: "center", marginTop: "20px", color: "white" }}
            >
              No complaints found.
            </div>
          ) : (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Subject
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Message
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Resolved
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedComplaints().map((complaint) => (
                    <tr key={complaint._id}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {complaint._id}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {complaint.subject}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {complaint.message}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          color: complaint.isResolved ? "green" : "red", // Conditional color based on resolution status
                        }}
                      >
                        {complaint.isResolved ? "Yes" : "No"}
                      </td>{" "}
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {!complaint.isResolved ? (
                          <button
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#2196F3",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleRespondClick(complaint)}
                          >
                            Respond
                          </button>
                        ) : (
                          <span style={{ color: "green" }}>Resolved</span> // Changed to a span with green color
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    marginRight: "5px",
                    padding: "10px 15px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Previous
                </button>
                <span
                  style={{
                    alignSelf: "center",
                    margin: "0 10px",
                    color: "white",
                  }}
                >{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    marginLeft: "5px",
                    padding: "10px 15px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ComplaintsPage;