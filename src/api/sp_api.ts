import { sp_endpoints } from "../endpoints/sp_endpoints";
import Api from "./axios";


export const sp_register = async (
    name: string,
    email: string,
    password: string,
    phone_number: string,
) => {
    try {
        // Make the API request
        const response = await Api.post(sp_endpoints.register, {
            name,
            email,
            password,
            phone_number
        });
        console.log("Apiresponse:", response);

        const token = response?.data.token;
        console.log("Apitoken:", token);

        localStorage.setItem("spOtp", token);
        return response;
    } catch (error) {
        // Handle errors
        
        console.error("Error in service provider registeration:", error);
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

export const verify_sp_otp = async (otp: string): Promise<VerifyOtpResponse> => {
    try {
        const token = localStorage.getItem("spOtp");
        if (!token) {
            throw new Error("No OTP token found");
        }
        const response = await Api.post(sp_endpoints.verify_otp, { otp }, {
            headers: { Authorization: `Bearer ${token}` },
        });
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
}