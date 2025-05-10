import ADMIN_API from "../../utils/adminAxiosIntance";
const  fetchUserManagerCountAndRevenue=async()=>{
    console.log("Class");
    
    try{
        const response=await ADMIN_API(`/admin/fetchUserManagerCount`,{
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


const fetchAdminDashboardGraphData=async(selectedType:string,selectedTime:string)=>{
    try{
        const response=await ADMIN_API(`/fetchDashboardGraphData/${selectedType}/${selectedTime}`,{
            method:'GET',
    
        })
        const data=response.data;
        console.log("Data123",data);
        return data;
    }catch (error) {
        console.error("Error during Dashboard fetching:", error);
        return undefined;
      } 
}

const fetchPieChatData=async()=>{
    try{
        const response=await ADMIN_API(`/fetchDashboardPieChart`,{
            method:'GET',
    
        })
        const data=response.data;
        console.log("PieData",data);
        return data;
    }catch (error) {
        console.error("Error during Dashboard fetching:", error);
        return undefined;
      }

}
export{fetchUserManagerCountAndRevenue,fetchAdminDashboardGraphData,fetchPieChatData}