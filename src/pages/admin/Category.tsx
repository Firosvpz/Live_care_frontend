import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategorys, unlistCategory } from "../../api/admin_api";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiList,
  FiTrash2,
  FiCheckSquare,
  FiLayers,
} from "react-icons/fi";
import Pagination from "../../components/common/pagination";
import AdminNavbar from "../../components/admin/AdminHeader";
import CategoryShimmer from "../../components/common/CategoryShimmmer";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface Category {
  _id: string;
  categoryName: string;
  subCategories: string[];
  isListed: boolean;
}

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

  const fetchCategories = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getCategorys(page, limit);
      console.log(response); // Log the response to check the data structure
      if (response.success) {
        setCategories(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnlist = async (categoryId: string) => {
    const response = await unlistCategory(categoryId);
    if (response.data) {
      toast.success(
        response.data.isListed ? "Category Listed" : "Category Unlisted",
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === categoryId
            ? { ...category, isListed: !category.isListed }
            : category,
        ),
      );
    } else {
      toast.error("Failed to unlist category!");
    }
  };

  const handleUnlistClick = (category: Category) => {
    openConfirmModal(category);
  };

  const openConfirmModal = (category: Category) => {
    setSelectedCategory(category);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedCategory(null);
    setConfirmModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  useEffect(() => {
    fetchCategories(currentPage, limit);
  }, [currentPage, limit, fetchCategories]);

  const listedCategories = categories.filter((category) => category.isListed);
  const unlistedCategories = categories.filter(
    (category) => !category.isListed,
  );

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-gray-800">
              Category Management
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/admin/add-category")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center"
              >
                <FiPlus className="mr-2" /> Add Category
              </button>
              <button
                onClick={toggleModal}
                className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center"
              >
                <FiList className="mr-2" /> Unlisted Category
              </button>
            </div>
          </div>

          {/* Listed Categories */}
          <h2 className="text-2xl font-bold mb-4">Listed Categories</h2>
          {loading ? (
            <CategoryShimmer />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listedCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow hover:shadow-lg transition duration-300"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h5 className="text-xl font-semibold text-gray-800 truncate">
                      {category.categoryName}
                    </h5>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.subCategories.map((subCategory, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {subCategory}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm flex items-center">
                        <FiLayers className="mr-1" />{" "}
                        {category.subCategories.length} Sub-Category
                      </span>
                      <button
                        onClick={() => handleUnlistClick(category)}
                        className="text-red-600 hover:text-red-800 transition duration-300"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Modal for Unlisted Categories */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-bold text-gray-800">
                    Unlisted Categories
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unlistedCategories.map((category) => (
                      <div
                        key={category._id}
                        className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow hover:shadow-lg transition duration-300 flex flex-col"
                      >
                        <div className="p-4 border-b border-gray-200 flex-grow">
                          <h5 className="text-xl font-semibold text-gray-800 truncate">
                            {category.categoryName}
                          </h5>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <span className="text-gray-600 text-sm flex items-center">
                            <FiLayers className="mr-1" />
                            {category.subCategories.length} Sub-Category
                          </span>
                          <button
                            onClick={() => handleUnlistClick(category)}
                            className="text-green-600 hover:text-green-800 transition duration-300"
                          >
                            <FiCheckSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex justify-end">
                  <button
                    onClick={toggleModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {confirmModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedCategory?.isListed
                      ? "Confirm Unlisting"
                      : "Confirm Listing"}
                  </h3>
                </div>
                <div className="p-4">
                  <p>
                    Are you sure you want to{" "}
                    {selectedCategory?.isListed ? "unlist" : "list"} the
                    category "{selectedCategory?.categoryName}"?
                  </p>
                </div>
                <div className="p-4 flex justify-end">
                  <button
                    onClick={closeConfirmModal}
                    className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUnlist(selectedCategory!._id);
                      closeConfirmModal();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    {selectedCategory?.isListed ? "Unlist" : "List"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
