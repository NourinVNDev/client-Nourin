import axios from "axios";
import { ADMIN_URL } from "./userUrl";

const ADMIN_API = axios.create({ baseURL:ADMIN_URL, withCredentials: true });




const getToken = () =>document.cookie.split("; ").find(row => row.startsWith("adminToken="))?.split("=")[1] ||
  console.log("Nourin");
  
  console.log("dbjn",getToken);
ADMIN_API.interceptors.request.use(

    (config) => {
          console.log("bjjj");
        const token = getToken();

        console.log(token, "token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


ADMIN_API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401  && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true; 

            try {
         
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
        }

        return Promise.reject(error); // Forward other errors
    }
);

export default ADMIN_API;
