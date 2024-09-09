import React from "react";
import { useNavigate } from "react-router-dom";
import App from "./App";
import { setupInterceptors } from "./api/axios";

const AppWrapper: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation
  setupInterceptors(navigate); // Pass the navigation to interceptors

  return <App />;
};

export default AppWrapper;
