import { user_endpoints } from "../endpoints/user_endpoints";
import { AxiosResponse } from "axios";
import Api from "./axios";

export const user_register = async (
    name: string,
    email: string,
    password: string,
    phone_number: string,
    gender: string,
) => {
    try {
        // Make the API request
        const response = await Api.post(user_endpoints.register, {
            name,
            email,
            password,
            phone_number,
            gender,
        });
        console.log("Apiresponse:", response);

        const token = response?.data.token;
        console.log("Apitoken:", token);

        localStorage.setItem("userOtp", token);
        return response;
    } catch (error) {
        // Handle errors
        console.error("Error in user_register:", error);
        return {
            success: false,
            message: "An error occurred during registration.",
        };
    }
};
interface VerifyOtpResponse {
    success: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
  }
export const verify_otp = async (otp: string): Promise<VerifyOtpResponse> => {
    try {
      const token = localStorage.getItem("userOtp");
      if (!token) {
        throw new Error("No OTP token found");
      }
      const response = await Api.post(user_endpoints.verify_otp, { otp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Ensure the response is in the expected format
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to verify OTP",
        };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to verify OTP" };
    }
  };
 
export const user_login = async (email: string, password: string):Promise<AxiosResponse<any>> => {
    try {
        const response = await Api.post(user_endpoints.login, { email, password });
        // Store the access and refresh tokens
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        return response;
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "An error occurred during login.",
          } as any;
    }
};


export const user_home = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await Api.get(user_endpoints.home,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
              },
        });
        return response.data
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "An error occurred while fetching home data.",
          };
    }
}