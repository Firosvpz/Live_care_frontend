import { user_endpoints } from "../endpoints/user_endpoints";
import Api from "./axios";

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

export const userHome = async () => {
  try {
    const response = await Api.get(user_endpoints.home);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
