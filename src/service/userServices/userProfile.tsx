
import API from "../../utils/axiosInstance";
import MANAGER_API from "../../utils/managerAxiosInstance";
const getExistingReviewAndRating = async (eventId: string, userId: string) => {
    try {
        console.log("EventId,userId",eventId,userId)
        const response = await API(`/getExistingReview/${eventId}/${userId}`, {
            method: "GET",
        });

        const data = response.data;
        console.log("Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching existing review and rating:", error);
        return undefined;
    }
};

const EventReviewAndRating = async (rating: number, review: string,eventId:string,userId:string) => {
    try {
        const formData = { rating, review ,eventId,userId};

        console.log("FormData:", formData);

        const response = await API("/review-rating", {
            method: "POST",
            data: formData,
        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error submitting review and rating:", error);
        return undefined;
    }
};

const eventHistoryDetails = async (userId:string) => {
    try {
        const response = await API(`/getEventHistory/${userId}`, { method: "GET" });

        const data = response.data.data;
        console.log("Event History Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching event history:", error);
        return undefined;
    }
};

const eventBookingDetails = async (userId:string) => {
    try {
        const response = await API(`/getBookedEvent/${userId}`, { method: "GET" });

        const data = response.data.data;
        console.log("Booked Events Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching booked events:", error);
        return undefined;
    }
};

const getManagerNames = async (userId:string) => {
    try {
        console.log("Hai123",userId);
        
        const response = await API(`/getManagerName?name=${userId}`, {
            method: "GET",
        });

        const data = response.data.data;
        console.log("Manager Names Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching manager names:", error);
        return undefined;
    }
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
    try {
        const formData = { manager, userId };

        console.log("FormData:", formData);

        const response = await API("/create-chatSchema", {
            method: "POST",
            data: formData,
        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error creating conversation schema:", error);
        return undefined;
    }


};

const fetchNotificationCount=async(userId:string)=>{
    try{

    const response = await API(`/fetchNotificationCount/${userId}`, {
        method: "GET"

    });

    const data = response.data;
    return data;
} catch (error) {
    console.error("Error creating conversation schema:", error);
    return undefined;
}

}

const postUserProfilePicture=async(formData:FormData,userId:string)=>{
    try {
     

        console.log("FormData:", formData);

        const response = await API(`/uploadUserProfile/${userId}`, {
            method: "POST",
            data: formData,
            withCredentials:true

        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error creating conversation schema:", error);
        return undefined;
    }


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
