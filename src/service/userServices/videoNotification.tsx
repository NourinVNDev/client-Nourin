import API from "../../utils/axiosInstance"

const fetchUserNotificaiton=async(userId:string)=>{
    try {
        const response=await API(`/fetchUserNotification/${userId}`,{
            method:'GET'
        })
        const data=response.data;
        console.log("Res",data);
        return data;
        
        
        
    } catch (error) {
        
    }

}
export {fetchUserNotificaiton}