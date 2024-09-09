import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/common_pages/Home";
import About from "../pages/common_pages/About";
import Services from "../pages/common_pages/Services";
import Contact from "../pages/common_pages/Contact";
import Blogs from "../pages/common_pages/Blogs";
import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import UserOtp from "../pages/user/UserOtp";
import UserLanding from "../pages/user/UserLanding";
import ServiceProviderLogin from "../pages/service_provider/SpLogin";
import ServiceProviderRegister from "../pages/service_provider/SpRegister";
import ServiceProviderOtp from "../pages/service_provider/SpOtp";
import ServiceProviderLanding from "../pages/service_provider/spLanding";
import ServiceProviderDetails from "../pages/service_provider/spVerifyDetails";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import UsersList from "../pages/admin/UsersList";
const CommonRoutes: React.FC = () => {
  return (
    <Routes>
      {/* common routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/contacts" element={<Contact />} />
      
      {/* user routes */}
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/user/verify-user-otp" element={<UserOtp />} />
      <Route path="/user-home" element={<UserLanding />} />
      
      {/* service provider routes */}
      <Route path="/sp-login" element={<ServiceProviderLogin />} />
      <Route path="/sp-register" element={<ServiceProviderRegister />} />
      <Route path="/sp/verify-sp-otp" element={<ServiceProviderOtp />} />
      <Route path="/sp/verify-details" element={<ServiceProviderDetails />} />
      <Route path="/sp/sp-home" element={<ServiceProviderLanding />} />

      {/* admin routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users-list" element={<UsersList />} />
    </Routes>
  );
};
export default CommonRoutes;
