import axios from "axios";
import Swal from "sweetalert2";
import { USER_URL } from "./userUrl";

const API = axios.create({ baseURL: USER_URL, withCredentials: true });




const getToken = () =>
    document.cookie.split("; ").find(row => row.startsWith("accessToken="))?.split("=")[1];

const clearCookies = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
   

API.interceptors.request.use(
    (config) => {
        const token = getToken();
        console.log(token, "token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach access token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


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
                window.location.href = '/';
                
            });
            
        }

        return Promise.reject(error); 
    }
);

export default API;
