import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
const ManagerRegister=async(formData:{[key:string]:string})=>{
    const response=await managerApiRequest('/mSubmit','POST',formData);
        return response.otpData; 
}
const mVerifyOtp=async(otpData:string,formData:{[key:string]:string})=>{
            const dataToSend={
                otp:otpData,
                ...formData
            }
            return await managerApiRequest('/MverifyOtp','POST',dataToSend);    
    }
    const managerLogin=async(formData:{[key:string]:string})=>{ 
    return await managerApiRequest('/Mlogin','POST',formData);
    }
    const forgotPasswordForManager=async(email:string)=>{
        const response=await managerApiRequest('/forgotM','POST',email);
        return response.message;
    }
    const verifyOtpForgotForManager = async (otpData:string,email:string) => {
        const dataToSend={
            otp:otpData,
            email:email
        }
        const response=await managerApiRequest('/verifyForgotOtpM','POST',dataToSend)
      return {response,email}; 
    }
    const ManagerResetPassword1 = async (email:string,formData:{ [key: string]: string }) => {
        const dataToSend={
                email:email,
                ...formData
            }
            const response=await managerApiRequest('/resetPasswordM','POST',dataToSend);
            return response.message; 
    }
const getmanagerDetails = async (otpData:string,email:string) => {
        return await managerApiRequest('/Manager/getOffers','GET');
    }
    const updateManagerData = async (formData:{[key:string]:string}) => {
   return await managerApiRequest('/updateManagerData','POST',formData);
        }
const updateManagerPassword = async (formData:{[key:string]:string}) => {
    return await managerApiRequest('/changeManagerPassword','POST',formData);  
        }
        const getAManagerDetails = async (companyName: string): Promise<any> => {
            const response=await managerApiRequest(`/managerProfile/${companyName}`,'GET')
                const data = response.data;
                if (!data) {
                    console.error("No data found for the given company name");
                    return null; 
                }
                return data;
            };
export  {ManagerRegister,mVerifyOtp,managerLogin,forgotPasswordForManager,verifyOtpForgotForManager,ManagerResetPassword1,getmanagerDetails,updateManagerData,updateManagerPassword,getAManagerDetails};