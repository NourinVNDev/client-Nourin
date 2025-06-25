import axios from "axios";
import { clearVerifierDetails } from "../../Features/verifierSlice";
import {persistor} from '../../App/store';
const VERIFIER_API = axios.create({ baseURL: import.meta.env.VITE_VERIFIER_URL, withCredentials: true });
let storeDispatch: any = null;

export const setAxiosDispatch = (dispatch: any) => {
    storeDispatch = dispatch;
};
VERIFIER_API.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401  && !originalRequest._retry) {
            console.log('Data from if-case')
            originalRequest._retry = true; 

            try {
              
                const res = await VERIFIER_API.post("/refresh-token");

                document.cookie = `accessToken=${res.data.verifierAccessToken};`;

                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return VERIFIER_API(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/verifier/login"; 
            }
        }else if(error.response?.status ===404){
                    console.log("Yes");
                    localStorage.removeItem('verifierAuth');
                    persistor.purge();
                    storeDispatch && storeDispatch(clearVerifierDetails());
                    window.location.href = '/mLogin'
        
                }

        return Promise.reject(error); // Forward other errors
    }
);

export default VERIFIER_API;
