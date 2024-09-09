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
        if (!response) {
            throw new Error("Data not found");
        }
        const token = response.data.data;
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
    name: string;
    email: string;
    phone_number: string;
    gender: string;
    service: string;
    specialization: string;
    qualification: string;
    exp_year: number;
    profile_picture: File[];
    rate: number;
    experience_crt: File[];
}

export const verfiySpDetails = async (spDetails: ServiceProviderDetails) => {
    try {
        const formData = new FormData();
        for (const key in spDetails) {
            console.log('sp::::::', spDetails);

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
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('lastres:',response);
            
            return response.data;
        
    } catch (error) {
        console.log(error);
    }
};
