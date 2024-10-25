export const admin_endpoints = {
  login: "/api/admin/admin-login",
  logout: "/api/admin/logout",
  getUsers: "/api/admin/users-list",
  blockUser: "/api/admin/block-user",
  getServiceProviders: "/api/admin/sp-list",
  getServiceProvidersDetails: "/api/admin/sp-details",
  blockServiceProvider: "/api/admin/block-sp",
  approveServiceProvider: "/api/admin/approve-sp",
  rejectServiceProvider: "/api/admin/reject-sp",
  addCategory: "/api/admin/add-category",
  getCategorys: "/api/admin/categorys-list",
  unlistCategory: "/api/admin/unlist-category",
  getBlogs: "/api/admin/blogs", // Endpoint for fetching blogs
  unlistBlog: "/api/admin/unlist-blog",
  addBlog: "/api/admin/add-blogs", // Add this line
  updateBlogStatus: "/api/admin/blog",
  getBookings: "/api/admin/bookings",
  getDashboard: "/api/admin/dashboard",
  getAllComplaints: "/api/admin/complaints",
  respondToComplaint: "/api/admin/respond-to-complaint",
};
