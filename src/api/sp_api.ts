import toast from "react-hot-toast";
import { sp_endpoints } from "../endpoints/sp_endpoints";
import Api from "./axios";


export const spRegister = async (
  name: string,
  email: string,
  password: string,
  phone_number: string,
) => {
  try {
    const response = await Api.post(sp_endpoints.register, {
      name,
      email,
      password,
      phone_number,
    });

    const token = response?.data.data;
    localStorage.setItem("spOtp", token);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const verifySpOtp = async (otp: string) => {
  try {
    const token = localStorage.getItem("spOtp");
    const response = await Api.post(
      sp_endpoints.verifyOtp,
      { otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("resssssssssssss", response);

    if (response.data.success) {
      localStorage.removeItem("spOtp");
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const resendSpOtp = async () => {
  try {
    const token = localStorage.getItem("spOtp");
    const response = await Api.post(sp_endpoints.resentOtp, "", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newToken = response.data.token;
    localStorage.setItem("spOtp", newToken);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const spLogin = async (email: string, password: string) => {
  try {
    const response = await Api.post(sp_endpoints.login, {
      email,
      password,
    });
    console.log("response: ", response);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const spHome = async () => {
  try {
    const response = await Api.get(sp_endpoints.home);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

interface ServiceProviderDetails {
  gender: string;
  service: string;
  specialization?: string;
  qualification: string;
  exp_year: number;
  profile_picture?: File[];
  rate: number;
  experience_crt?: File[];
}

export const verfiySpDetails = async (spDetails: ServiceProviderDetails) => {
  try {
    const formData = new FormData();
    for (const key in spDetails) {
      console.log("sp::::::", spDetails);

      if (spDetails.hasOwnProperty(key)) {
        const value = spDetails[key as keyof ServiceProviderDetails];
        if (key === "profile_picture" || key === "experience_crt") {
          formData.append(key, (value as File[])[0]);
        } else {
          formData.append(key, value as string);
        }
      }
    }

    const response = await Api.post(sp_endpoints.verifyDetails, formData, {
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

export const fetchCategories = async () => {
  try {
    const response = await Api.get(sp_endpoints.serviceCategorys);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const getSpProfileDetails = async () => {
  try {
    const { data } = await Api.get(sp_endpoints.getProfileDetails);
    console.log("datas:", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (details: ServiceProviderDetails) => {
  try {
    const { data } = await Api.put(sp_endpoints.editProfile, { details });
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
    const { data } = await Api.put(sp_endpoints.editPassword, {
      currentPassword,
      newPassword,
    });
    return data;
  } catch (error: any) {
    console.log(error);
    return error.response.data;
  }
};

interface Services {
  value: string;
  label: string;
}

interface SlotData {
  description: string;
  timeFrom: Date;
  timeTo: Date;
  title: string;
  status?: "open" | "booked";
  price: number;
  date: Date | null;
  services: Services[]
  
}

export const addSlot = async (slotData: SlotData) => {
  try {
    const response = await Api.post(sp_endpoints.addSlot, { slotData });
    return response.data;
  } catch (error: any) {
    console.error('Error adding slot:', error.response?.data?.message || error.message || error);
    toast.error(error.response?.data?.message || "An error occurred while adding the slot.");
  }
  
};

export const getSlotsList = async (
  page: number,
  limit: number,
  query: string
) => {
  try {
    const response = await Api.get(
      sp_endpoints.getSlots +
        `?searchQuery=${query}&page=${page}&limit=${limit}`
    );
    console.log("Backend response", response); 
    console.log("Backend responsedata", response.data);     
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getDomains = async () => {
  try {
    console.log('gvgh');
    
    const response = await Api.get(sp_endpoints.getDomains);
    return response.data;
  } catch (error: any) {
    console.error('Error adding slot:', error.response?.data?.message || error.message || error);
    toast.error(error.response?.data?.message || "An error occurred while adding the slot.");
  }
};

export const editSlot = async (slotId: string, slotData: any) => {
  try {
    const response = await Api.put(sp_endpoints.editSlot+`/${slotId}`, slotData);
    console.log("Backend response", response); 
    console.log("Backend responsedata", response.data); 


    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Error updating slot');
  }
};
