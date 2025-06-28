import axios from "axios";
import Swal from "sweetalert2";
import {persistor} from '../../App/store';

import { clearUserDetails } from "../../Features/userSlice";


const API = axios.create({ baseURL: import.meta.env.VITE_USER_URL?.trim().replace(/\/$/, ''), withCredentials: true });
let storeDispatch: any = null;

export const setAxiosDispatch = (dispatch: any) => {
  storeDispatch = dispatch;
};
const clearCookies = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
API.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401  && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true;

            try {
                const res = await API.post("/refresh-token");


            
                document.cookie = `accessToken=${res.data.accessToken};`;

                
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/"; 
            }
        }else if(error.response?.status===403){
            Swal.fire({
                title: "Access Denied",
                text: "Your account has been blocked by the admin.",
                icon: "warning",
                confirmButtonText: "OK",
                allowOutsideClick: false,
            }).then(() => {
                clearCookies();
                localStorage.removeItem('userAuth');
                   localStorage.removeItem('userId');
                   persistor.purge();
              storeDispatch && storeDispatch(clearUserDetails());
                window.location.href = '/';
            
            });
            
        }else  if(error.response?.status===404){
            //refresh token illatha case
            console.log("Yes");
            clearCookies();

            localStorage.removeItem('userAuth');
              localStorage.removeItem('userId');
        storeDispatch && storeDispatch(clearUserDetails());
          persistor.purge();
            window.location.href='/'

        }

        return Promise.reject(error); 
    }
);

export default API;
