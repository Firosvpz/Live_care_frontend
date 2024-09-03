import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
const CommonRoutes: React.FC = () => {
  return (
    <>
      <Router>
        {/* common routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contacts" element={<Contact />} />
        </Routes>
        <Routes>
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/user/verify-otp" element={<UserOtp />} />
          <Route path="/user-home" element={<UserLanding />} />
        </Routes>
        <Routes>
          <Route path="/sp-login" element={<ServiceProviderLogin/>}/>
          <Route path="/sp-register" element={<ServiceProviderRegister/>}/>
          <Route path="/sp/verify-sp-otp" element={<ServiceProviderOtp/>}/>
        </Routes>
      </Router>
       
    </>
  );
};

export default CommonRoutes;
