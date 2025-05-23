import MANAGER_API from "../../utils/managerAxiosInstance";


const fetchTodaysBooking=async(managerId:string)=>{
    try {
           
        const response = await MANAGER_API(`/fetchTodayBooking/${managerId}`, {
            method: 'GET',
       
        
        });
        const data=await response.data;
        console.log("Data123",data);
        return data;
    } catch (error) {
        
    }
}
const fetchTotalBooking=async(managerId:string)=>{
    try {
           
        const response = await MANAGER_API(`/fetchTotalBooking/${managerId}`, {
            method: 'GET',
       
        
        });
        const data=await response.data;
        console.log("Total Booking",data);
        return data;
    } catch (error) {
        
    }
}

const createConversationSchemaOfManager=async(sender:string,receiver:string)=>{
    console.log("suc");
    
    const formData={sender,receiver};
    console.log("Send",sender,receiver);
    
    const response=await MANAGER_API("/create-chatSchema2",{
        method:'POST',
        data:formData
    });

    const data=response.data;
    console.log("Data of:",data);
    
    return data;
}

export {fetchTodaysBooking,fetchTotalBooking,createConversationSchemaOfManager};