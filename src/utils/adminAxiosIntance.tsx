import axios from "axios";
import Swal from "sweetalert2";
import { ADMIN_URL } from "./userUrl";
// Base Axios instance
const ADMIN_API = axios.create({ baseURL:ADMIN_URL, withCredentials: true });




const getToken = () =>
    document.cookie.split("; ").find(row => row.startsWith("adminToken="))?.split("=")[1] ||
  
// Request Interceptor
ADMIN_API.interceptors.request.use(
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

// Response Interceptor
ADMIN_API.interceptors.response.use(
    (response) => response, // Forward successful responses
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401  && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true; // Mark this request as retried

            try {
                // Get a new access token using the refresh token
                const res = await ADMIN_API.post("/refresh-token");


                // Save the new access token in cookies
                document.cookie = `accessToken=${res.data.accessToken};`;

                // Retry the failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return ADMIN_API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/adminlogin"; // Redirect to login if refresh fails
            }
        }else if(error.response?.status===403){
            Swal.fire({
                title: "Access Denied",
                text: "Your account has been blocked by the admin.",
                icon: "warning",
                confirmButtonText: "OK",
                allowOutsideClick: false,
              });
        }

        return Promise.reject(error); // Forward other errors
    }
);

export default ADMIN_API;
