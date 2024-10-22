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
import ServiceProvidersList from "../pages/admin/SpList";
import {
  UserProtectedRoute,
  PublicUserProtectedRoute,
  PublicSpProtectedRoute,
  PublicAdminProtectedRoute,
  SpProtectedRoute,
  AdminProtectedRoute,
} from "../components/ProtectedRoute";
import UserProfile from "../pages/user/UserProfile";
import CategoryManagement from "../pages/admin/Category";
import AddCategory from "../pages/admin/AddCategory";
import ServiceProviderProfile from "../pages/service_provider/SpProfile";
import SingleServiceProviderDetails from "../pages/admin/SpDetails";
import ApprovedSp from "../pages/user/ServiceProvider";
import ProviderDetails from "../pages/user/SpViewDetails";
import BlogManagement from "../pages/admin/BlogsList";
import AddBlog from "../pages/admin/AddBlogs";
import BlogList from "../pages/user/Blogs";
import ProviderAndSlotDetails from "../pages/user/SlotDetails";
import AddSlot from "../pages/service_provider/AddSlot";
import SlotsList from "../pages/service_provider/SlotList";
import EditSlot from "../pages/service_provider/EditSlot";
import PaymentSuccess from "../pages/user/SuccessPayment";
import UserDetails from "../pages/user/UserVerifyDeatils";
import OutsourcedBookings from "../pages/user/Bookings";
import ScheduledBookings from "../pages/service_provider/Appointments";
import AdminBookingList from "../pages/admin/Bookings";
import UserVideoCall from "../pages/user/VideoCall";
import ProviderVideoCall from "../pages/service_provider/SpVideoCall";
import FileComplaint from "../pages/user/FileComplaint";
import ComplaintsList from "../pages/user/Complaints";
import ComplaintsPage from "../pages/admin/Complaints";

const CommonRoutes: React.FC = () => {
  return (
    <Routes>
      {/* common routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/contacts" element={<Contact />} />

      {/* protected routes for logged-in users */}
      <Route element={<PublicUserProtectedRoute />}>
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/user/verify-user-otp" element={<UserOtp />} />
      </Route>

      {/* protected routes for logged-in service providers */}
      <Route element={<PublicSpProtectedRoute />}>
        <Route path="/sp-login" element={<ServiceProviderLogin />} />
        <Route path="/sp-register" element={<ServiceProviderRegister />} />
        <Route path="/sp/verify-sp-otp" element={<ServiceProviderOtp />} />
      </Route>

      {/* protected routes for Admin */}
      <Route element={<PublicAdminProtectedRoute />}>
        <Route path="/admin-login" element={<AdminLogin />} />
      </Route>

      {/* user routes */}
      <Route element={<UserProtectedRoute />}>
        <Route path="/user/user-home" element={<UserLanding />} />
        <Route path="/user/about" element={<About />} />
        <Route path="/user/contacts" element={<Contact />} />
        <Route path="/user/get-profile" element={<UserProfile />} />
        <Route path="/user/service-providers" element={<ApprovedSp />} />
        <Route path="/user/sp-details/:id" element={<ProviderDetails />} />
        <Route path="/user/blogs" element={<BlogList />} />
        <Route path="/user/verify-userdetails" element={<UserDetails />} />
        <Route
          path="/user/slot-details/:serviceProviderId"
          element={<ProviderAndSlotDetails />}
        />
        <Route path="/user/payment-success" element={<PaymentSuccess />} />
        <Route path="/user/get-bookings" element={<OutsourcedBookings />} />
        <Route
            path="/user/video-call/:roomId/:userId"
            element={<UserVideoCall></UserVideoCall>}
          />
           <Route path="/user/new-complaint" element={<FileComplaint />} />
           <Route path="/user/complaints" element={<ComplaintsList />} />
      </Route>

      {/* service provider routes */}
      <Route element={<SpProtectedRoute />}>
        <Route path="/sp/verify-details" element={<ServiceProviderDetails />} />
        <Route path="/sp/sp-home" element={<ServiceProviderLanding />} />
        <Route
          path="/sp/sp-profile"
          element={
            <ServiceProviderProfile
              setShowEdit={(show) => console.log("setShowEdit", show)}
              serviceProviderDetails={{
                name: "",
                phone_number: "",
                email: "",
                service: "",
                gender: "",
                qualification: "",
                exp_year: 0,
                rate: 0,
              }}
              onProfileEdit={(updatedData) =>
                console.log("onProfileEdit", updatedData)
              }
            />
          }
        />
        <Route path="/sp/add-slot" element={<AddSlot />} />
        <Route path="/sp/get-slots" element={<SlotsList />} />
        <Route path="/sp/edit-slot/:slotId" element={<EditSlot />} />
        <Route path="/sp/get-bookings" element={<ScheduledBookings />} />
        <Route path="/video-call/:roomId/:serviceProviderId" element={<ProviderVideoCall />} />
      </Route>

      {/* admin routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users-list" element={<UsersList />} />
        <Route path="/admin/sp-list" element={<ServiceProvidersList />} />
        <Route
          path="/admin/sp-list/:id"
          element={<SingleServiceProviderDetails />}
        />
        <Route path="/admin/categorys-list" element={<CategoryManagement />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/blogs" element={<BlogManagement />} />
        <Route path="/admin/add-blogs" element={<AddBlog />} />
        <Route path="/admin/bookings" element={<AdminBookingList />} />
        <Route path="/admin/complaints" element={<ComplaintsPage />} />
      </Route>

      {/* Not Found */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default CommonRoutes;
