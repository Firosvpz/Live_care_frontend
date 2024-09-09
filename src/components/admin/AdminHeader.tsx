import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../css/common/Header.css";
import { adminLogout } from "../../redux/slices/admin_slice";

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
      toast.success("Logout Successful!");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {/* Sidebar Toggle Button */}
          <li className="nav-item ">
            <button
              className="btn btn-dark"
              type="button"
              onClick={handleSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
            </button>
          </li>
          <a className="navbar-brand ms-3" href="/admin/dashboard">
            Admin<span className="text-info">Panel</span>
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
