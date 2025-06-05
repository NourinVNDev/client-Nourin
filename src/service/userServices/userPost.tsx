import API from "../../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentData, retryBillingData, retryPayment } from "../../validations/userValid/TypeValid"
import { billingData } from "../../validations/userValid/TypeValid";
import { apiRequest } from "../../utils/apiHelper/userApiHelper";
const getEventDataDetails=async (postId:string)=>{
    const response=await apiRequest(`/post/getSelectedEventData/${postId}`,'GET');
        return response.data;
}

const getAllEventDataDetails=async ()=>{
    const response=await apiRequest(`/post/getAllEventData`,'GET');
        return response.data;
}
const handleLikePost=async (index:number,postId:string,userId:string)=>{
    return await apiRequest(`/post/handleLike`,'POST',{index,postId,userId})
}


const handlePostDetails=async (postId:string)=>{
    return await apiRequest(`/post/handleDetails/${postId}`,'GET');
}

const getEventData=async (id:string)=>{
    return await apiRequest(`/post/getSelectEvent/${id}`,'GET')
}
const makeStripePayment = async (eventData: PaymentData) => {
    try {
        const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!PUBLISHABLE_KEY) {
            throw new Error("No publishable key provided.");
        }
        const stripe = await loadStripe(PUBLISHABLE_KEY);
        if (!stripe) {
            throw new Error("Stripe failed to initialize.");
        }
        const userEventData = { products: eventData };
        const response = await API.post("/post/create-checkout-session", userEventData);
        console.log("Response",response);
        if (!response.data || !response.data.success) {
            return { success: false, message: response.data?.message || "Failed to create checkout session" };
        }
        const sessionId = response.data.sessionId;
        if (!sessionId) {
            console.error("Invalid session ID from server");
            return { success: false, message: "Seat Sold Out"};
        }
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result?.error) {
            console.error("Stripe Checkout Error:", result.error.message);
            return { success: false, message: result.error.message };
        }
        return { success: true, message: "Redirecting to payment" };
    } catch (error) {
        console.error("Error during payment:", error);
        return { success: false, message: error || "Something went wrong" };
    }
};

const retryStripePayment = async (eventData: retryPayment) => {
  
    try {
     

        console.log("BookedEmails:",eventData.bookedEmails);
        const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        console.log(PUBLISHABLE_KEY);

        if (!PUBLISHABLE_KEY) {
            throw new Error("No publishable key provided.");
        }

        console.log("Client Id", PUBLISHABLE_KEY);
        const stripe = await loadStripe(PUBLISHABLE_KEY);

        if (!stripe) {
            throw new Error("Stripe failed to initialize.");
        }

        const userEventData = { products: eventData };

        const response = await API.post("/retryPayment-checkout-session", userEventData);
        console.log("Response",response);
        
        if (!response.data || !response.data.success) {
            return { success: false, message: response.data?.message || "Failed to create checkout session" };
        }

        const sessionId = response.data.sessionId;
        if (!sessionId) {
            console.error("Invalid session ID from server");
            return { success: false, message: "Seat Sold Out"};
        }

        const result = await stripe.redirectToCheckout({ sessionId });

        if (result?.error) {
            console.error("Stripe Checkout Error:", result.error.message);
            return { success: false, message: result.error.message };
        }

        return { success: true, message: "Redirecting to payment" };

    } catch (error) {
        console.error("Error during payment:", error);
        return { success: false, message: error || "Something went wrong" };
    }
};




const saveBillingDetailsOfUser=async(formData:billingData)=>{
    return await apiRequest(`/saveBillingDetails`,'POST',formData);
}
const saveRetryBillingDetails=async(formData:retryBillingData)=>{
    return await apiRequest(`/saveRetryBillingDetails`,'POST',formData);
}

const checkIfUserIsBooked=async(email:string,eventName:string,bookedId:string)=>{
    const response=await apiRequest(`/checkIfUserValid/${email}/${eventName}/${bookedId}`,'GET')
    console.log("Response",response.data);
    
        return response.data.result.savedEvent;
}

const updatePaymentStatusService=async(bookedId:string)=>{
    return await apiRequest(`/updatePaymentStatus/${bookedId}`,'POST');
}
const fetchBookingData=async(bookingId:string)=>{
    return await apiRequest(`/getSelectedBookingData/${bookingId}`,'GET')
}
export {getEventDataDetails,checkIfUserIsBooked,getAllEventDataDetails,handleLikePost,handlePostDetails,getEventData,makeStripePayment,retryStripePayment,saveBillingDetailsOfUser,updatePaymentStatusService,fetchBookingData,saveRetryBillingDetails};
