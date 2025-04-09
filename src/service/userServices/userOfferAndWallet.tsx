
import API from "../../utils/axiosInstance";
const CheckOfferAvailable=async (category:string)=>{
    console.log("MAAAHN");
    try {
     
        const response = await API(`/post/checkOfferAvailable/${category}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form unique",data);
        return data;
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined;
    }
}
const cancelEventBooking=async(bookingId:string,userId:string)=>{
    console.log("BookingId for Cancellation",bookingId);
    try {
     
        const response = await API(`/cancelEventBooking/${bookingId}/${userId}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data from cancel event",data);
        return data;
    } catch (error) {
        console.error("Error during cancelling event booking:", error);
        return undefined;
    }


}
const fetchUserWallet=async(userId:string)=>{
    try {
     
        const response = await API(`/fetchUserWallet/${userId}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data from User Wallet",data);
        return data; 
    } catch (error) {
        console.error("Error during cancelling event booking:", error);
        return undefined; 
    }

}




export {CheckOfferAvailable,cancelEventBooking,fetchUserWallet}