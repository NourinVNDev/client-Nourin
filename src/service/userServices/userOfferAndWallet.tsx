
import { apiRequest } from "../../utils/apiHelper/userApiHelper";
const CheckOfferAvailable=async (category:string)=>{
    return await apiRequest(`/post/checkOfferAvailable/${category}`,'GET')
}
const cancelEventBooking=async(bookingId:string,userId:string)=>{
    return await apiRequest(`/cancelEventBooking/${bookingId}/${userId}`,'GET')
}
const fetchUserWallet=async(userId:string)=>{
    return await apiRequest(`/fetchUserWallet/${userId}`,'GET');
}
export {CheckOfferAvailable,cancelEventBooking,fetchUserWallet}