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
export{fetchUserManagerCountAndRevenue}