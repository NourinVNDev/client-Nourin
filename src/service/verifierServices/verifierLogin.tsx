import VERIFIER_API from "../../utils/verifierAxiosInstance";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
const checkManagerHaveEvent=async (email:string)=>{
    try {
        console.log("Manager Email",email)
        const response = await VERIFIER_API(`/checkManagerHaveEvent/${email}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }


}

const sendResendOtp=async(email:string)=>{
    try {
        console.log('Resend OTP Email:',email);
        const response = await VERIFIER_API(`/resendOTP/${email}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }


}
const  verifyOtp=async(otp:string)=>{
    try {
        console.log('Entered OTP:',otp);
        const response = await VERIFIER_API(`/verifyOtp/${otp}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }


}
const handleVerifierData = async (
    formInput: VerifierData,
    companyName: string | null
) => {
    try {
        console.log("Ya");
        console.log("Entered Form Input:", formInput);

        const formData = {
            ...formInput,
            companyName: companyName || "", // Ensure it's a string or empty if null
        };

        console.log("FormData", formData);

        const response = await VERIFIER_API(`/verifierLogin`, {
            method: "POST",
            data: formData,
        });

        const data = response.data;
        console.log("Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }
};

const fetchAllCompanyEvents=async(companyName:string)=>{
    try {
        console.log('Your CompanyName',companyName);
        const response = await VERIFIER_API(`/fetchEvents/${companyName}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("Data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }

}
const fetchAllBooking=async(eventId:string)=>{
    try {
        console.log('EventID',eventId);
        const response = await VERIFIER_API(`/fetchBookedDetails/${eventId}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("fetched booked user:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }
}

const markUserEntry=async(bookingId:string)=>{
    try {
        console.log('BookingID',bookingId);
        const response = await VERIFIER_API(`/markUserEntry/${bookingId}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("mark the participation:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }

}
    
    
    export {checkManagerHaveEvent,sendResendOtp,verifyOtp,handleVerifierData,fetchAllCompanyEvents,fetchAllBooking,markUserEntry};