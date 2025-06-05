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
const fetchBarChartDataForEvent=async(selectedEvent:string)=>{
        return await managerApiRequest(`/fetchDashboardBarChart/${selectedEvent}`,'GET');
}
export {fetchUserCountAndRevenue,fetchDashboardGraphData,fetchPieChatData,fetchBarChartDataForEvent}