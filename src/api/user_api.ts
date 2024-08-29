import Api from "../services/axios";
import user_endpoints from "../services/end_points/user_endpoints";

const register_user = async (name: string, email: string, password: string, dob: Date, phone_number: string) => {
    try {
        // console.log('hello');
        
        const response = await Api.post(user_endpoints.user_register, { name, email, password, dob, phone_number })
        console.log('res:',response);
        
        const token = response?.data.token
        localStorage.setItem('user_info', token)
        return response.data
    } catch (error) {
        console.log('error', error)
    }
}

export default register_user