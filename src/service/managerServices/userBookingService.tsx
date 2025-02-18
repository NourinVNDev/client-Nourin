import MANAGER_API from "../../utils/managerAxiosInstance";


const fetchTodaysBooking=async()=>{
    try {
           
        const response = await MANAGER_API('/fetchTodayBooking', {
            method: 'GET',
       
        
        });
        const data=await response.data;
        console.log("Data123",data);
        return data;
    } catch (error) {
        
    }
}
const fetchTotalBooking=async()=>{
    try {
           
        const response = await MANAGER_API('/fetchTotalBooking', {
            method: 'GET',
       
        
        });
        const data=await response.data;
        console.log("Total Booking",data);
        return data;
    } catch (error) {
        
    }
}
export {fetchTodaysBooking,fetchTotalBooking};