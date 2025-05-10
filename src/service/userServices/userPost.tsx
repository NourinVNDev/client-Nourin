import API from "../../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentData, retryBillingData, retryPayment } from "../../validations/userValid/TypeValid"
import { billingData } from "../../validations/userValid/TypeValid";
const getEventDataDetails=async (postId:string)=>{
    try {
     
        const response = await API(`/post/getSelectedEventData/${postId}`, {
            method: 'GET',
    
        });

        const data = response.data.data;
   console.log("Data form unique",data);
        return data; 
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined;
    }
}

const getAllEventDataDetails=async ()=>{
    try {
     
        const response = await API(`/post/getAllEventData`, {
            method: 'GET',
    
        });

        const data = response.data.data;
   console.log("Data form unique",data);
        return data;
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined;
    }
}


const handleLikePost=async (index:number,postId:string,userId:string)=>{
    try {
     
        const response = await API(`/post/handleLike`, {
            method: 'POST',
            data: {index,postId,userId},
        });

        const data = response.data;
   console.log("Data form client",data);
        return data;
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined;
    }
}


const handlePostDetails=async (postId:string)=>{
    try {
     
        const response = await API(`/post/handleDetails/${postId}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form client",data);
        return data;
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; 
    }
}

const getEventData=async (id:string)=>{
    try {
     
        const response = await API(`/post/getSelectEvent/${id}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form client",data);
        return data;
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined;
    }
}
const makeStripePayment = async (eventData: PaymentData) => {
    console.log("Hello from Payment", eventData);

    try {
     
        const PUBLISHABLE_KEY = "pk_test_51QjGncHTmAq9EwyH7hFljKers4qMvfKCMLy5Rww0cjJDMXRpDIO7acQ2lRmgklw84ichb4Pbk906AFmpprdu7C7G00yjPaeCF8";
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
     
        const PUBLISHABLE_KEY = "pk_test_51QjGncHTmAq9EwyH7hFljKers4qMvfKCMLy5Rww0cjJDMXRpDIO7acQ2lRmgklw84ichb4Pbk906AFmpprdu7C7G00yjPaeCF8";
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
    console.log("FormData",formData)
    try {
        
     
        const response = await API(`/saveBillingDetails`, {
            method: 'POST',
            data: formData,
        });

        const data = response.data;
   console.log("Data form client",data);
        return data; 
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; 
    }
}
const saveRetryBillingDetails=async(formData:retryBillingData)=>{
    console.log("FormData",formData)
    try {
        const response = await API(`/saveRetryBillingDetails`, {
            method: 'POST',
            data: formData,
        });

        const data = response.data;
   console.log("Data form client",data);
        return data; 
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; 
    }
}

const updatePaymentStatusService=async(bookedId:string)=>{
    try {
        console.log("BookedID",bookedId)
     
        const response = await API(`/updatePaymentStatus/${bookedId}`, {
            method: 'POST',
           
        });

        const data = response.data;
   console.log("Data form client",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}
const fetchBookingData=async(bookingId:string)=>{
    try {
     
        const response = await API(`/getSelectedBookingData/${bookingId}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form retry-booking",data);
        return data;
    } catch (error) {
        console.error("Error during retry-booking:", error);
        return undefined;
    }


}




export {getEventDataDetails,getAllEventDataDetails,handleLikePost,handlePostDetails,getEventData,makeStripePayment,retryStripePayment,saveBillingDetailsOfUser,updatePaymentStatusService,fetchBookingData,saveRetryBillingDetails};
