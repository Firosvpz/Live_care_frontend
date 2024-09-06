import { sp_endpoints } from "../endpoints/sp_endpoints";
import Api from "./axios";

export const spRegister = async (name: string, email: string, password: string, phone_number: string) => {
    try {
        const response = await Api.post(sp_endpoints.register, { name, email, password, phone_number })
        if (!response) {
            throw new Error("Data not found")
        }
        const token = response.data.data
        localStorage.setItem("spOtp", token);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const verifySpOtp = async (otp: string) => {
    try {
        const token = localStorage.getItem("spOtp")
        const response = await Api.post(sp_endpoints.verifyOtp, { otp }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.data.success) {
            localStorage.removeItem("spOtp")
        }
        return response

    } catch (error) {
        console.log(error);
    }
}

export const resendSpOtp = async () => {
    try {
        const token = localStorage.getItem('spOtp')
        const response = await Api.post(sp_endpoints.resentOtp, '', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const newToken = response.data.token;
        localStorage.setItem("spOtp", newToken)
        return response
    } catch (error) {
        console.log(error)
    }
}

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
        const response = await Api.get(sp_endpoints.home)
        return response.data
    } catch (error) {
        console.log(error)
    }
} 