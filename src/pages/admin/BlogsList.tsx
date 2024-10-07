import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiEye, FiEyeOff } from "react-icons/fi";
import { getBlogs, updateBlogStatus } from "../../api/admin_api";
import Pagination from "../../components/common/pagination";
import TableShimmer from "../../components/common/Table";
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/common/Footer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Define the Blog type
interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  isListed: boolean;
}

// ConfirmationModal Component within the same file
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// BlogManagement Component
const BlogManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");

  const fetchBlogs = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getBlogs(page, limit);
      if (response.success) {
        setBlogs(response.blogs || []);
        setTotalPages(Math.ceil(response.total / limit));
      } else {
        toast.error("Failed to fetch blogs");
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleToggleStatus = (blogId: string, currentStatus: boolean) => {
    setCurrentBlogId(blogId);
    setCurrentStatus(currentStatus);
    setMessage(
      `Are you sure you want to ${currentStatus ? "unlist" : "list"} this blog?`,
    );
    setIsModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (currentBlogId) {
      try {
        const response = await updateBlogStatus(currentBlogId, !currentStatus);
        if (response.success) {
          setBlogs((prevBlogs) =>
            prevBlogs.map((blog) =>
              blog._id === currentBlogId
                ? { ...blog, isListed: !currentStatus }
                : blog,
            ),
          );
          toast.success(
            `Blog has been ${currentStatus ? "unlisted" : "listed"}`,
          );
        } else {
          toast.error("Failed to update blog status");
        }
      } catch (error) {
        toast.error("Failed to update blog status");
      }
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, limit);
  }, [currentPage, limit, fetchBlogs]);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <>
      <AdminNavbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-gray-800">
              Blog Management
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/admin/add-blogs")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-300 ease-in-out flex items-center"
              >
                <FiPlus className="mr-2" /> Add Blog
              </button>
            </div>
          </div>

          {loading ? (
            <TableShimmer columns={5} />
          ) : (
            <>
              {blogs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Blogs
                  </h2>
                  <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={false}
                    containerClass="carousel-container"
                    itemClass="px-4"
                  >
                    {blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="p-6 bg-white border border-gray-300 rounded-md shadow-sm flex flex-col justify-between"
                      >
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {blog.content.slice(0, 100)}...
                        </p>
                        <button
                          onClick={() =>
                            handleToggleStatus(blog._id, blog.isListed)
                          }
                          className={`py-2 px-4 rounded ${
                            blog.isListed
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white transition duration-300 ease-in-out`}
                        >
                          {blog.isListed ? "Unlist" : "List"}
                        </button>
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
        <Footer />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmToggleStatus}
        message={message}
      />
    </>
  );
};

export default BlogManagement;
