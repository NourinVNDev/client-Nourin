
import { adminApiRequest } from "../../utils/apiHelper/adminApiHelper";
const  fetchUserManagerCountAndRevenue=async()=>{
    return await adminApiRequest(`/admin/fetchUserManagerCount`,'GET');
}


const fetchAdminDashboardGraphData=async(selectedType:string,selectedTime:string)=>{
    return await adminApiRequest(`/fetchDashboardGraphData/${selectedType}/${selectedTime}`,'GET');
}

const fetchPieChatData=async()=>{
    return await adminApiRequest(`/fetchDashboardPieChart`,'GET');
}
const fetchBarChartDataForEvent=async(selectCompany:string)=>{
    console.log("eve",selectCompany);
    
    return await adminApiRequest(`/fetchDashboardBarChart/${selectCompany}`,'GET');
}
export{fetchUserManagerCountAndRevenue,fetchAdminDashboardGraphData,fetchPieChatData,fetchBarChartDataForEvent}