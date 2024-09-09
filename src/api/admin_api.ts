import { admin_endpoints } from "../endpoints/admin_endpoints";
import Api from "./axios";


export const verifyAdminLogin = async(email:string,password:string)=>{
    try {
        const response = await Api.post(admin_endpoints.login,{email,password})
        return response
    } catch (error) {
        console.log(error);
    }
}

export const getUsers = async(page:number,limit:number)=>{
    try {
        const response = await Api.get(admin_endpoints.getUsers+`?page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}

export const blockUser = async(userId:string)=>{
    try {
        const response = await Api.put(admin_endpoints.blockUser+`/${userId}`)
        console.log('block',response);
        
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}