import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
const fetchUserCountAndRevenue=async(managerId:string)=>{
    return await managerApiRequest(`/fetchUserCount/${managerId}`,'GET');
}
const fetchDashboardGraphData=async(managerId:string,selectedType:string,selectedTime:string)=>{
    return await managerApiRequest(`/fetchDashboardGraphData/${managerId}/${selectedType}/${selectedTime}`,'GET');
}
const fetchPieChatData=async(managerId:string)=>{
    return await managerApiRequest(`/fetchDashboardPieChart/${managerId}`,'GET');
}
export {fetchUserCountAndRevenue,fetchDashboardGraphData,fetchPieChatData}