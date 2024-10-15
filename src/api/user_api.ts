import { user_endpoints } from "../endpoints/user_endpoints";
import Api from "./axios";
import { ServiceProvider } from "../types/serviceproviders";

export const userRegister = async (
  name: string,
  email: string,
  password: string,
  phone_number: string,
  gender: string,
) => {
  try {
    const response = await Api.post(user_endpoints.register, {
      name,
      email,
      password,
      phone_number,
      gender,
    });
    const token = response?.data.token;
    localStorage.setItem("userOtp", token);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtp = async (otp: string) => {
  try {
    const token = localStorage.getItem("userOtp");

    const response = await Api.post(
      user_endpoints.verify_otp,
      { otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("response: ", response);
    if (response?.data.success) {
      localStorage.removeItem("userOtp");
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const resendOtp = async () => {
  try {
    const token = localStorage.getItem("userOtp");
    const response = await Api.post(user_endpoints.resend_otp, "", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newToken = response.data.token;
    localStorage.setItem("userOtp", newToken);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await Api.post(user_endpoints.login, { email, password });
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
    console.log(error);
  }
};

export const googleLogin = async (idToken: string) => {
  try {
    const response = await Api.post(user_endpoints.googleLogin, { idToken });
    // console.log('es',response);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
    console.log(error);
  }
};

export const userHome = async () => {
  try {
    const response = await Api.get(user_endpoints.home);
    console.log("Data:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

interface UserDetails {
  dob: Date;
  user_address: string;
  medical_history: string;
  blood_type: string;
  profile_picture?: File[];
}

export const verfiyUserDetails = async (userDetails: UserDetails) => {
  try {
    const formData = new FormData();
    for (const key in userDetails) {
      console.log("user:", userDetails);

      if (userDetails.hasOwnProperty(key)) {
        const value = userDetails[key as keyof UserDetails];
        if (key === "profile_picture") {
          formData.append(key, (value as File[])[0]);
        } else {
          formData.append(key, value as string);
        }
      }
    }

    const response = await Api.post(user_endpoints.verifyDetails, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("lastres:", response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProfileDetails = async () => {
  try {
    const { data } = await Api.get(user_endpoints.userProfile);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (formData: any) => {
  try {
    const { data } = await Api.put(user_endpoints.editProfile, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("apidata", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const editPassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const { data } = await Api.put(user_endpoints.editPassword, {
      currentPassword,
      newPassword,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchApprovedAndUnblockedProviders = async (): Promise<
  ServiceProvider[]
> => {
  try {
    const response = await Api.get(user_endpoints.serviceProviders);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch providers:", error);    
    throw new Error("Failed to fetch providers");
  }
};

export const getServiceProviderDetails = async (id: string) => {
  try {
    console.log("gyv");

    const response = await Api.get(
      user_endpoints.getServiceProviderDetails + `/${id}`,  
    );
    console.log("res", response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchBlogs = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      `${user_endpoints.getBlogs}?page=${page}&limit=${limit}`,
    );
    return response.data; // Assumes the API response has data in the body
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
};

export const getServiceProviderSlotDetails = async (
  serviceProviderId: string,
) => {
  try {
    const response = await Api.get(
      user_endpoints.getSlotDetails + `/${serviceProviderId}`,
      {},
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getScheduledIbookings = async (page: number, limit: number) => {
  try {
    const response = await Api.get(
      user_endpoints.getScheduledBookings + `?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const makePayment = async (data: any, previousUrl: string) => {
  try {
    const response = await Api.post(user_endpoints.makePayment, {
      data,
      previousUrl,
    });
    console.log("userapires", response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const cancelBooking = async (
  bookingId: string,
  cancellationReason: string,
) => {
  try {
    const response = await Api.post(
      `${user_endpoints.cancelBooking}/${bookingId}`,
      { cancellationReason },
    );

    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await Api.post(
      user_endpoints.logout,
      {},
      {
        withCredentials: true, // Include cookies if you're using them for sessions
      },
    );

    return response.data; // Return the response data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout failed"); // Throw an error with a message
  }
};

export const getUserComplaints = async (userId: string) => {
  try {
    const { data } = await Api.get(`${user_endpoints.getComplaints}/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    throw error;
  }
};

export const fileComplaint = async (
  userId: string,
  subject: string,
  description: string
) => {
  try {
    const response = await Api.post(user_endpoints.submitComplaint, {
      userId,
      subject,
      message: description,
    });
    console.log("Complaint filed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to file complaint:", error);
    throw new Error("Failed to file complaint");
  }
};

export const addReview = async (providerId: string, rating: number, comment: string) => {
  const response = await Api.post(`/api/user/add-review`, {
    providerId,
    rating,
    comment,
  });
  return response.data;
};