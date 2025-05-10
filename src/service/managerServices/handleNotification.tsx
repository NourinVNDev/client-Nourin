import MANAGER_API from "../../utils/managerAxiosInstance";
const fetchManagerNotification=async(managerId:string)=>{
    try {

        console.log('Manager ID',managerId );
        
        const response = await MANAGER_API(`/fetchManagerNotification/${managerId}`, {
          method: "GET",
     
        });
        const result = response.data; 
        console.log("result message", result.message);
        return result;
      } catch (error) {
        console.error("Error in updateEvent:", error);
        throw error;
      }

}
const fetchManagerNotificationCount=async(managerId:string)=>{
  try{

    const response = await MANAGER_API(`/fetchNotificationCount/${managerId}`, {
        method: "GET"

    });

    const data = response.data;
    return data;
} catch (error) {
    console.error("Error creating conversation schema:", error);
    return undefined;
}

}
export {fetchManagerNotification,fetchManagerNotificationCount}