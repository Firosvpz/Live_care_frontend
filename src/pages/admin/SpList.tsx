import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getServiceProviders, blockServiceProvider } from "../../api/admin_api";
import Pagination from "../../components/common/pagination";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import TableShimmer from "../../components/common/Table";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiPhone, FiLock, FiUnlock } from "react-icons/fi";
import "../../css/admin/users_list.css";

interface ServiceProvider {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  is_blocked: boolean;
  service: string;
  specialization: string;
  is_approved: string;
  qualification: string;
  profile_picture: string;
  experience_crt: string;
  rate: string;
}

const ServiceProvidersList: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
    [],
  );
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

  // Handle search input change
  const handleSearch = (name: string) => {
    setSearch(name);
  };

  // Filter service providers based on search input
  const filteredServiceProviders = serviceProviders.filter((provider) =>
    provider.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBlock = async (userId: string, userBlocked: boolean) => {
    try {
      // Make API call to block/unblock the service provider
      const response = await blockServiceProvider(userId);
      console.log("API Response:", response);

      // Check if the API response was successful
      if (response.success) {
        // Toggle the `is_blocked` status based on current state
        setServiceProviders((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, is_blocked: !userBlocked } : user,
          ),
        );

        // Display success toast notification
        toast.success(
          `User ${userBlocked ? "unblocked" : "blocked"} successfully`,
        );
      } else {
        // Display error toast notification if API response indicates failure
        toast.error("Failed to update user status");
      }
    } catch (error) {
      // Log any errors and show an error toast notification
      console.error("Error blocking/unblocking user:", error);
      toast.error("An error occurred while updating user status");
    }
  };

  // Show confirmation modal before blocking or unblocking a user
  const showBlockModal = (user: ServiceProvider) => {
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

  // Fetch service providers with pagination
  const fetchServiceProviders = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await getServiceProviders(page, limit);
      setServiceProviders(response.data);
      setTotalPages(Math.ceil(response.total / limit));
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch service providers");
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  // Fetch data on component mount or page/limit change
  useEffect(() => {
    fetchServiceProviders(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <AdminSidebar isOpen={isSidebarOpen} />
      <div className="container p-4">
        <main className="flex flex-col items-center ml-auto mr-0 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-center text-2xl font-semibold mb-6">
            Service Providers List
          </h1>
          <div className="w-full max-w-lg mb-8 text-end">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search for service providers"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              {loading ? (
                <TableShimmer columns={5} />
              ) : (
                <tbody className="divide-y divide-gray-200">
                  {filteredServiceProviders.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <FiUser className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <FiMail className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <FiPhone className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {user.phone_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => showBlockModal(user)}
                          className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full shadow-sm transition-all duration-300 ease-in-out ${
                            user.is_blocked
                              ? "bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:border-green-400 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              : "bg-white text-red-700 border border-red-300 hover:bg-red-50 hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          } hover:shadow-md focus:outline-none`}
                        >
                          {user.is_blocked ? (
                            <>
                              <FiUnlock className="mr-2 h-4 w-4 stroke-2" />{" "}
                              Unblock
                            </>
                          ) : (
                            <>
                              <FiLock className="mr-2 h-4 w-4 stroke-2" /> Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </main>
      </div>
    </>
  );
};

export default ServiceProvidersList;
