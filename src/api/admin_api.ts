import { admin_endpoints } from "../endpoints/admin_endpoints";
import Api from "./axios";

export const verifyAdminLogin = async (email: string, password: string) => {
  try {
    const response = await Api.post(admin_endpoints.login, { email, password });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      admin_endpoints.getUsers + `?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const blockUser = async (userId: string) => {
  try {
    const response = await Api.put(admin_endpoints.blockUser + `/${userId}`);
    console.log("block", response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getServiceProviders = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      admin_endpoints.getServiceProviders + `?page=${page}&limit=${limit}`,
    );
    console.log("spresponse", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const blockServiceProvider = async (id: string) => {
  try {
    const response = await Api.put(
      admin_endpoints.blockServiceProvider + `/${id}`,
    );
    console.log("respo", response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

interface categoryData {
  categoryName: string;
  subCategories: string[];
}
export const addCategory = async (categoryData: categoryData) => {
  try {
    console.log(categoryData);
    const { categoryName, subCategories } = categoryData;

    const response = await Api.post(admin_endpoints.addCategory, {
      categoryName,
      subCategories,
    });
    return response.data;
  } catch (error: any) {
    console.log("Error adding category", error);
    if (error.response) {
      console.log(error.response);
      return error.response.data;
    } else {
      throw new Error("Failed to add category");
    }
  }
};

export const getCategorys = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      admin_endpoints.getCategorys + `?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching categoy");
  }
};

export const unlistCategory = async (categoryId: string) => {
  try {
    const response = await Api.put(
      admin_endpoints.unlistCategory + `/${categoryId}`,
    );
    console.log("resp: ", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getServiceProviderDetails = async (id: string) => {
  try {
    const response = await Api.get(
      admin_endpoints.getServiceProvidersDetails + `/${id}`,
    );
    console.log("res", response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const approveServiceProvider = async (serviceProviderId: string) => {
  try {
    // console.log("gv", serviceProviderId);

    const response = await Api.put(
      admin_endpoints.approveServiceProvider + `/${serviceProviderId}`,
    );
    return response;
  } catch (error) {
    console.log("Error in approving ServiceProvider");
  }
};

export const rejectServiceProvider = async (serviceProviderId: string) => {
  try {
    console.log("gv", serviceProviderId);

    const response = await Api.put(
      admin_endpoints.rejectServiceProvider + `/${serviceProviderId}`,
    );
    return response;
  } catch (error) {
    console.log("Error in rejecting ServiceProvider");
  }
};

export const getBlogs = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      admin_endpoints.getBlogs + `?page=${page}&limit=${limit}`,
    );
    console.log("Fetched blogs:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return { success: false, data: [], total: 0 }; // Ensure it returns a consistent structure
  }
};

export const unlistBlog = async (blogId: string) => {
  try {
    const response = await Api.put(admin_endpoints.unlistBlog + `/${blogId}`);
    console.log("Response from unlisting:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error unlisting blog:", error);
    throw error; // Ensure errors are thrown so they can be caught in the component
  }
};

export const addBlog = async (formData: FormData) => {
  try {
    const response = await Api.post(admin_endpoints.addBlog, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error adding blog", error);
    if (error.response) {
      console.log(error.response);
      return error.response.data;
    } else {
      throw new Error("Failed to add blog");
    }
  }
};

export const updateBlogStatus = async (blogId: string, isListed: boolean) => {
  try {
    const response = await Api.put(
      `${admin_endpoints.updateBlogStatus}/${blogId}`,
      { isListed },
    );
    return response.data;
  } catch (error) {
    console.log("Error updating blog status:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const getBookings = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      `${admin_endpoints.getBookings}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch bookings");
  }
};

export const getDashboardDetails = async () => {
  try {
    const { data } = await Api.get(admin_endpoints.getDashboard);
    console.log("dfgg", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchComplaints = async () => {
  try {
    const response = await Api.get(`${admin_endpoints.getAllComplaints}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};

interface RespondToComplaintParams {
  complaintId: string;
  response: string;
}

export const respondToComplaint = async ({
  complaintId,
  response,
}: RespondToComplaintParams) => {
  try {
    const res = await Api.put(
      `${admin_endpoints.respondToComplaint}/${complaintId}`,
      { responseMessage: response }
    );
    console.log("res", res);

    return res.data;
  } catch (error) {
    console.error("Error responding to complaint:", error);
    throw new Error("Failed to respond to complaint");
  }
};
