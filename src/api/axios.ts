import axios from "axios";
import Swal from "sweetalert2";
import store from "../redux/store/store";
import { removeUserCredential } from "../redux/slices/user_slice";
import { removeServiceProviderCredential } from "../redux/slices/sp_slice";

const Api = axios.create({
  baseURL: "https://live-care.site",
  withCredentials: true,
});

export const setupInterceptors = (navigate: any) => {
  Api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const { status } = error.response;

        if (status === 403) {
          // Handle user authentication issues
          const userState = store.getState();
          const userInfo = userState.user.userInfo;
          console.log("User State:", userState);
          console.log("User Info:", userInfo);

          if (userInfo) {
            store.dispatch(removeUserCredential());
            Swal.fire({
              title: "Account Blocked",
              text: "Your account has been blocked. You have been logged out.",
              icon: "warning",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/user-login");
            });
          } else {
            console.log("No userInfo found in state");
          }
        } else if (status === 401) {
          // Handle service provider authentication issues
          const spState = store.getState();
          console.log("Service Provider State:", spState);
          const spInfo = spState.spInfo.spInfo;
          console.log("Service Provider Info:", spInfo);

          if (spInfo) {
            store.dispatch(removeServiceProviderCredential());
            Swal.fire({
              title: "Account Blocked",
              text: "Your account has been blocked. You have been logged out.",
              icon: "warning",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/sp-login");
            });
          } else {
            console.log("No Service Provider Info found in state");
          }
        }
      }
      return Promise.reject(error);
    },
  );
};

export default Api;
