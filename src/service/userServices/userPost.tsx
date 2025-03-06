import API from "../../utils/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentData } from "../../validations/userValid/TypeValid"
import { billingData } from "../../validations/userValid/TypeValid";
const getEventDataDetails=async (postId:string)=>{
    try {
     
        const response = await API(`/post/getSelectedEventData/${postId}`, {
            method: 'GET',
    
        });

        const data = response.data.data;
   console.log("Data form unique",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}

const getAllEventDataDetails=async ()=>{
    try {
     
        const response = await API(`/post/getAllEventData`, {
            method: 'GET',
    
        });

        const data = response.data.data;
   console.log("Data form unique",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
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
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}


const handlePostDetails=async (postId:string)=>{
    try {
     
        const response = await API(`/post/handleDetails/${postId}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form client",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}

const getEventData=async (id:string)=>{
    try {
     
        const response = await API(`/post/getSelectEvent/${id}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form client",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}
const makeStripePayment=async (eventData:PaymentData)=>{
    console.log("Hello from Payment",eventData);
    
    try {
        const CLIENT_SECRET ="pk_test_51QjGncHTmAq9EwyH7hFljKers4qMvfKCMLy5Rww0cjJDMXRpDIO7acQ2lRmgklw84ichb4Pbk906AFmpprdu7C7G00yjPaeCF8";
        console.log(CLIENT_SECRET);
        if(!CLIENT_SECRET){
            throw new Error('No client ID from .env')

             }
             console.log("Client Id",CLIENT_SECRET);
             const stripe=await loadStripe(CLIENT_SECRET);
             const userEventData={
                products:eventData
}

     
        const response = await API(`/post/create-checkout-session`, {
            method: 'POST',
            data:userEventData
    
        });

       const session=await response.data;
       console.log("Session from client",session.sessionId.id);
       const result=stripe?.redirectToCheckout({
        sessionId:session.sessionId?.id
       })
       if((await result)?.error){
        console.log((await result)?.error);    
       }
       return result;

      
    }catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}

const saveBillingDetails=async(formData:billingData)=>{
    try {
        console.log("FormData",formData)
     
        const response = await API(`/saveBillingDetails`, {
            method: 'POST',
            data: formData,
        });

        const data = response.data;
   console.log("Data form client",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
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




export {getEventDataDetails,getAllEventDataDetails,handleLikePost,handlePostDetails,getEventData,makeStripePayment,saveBillingDetails,updatePaymentStatusService};
