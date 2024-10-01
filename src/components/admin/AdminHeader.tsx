import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { adminLogout } from "../../redux/slices/admin_slice";
import "../../css/admin/admin_navbar.css"; 

interface AdminNavbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  isSidebarOpen,
  setSidebarOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(adminLogout());
      navigate("/admin-login");
      toast.success("Logout Successfully!");
    }
  };

  return (
    <nav className="glass-navbar sticky top-0 z-50 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={handleSidebarToggle}
          className="p-3 rounded-full bg-gray-900/70 text-white toggle-btn shadow-lg"
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon
            icon={isSidebarOpen ? faTimes : faBars}
            className="w-6 h-6 animate-pulse"
          />
        </button>

        {/* Navbar Brand */}
        <a
          href="/admin/dashboard"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 hover:scale-105 transition-transform duration-300"
        >
          Admin<span className="text-indigo-400">Panel</span>
        </a>

        {/* Logout Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full hover:scale-105 hover:bg-red-600 transition-transform duration-300 shadow-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
