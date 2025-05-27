import { verifierApiRequest } from "../../utils/apiHelper/verifierApiHelper";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
const checkManagerHaveEvent=async (email:string)=>{
    return await verifierApiRequest(`/checkVerifierHaveAccount/${email}`,'GET')
}

const sendResendOtp=async(email:string)=>{
    return await verifierApiRequest(`/resendOTP/${email}`,'GET');
}
const  verifyOtp=async(otp:string,email:string)=>{
    return await verifierApiRequest(`/verifyOtp/${otp}/${email}`,'GET');
}
const handleVerifierData = async (formInput: VerifierData,companyName: string | null) => {
        const formData = {
            ...formInput,
            companyName: companyName || "",
        };
        return await verifierApiRequest(`/verifierLogin`,'POST',formData);
};

const fetchAllCompanyEvents=async(email:string)=>{
    return await verifierApiRequest(`/fetchEvents/${email}`,'GET');
}
const fetchAllBooking=async(eventId:string)=>{
    return await verifierApiRequest(`/fetchBookedDetails/${eventId}`,'GET');
}

const markUserEntry=async(bookingId:string,userName:string)=>{
    return await verifierApiRequest(`markUserEntry/${bookingId}/${userName}`,'GET');
}

const fetchSingleUserData=async(bookedId:string,userName:string)=>{
    return await verifierApiRequest(`/fetchSingleUser/${bookedId}/${userName}`,'GET');
}
    
    
    export {checkManagerHaveEvent,sendResendOtp,verifyOtp,handleVerifierData,fetchAllCompanyEvents,fetchAllBooking,markUserEntry,fetchSingleUserData};