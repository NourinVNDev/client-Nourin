import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
const fetchTodaysBooking=async(managerId:string)=>{
    return await managerApiRequest(`/fetchTodayBooking/${managerId}`,'GET');
 
}
const fetchTotalBooking=async(managerId:string)=>{
    return await managerApiRequest(`/fetchTotalBooking/${managerId}`,'GET');
}

const createConversationSchemaOfManager=async(sender:string,receiver:string)=>{
    const formData={sender,receiver};  
      return await managerApiRequest('/create-chatSchema2','POST',formData);
}
export {fetchTodaysBooking,fetchTotalBooking,createConversationSchemaOfManager};