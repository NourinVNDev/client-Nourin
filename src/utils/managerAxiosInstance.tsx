import axios from "axios";
import Swal from "sweetalert2";
import { MANAGER_URL } from "./userUrl";
// Base Axios instance
const MANAGER_API = axios.create({ baseURL: MANAGER_URL, withCredentials: true });




const getToken = () =>

    document.cookie.split("; ").find(row => row.startsWith("managerToken="))?.split("=")[1];
// Request Interceptor

const clearCookies = () => {
    document.cookie = "managerToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "managerRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
MANAGER_API.interceptors.request.use(
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
MANAGER_API.interceptors.response.use(
    (response) => response, // Forward successful responses
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401  && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true; // Mark this request as retried

            try {
                // Get a new access token using the refresh token
                const res = await MANAGER_API.post("/refresh-token");


                // Save the new access token in cookies
                document.cookie = `accessToken=${res.data.accessToken};`;

                // Retry the failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return MANAGER_API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/"; // Redirect to login if refresh fails
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
                window.location.href = '/mLogin';
                
            });
        }

        return Promise.reject(error); // Forward other errors
    }
);

export default MANAGER_API;
