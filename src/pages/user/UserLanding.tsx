import React, { useEffect } from "react";
import UserHeader from "../../components/user/Header";
import Api from "../../api/axios"; // Ensure correct import path
import { useNavigate } from "react-router-dom";

const UserLanding: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Api.get("/user-home"); // This should trigger the interceptor if authentication fails
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      <UserHeader />
      <h1>Hello</h1>
    </>
  );
};

export default UserLanding;
