import axios from "axios";
import store from "../redux/store/store";
import { removeUserCredential } from "../redux/slices/user_slice";

const Api = axios.create({
  baseURL: "http://localhost:4117",
  withCredentials: true,
});

export const setupInterceptors = (navigate: any) => {
  Api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        const state = store.getState();
        console.log('State:', state); // Ensure this logs the correct state
        const userInfo = state.user.userInfo;
        console.log('UserInfo:', userInfo);

        if (userInfo) {
          store.dispatch(removeUserCredential());
          navigate('/user-login');
        } else {
          console.log('No userInfo found in state');
        }
      }
      return Promise.reject(error);
    }
  );
};



export default Api;
