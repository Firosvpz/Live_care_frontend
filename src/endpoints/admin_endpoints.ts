export const admin_endpoints = {
  login: "/admin/admin-login",
  logout: "/admin/logout",
  getUsers: "/admin/users-list",
  blockUser: "/admin/block-user",
  getServiceProviders: "/admin/sp-list",
  getServiceProvidersDetails: "/admin/sp-details",
  blockServiceProvider: "/admin/block-sp",
  approveServiceProvider: "/admin/approve-sp",
  rejectServiceProvider: "/admin/reject-sp",
  addCategory: "/admin/add-category",
  getCategorys: "/admin/categorys-list",
  unlistCategory: "/admin/unlist-category",
  getBlogs: "/admin/blogs", // Endpoint for fetching blogs
  unlistBlog: "/admin/unlist-blog",
  addBlog: "/admin/add-blogs", // Add this line
  updateBlogStatus: "/admin/blog",
  getBookings: "/admin/bookings",
  getDashboard: "/admin/dashboard",
  getAllComplaints:'/admin/complaints',
  respondToComplaint:'/admin/respond-to-complaint',
};
