import axios from "axios";
import { ADMIN_URL } from "./userUrl";
import { clearAdminDetails } from "../../Features/adminSlice";

const ADMIN_API = axios.create({ baseURL: ADMIN_URL, withCredentials: true });
let storeDispatch: any = null;

export const setAxiosDispatch = (dispatch: any) => {
    storeDispatch = dispatch;
};
const clearCookies = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

ADMIN_API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true;

            try {

                const res = await ADMIN_API.post("/refresh-token");

                document.cookie = `accessToken=${res.data.accessToken};`;
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return ADMIN_API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/adminlogin";
            }
        } else if (error.response?.status === 404) {
            clearCookies();
            localStorage.removeItem('adminAuth');
            storeDispatch && storeDispatch(clearAdminDetails());
            window.location.href = '/adminlogin'

        }

        return Promise.reject(error);
    }
);

export default ADMIN_API;
