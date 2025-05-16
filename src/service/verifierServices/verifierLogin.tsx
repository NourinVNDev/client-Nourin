import VERIFIER_API from "../../utils/verifierAxiosInstance";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
const checkManagerHaveEvent=async (email:string)=>{
    try {
        console.log("Verifier Email",email)
        const response = await VERIFIER_API(`/checkVerifierHaveAccount/${email}`, {
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
const  verifyOtp=async(otp:string,email:string)=>{
    try {
        console.log('Entered OTP:',otp);
        const response = await VERIFIER_API(`/verifyOtp/${otp}/${email}`, {
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
            companyName: companyName || "",
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

const fetchAllCompanyEvents=async(email:string)=>{
    try {
        console.log('Your Email',email);
        const response = await VERIFIER_API(`/fetchEvents/${email}`, {
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

const markUserEntry=async(bookingId:string,userName:string)=>{
    try {
        console.log('BookingID',bookingId);
        const response = await VERIFIER_API(`markUserEntry/${bookingId}/${userName}`, {
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

const fetchSingleUserData=async(bookedId:string,userName:string)=>{
        try {
     
        const response = await VERIFIER_API(`/fetchSingleUser/${bookedId}/${userName}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("fetching single booked user:", data);
        return data;
    } catch (error) {
        console.error("Error fetching booked user Data:", error);
        return undefined;
    }

}
    
    
    export {checkManagerHaveEvent,sendResendOtp,verifyOtp,handleVerifierData,fetchAllCompanyEvents,fetchAllBooking,markUserEntry,fetchSingleUserData};