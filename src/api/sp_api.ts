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
}

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
    const {data} = await Api.put(sp_endpoints.editProfile, {details});
    return data
  } catch (error) {
    console.log(error);
  }
}

export const editPassword = async (currentPassword: string, newPassword: string) => {
  try {
      const {data} = await Api.put(sp_endpoints.editPassword, {currentPassword, newPassword})
      return data 
  } catch (error: any) {
      console.log(error)
      return error.response.data
  }
}