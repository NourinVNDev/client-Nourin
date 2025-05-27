import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";

const fetchManagerNotification=async(managerId:string)=>{
  return await managerApiRequest(`/fetchManagerNotification/${managerId}`,'GET')
}
const fetchManagerNotificationCount=async(managerId:string)=>{
  return await managerApiRequest(`/fetchNotificationCount/${managerId}`,'GET')
}

const EventDateChecking=async(eventName:string)=>{
  return await managerApiRequest(`/checkIfDateValid?name=${eventName}`,'GET');
}
export {fetchManagerNotification,fetchManagerNotificationCount,EventDateChecking}