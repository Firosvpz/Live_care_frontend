import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getUsers, blockUser } from "../../api/admin_api";
import Pagination from "../../components/common/pagination";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import TableShimmer from "../../components/common/Table";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import "../../css/admin/users_list.css";

interface Users {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  is_blocked: boolean;
}

const UsersList: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Users[]>([]);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

  const handleSearch = (name: string) => {
    setSearch(name);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBlock = async (userId: string, userBlocked: boolean) => {
    try {
      const response = await blockUser(userId);
      console.log("respoblock:", response);

      if (response.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, is_blocked: !userBlocked } : user,
          ),
        );
        toast.success(
          `User ${userBlocked ? "unblocked" : "blocked"} successfully`,
        );
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating user status");
    }
  };

  const showBlockModal = (user: Users) => {
    Swal.fire({
      title: user.is_blocked ? "Unblock User" : "Block User",
      text: `Are you sure you want to ${user.is_blocked ? "unblock" : "block"} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: user.is_blocked ? "Unblock" : "Block",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleBlock(user._id, user.is_blocked);
      }
    });
  };

  const fetchUsers = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await getUsers(page, limit);
      setUsers(response.data);
      setTotalPages(Math.ceil(response.total / limit));
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  useEffect(() => {
    fetchUsers(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex flex-col items-center mx-auto p-6  rounded-lg shadow-md w-full max-w-6xl">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
          Users List
        </h1>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg mb-8 text-end">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Search for users"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FiSearch className="w-5 h-5" />
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full min-w-max">
            <thead className="bg-blue-50">
              <tr>
                {["ID", "Name", "Email", "Mobile", "Action"].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-center text-md font-bold text-red-900 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableShimmer columns={5} />
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-1000">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <FiUser className="h-5 w-5 text-red-400" />
                        <span className="text-sm font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <FiMail className="text-red-400 mr-2" />
                        <span className="text-sm text-gray-800">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <FiPhone className="text-red-400 mr-2" />
                        <span className="text-sm text-gray-800">
                          {user.phone_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => showBlockModal(user)}
                        className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out shadow-md ${
                          user.is_blocked
                            ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                            : "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                        } focus:outline-none focus:ring-2 ${
                          user.is_blocked
                            ? "focus:ring-green-500"
                            : "focus:ring-red-500"
                        }`}
                      >
                        {user.is_blocked ? (
                          <>
                            <FiUnlock className="mr-2 h-4 w-4 text-green-600" />{" "}
                            Unblock
                          </>
                        ) : (
                          <>
                            <FiLock className="mr-2 h-4 w-4 text-red-600" />{" "}
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          // className="mt-6"
        />
      </main>
    </>
  );
};

export default UsersList;
