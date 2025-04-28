import MANAGER_API from "../../utils/managerAxiosInstance"

const fetchUserCountAndRevenue=async(managerId:string)=>{
    try{
    const response=await MANAGER_API(`/fetchUserCount/${managerId}`,{
        method:'GET',

    })
    const data=response.data;
    console.log("Data",data);
    return data;
}catch (error) {
    console.error("Error during Dashboard fetching:", error);
    return undefined;
  }

}

const fetchDashboardGraphData=async(managerId:string,selectedType:string,selectedTime:string)=>{
    try{
        const response=await MANAGER_API(`/fetchDashboardGraphData/${managerId}/${selectedType}/${selectedTime}`,{
            method:'GET',
    
        })
        const data=response.data;
        console.log("Data",data);
        return data;
    }catch (error) {
        console.error("Error during Dashboard fetching:", error);
        return undefined;
      } 
}
const fetchPieChatData=async(managerId:string)=>{
    try{
        const response=await MANAGER_API(`/fetchDashboardPieChart/${managerId}`,{
            method:'GET',
    
        })
        const data=response.data;
        console.log("Data",data);
        return data;
    }catch (error) {
        console.error("Error during Dashboard fetching:", error);
        return undefined;
      }  

}
export {fetchUserCountAndRevenue,fetchDashboardGraphData,fetchPieChatData}