
import { apiRequest } from "../../utils/apiHelper/userApiHelper";
import MANAGER_API from "../../utils/managerAxiosInstance";
const getExistingReviewAndRating = async (eventId: string, userId: string) => {
    return await apiRequest(`/getExistingReview/${eventId}/${userId}`,'GET')
};
const EventReviewAndRating = async (rating: number, review: string,eventId:string,userId:string) => {
        const formData = { rating, review ,eventId,userId};
        return await apiRequest('/review-rating','POST',formData);
}
const eventHistoryDetails = async (userId:string) => {
        const response = await await apiRequest(`/getEventHistory/${userId}`,'GET');
        return response.data;
};
const eventBookingDetails = async (userId:string) => {
    const response=await apiRequest(`/getBookedEvent/${userId}`,'GET')
    return response.data;
};
const getManagerNames = async (userId:string) => {
        const response = await apiRequest(`/getManagerName?name=${userId}`,'GET');
        return response.data;
};
const getUserNames=async(managerName:string)=>{
    try {
        console.log("Get",managerName);
        
        const response=await MANAGER_API(`/getUserNames?name=${encodeURIComponent(managerName)}`,{
            method:"GET"
        });
        console.log("res",response.data)
        const data=response.data.data;
        console.log("user Names Data",data);
        return data;
    }catch (error) {
        console.error("Error fetching user names:", error);
        return undefined;
    }

}

const createConversationSchema = async (manager: string, userId: string) => {
         const formData = { manager, userId };
        return await apiRequest('/create-chatSchema','POST',formData);
};

const fetchNotificationCount=async(userId:string)=>{
    return  await apiRequest(`/fetchNotificationCount/${userId}`,'GET');
}

const postUserProfilePicture=async(formData:FormData,userId:string)=>{
    return await apiRequest(`/uploadUserProfile/${userId}`,'POST',formData);
}



export {
    getExistingReviewAndRating,
    EventReviewAndRating,
    eventHistoryDetails,
    getManagerNames,
    eventBookingDetails,
    createConversationSchema,
    postUserProfilePicture,
    getUserNames,
    fetchNotificationCount
};
