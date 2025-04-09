import axios from "axios";

import { VERIFIER_URL } from "./userUrl";
// Base Axios instance
const VERIFIER_API = axios.create({ baseURL: VERIFIER_URL, withCredentials: true });




const getToken = () =>document.cookie.split("; ").find(row => row.startsWith("verifierAccessToken="))?.split("=")[1];



VERIFIER_API.interceptors.request.use(
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

VERIFIER_API.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401  && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true; 

            try {
              
                const res = await VERIFIER_API.post("/refresh-token");


                // Save the new access token in cookies
                document.cookie = `verifierAccessToken=${res.data.verifierAccessToken};`;

                // Retry the failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return VERIFIER_API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/verifier/login"; 
            }
        }

        return Promise.reject(error); // Forward other errors
    }
);

export default VERIFIER_API;
