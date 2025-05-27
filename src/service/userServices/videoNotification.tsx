import { apiRequest } from "../../utils/apiHelper/userApiHelper";
const fetchUserNotificaiton=async(userId:string)=>{
    return await apiRequest(`/fetchUserNotification/${userId}`,'GET');
}
export {fetchUserNotificaiton}