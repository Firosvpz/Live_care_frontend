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
    console.log("gv", serviceProviderId);

    const response = await Api.put(
      admin_endpoints.approveServiceProvider + `/${serviceProviderId}`,
    );
    return response;
  } catch (error) {
    console.log("Error in approving ServiceProvider");
  }
};
