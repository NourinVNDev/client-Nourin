import MANAGER_API from "../../utils/managerAxiosInstance";
const fetchManagerNotification=async(managerId:string)=>{
    try {

        console.log('Manager ID',managerId );
        
        const response = await MANAGER_API(`/fetchManagerNotification/${managerId}`, {
          method: "GET",
     
        });
        const result = response.data; 
        console.log("result message", result);
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

const EventDateChecking=async(eventName:string)=>{
      try {

        console.log("Traffic",eventName);
        
     
        const response = await MANAGER_API(`/checkIfDateValid?name=${eventName}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form date validation",data);
        return data;
    } catch (error) {
        console.error("Error during video  call:", error);
        return undefined;
    }

}
export {fetchManagerNotification,fetchManagerNotificationCount,EventDateChecking}