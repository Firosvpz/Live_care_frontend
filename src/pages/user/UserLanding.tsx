import React, { useEffect } from "react";
import UserHeader from "../../components/user/Header";
import Api from "../../api/axios"; // Ensure correct import path
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed and set up

const UserLanding: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("/user/user-home");
        console.log("Data:", response.data); // Handle successful data
      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message || "An error occurred";

          if (status === 403) {
            toast.error(message, {
              style: {
                border: "1px solid #dc3545",
                padding: "16px",
                color: "#721c24", // Text color
                backgroundColor: "#f8d7da", // Background color
                fontSize: "14px", // Ensure text size is readable
              },
            });

            // Redirect to login page
            navigate("/user-login");
          } else {
            toast.error(message);
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error("Network error. Please try again later.");
        } else {
          // Something else happened in setting up the request
          toast.error("An error occurred. Please try again.");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      <UserHeader />
      <h1>Hello Welcome User</h1>
    </>
  );
};

export default UserLanding;
