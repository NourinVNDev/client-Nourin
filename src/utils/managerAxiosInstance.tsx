import axios from "axios";
import Swal from "sweetalert2";
import { clearManagerDetails } from "../../Features/managerSlice";
import {persistor} from '../../App/store';
const MANAGER_API = axios.create({ baseURL: import.meta.env.VITE_MANAGER_URL?.trim().replace(/\/$/, ''), withCredentials: true });

let storeDispatch: any = null;

export const setAxiosDispatch = (dispatch: any) => {
    storeDispatch = dispatch;
};
const clearCookies = () => {
    document.cookie = "managerToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "managerRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

MANAGER_API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true;
            try {
             const res = await MANAGER_API.post("/refresh-token", {}, { withCredentials: true });
                document.cookie = `accessToken=${res.data.accessToken};`;
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return MANAGER_API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/mLogin";
            }
        } else if (error.response?.status === 403) {
            Swal.fire({
                title: "Access Denied",
                text: "Your account has been blocked by the admin.",
                icon: "warning",
                confirmButtonText: "OK",
                allowOutsideClick: false,
            }).then(() => {
                clearCookies();
                localStorage.removeItem('managerAuth');
                localStorage.removeItem('ManagerName')
                storeDispatch && storeDispatch(clearManagerDetails());
                persistor.purge();
                window.location.href = '/mLogin';
                

            });
        } else if(error.response?.status ===404) {
            console.log("Yes");
            clearCookies();
            localStorage.removeItem('managerAuth');
            localStorage.removeItem('ManagerName');
            persistor.purge();
            storeDispatch && storeDispatch(clearManagerDetails());
            window.location.href = '/mLogin'

        }

        return Promise.reject(error); // Forward other errors
    }
);

export default MANAGER_API;
