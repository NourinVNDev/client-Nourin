
import { apiRequest } from "../../utils/apiHelper/userApiHelper";


const fetchSocialEventDetails = async () => {
    return await apiRequest('/fetchEventData', 'GET');
}
const register = async (formData: { [key: string]: string }) => {
    return await apiRequest('/submit', 'POST', formData);
};
const verifyOtp = async (otpData: string, formData: { [key: string]: string }) => {
    const dataToSend = {
        otp: otpData,
        ...formData
    }
    return await apiRequest('/verifyOtp', 'POST', dataToSend);
}
const userLogin = async (formData: { [key: string]: string }) => {
    const response = await apiRequest('/login', 'POST', formData);
    const user = response.data
    const data = response.message;
    return { data, user };
}
const GoogleAuth = async (response: Object) => {
    return await apiRequest('/googleAuth', 'POST', { code: response })
}
const handleResentOtp = async (email: string) => {
    const response = await apiRequest('/resendOtp', 'POST', { email })
    return response.message;
}
const forgotPassword = async (email: string) => {
    const response = await apiRequest('/forgotEmail', 'POST', { email })
    return response.message;
}

const verifyOtpForForgot = async (otpData: string, email: string) => {

    const dataToSend = {
        otp: otpData,
        email: email
    }
    const response = await apiRequest('/verifyForgotOtp', 'POST', dataToSend)
    const data = response.data;
    return { data, email };
}
const resetPassword = async (email: string, formData: { [key: string]: string }) => {
    const dataToSend = {
        email: email,
        ...formData
    }
    const response = await apiRequest('/resetPassword', 'POST', dataToSend);
    const data = response.message;
    return data;
}
const getEventDataFromDB = async (category: string) => {
    const response = await apiRequest(`/user/events/${category}`, 'GET')
    const data = response?.data.user;
    return data;
}
const handleProfileData = async (user_id: string) => {
    const response = await apiRequest(`profile/${encodeURIComponent(user_id)}`, 'GET')
    const data = response?.data;
    return data;
}
const getCategoryDataDetails = async () => {
    const response = await apiRequest(`/getAllCategoryDetails`, 'GET')
    const data = response?.data;
    return data;
}

const handleProfileDetails = async (formData: { [key: string]: string }) => {
    const response = await apiRequest(`/changeUserProfile`, 'POST', formData)
    const data = response.data;
    return data;
}
const generateOtp = async (userId: string) => {

    const response = await apiRequest(`/generateOtpForResetPassword/${userId}`, 'GET');
    const data = response?.data;
    return data;
}
const verifyOtpForPassword = async (Otp: string) => {
    const response = await apiRequest('/verifyOtpForPassword', 'POST', { otp: Otp });
    const data = response.message;
    return data;
}
const handleResetPassword = async (password: string, cPassword: string, userId: string) => {
    const dataToSend = {
        userId: userId,
        password: password,
        confirmPassword: cPassword
    }
    const response = await apiRequest('/handleResetPassword', 'POST', dataToSend);
    const data = response.message;
    return data;
}
export { fetchSocialEventDetails, register, forgotPassword, verifyOtp, userLogin, GoogleAuth, handleResentOtp, verifyOtpForForgot, resetPassword, getEventDataFromDB, handleProfileData, getCategoryDataDetails, handleProfileDetails, generateOtp, verifyOtpForPassword, handleResetPassword };