
import MANAGER_API from "../../utils/managerAxiosInstance";


export interface eventSeat {
  Included: string[];
  notIncluded: string[];
  Amount: number;
  noOfSeats: number;
  typesOfTickets: string;
}
const createEventpost=async(formData:FormData)=>{
  console.log('data from client',formData);
    const response = await MANAGER_API("/createEvent", {
        method: "POST",
 
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });


      console.log('suucesss');
      const result = await response.data;
      console.log("pattilla",result.message);
      return result;
}
const createEventSeatDetails=async(ticketList:eventSeat[],id:string)=>{
  console.log('data eventSeat',ticketList);
    const response = await MANAGER_API(`/createEventSeatDetails/${id}`, {
        method: "POST",
 
        data: ticketList,
        withCredentials: true,
    
      });


      console.log('suucesss');
      const result = await response.data;
      console.log("pattilla",result.message);
      return result;
}



const getCategoryEventType=async()=>{
  console.log("fronend");
  
  const response = await MANAGER_API("/Manager/getEventType", {
    method: "GET",
    headers:{
      'Content-Type':'application/json'
    },
    withCredentials: true,
        


  });


  console.log('suucesss',response);
  const result = await response.data;
  console.log("pattilla",result.message);
  console.log(result.data);
  
  return result.data;

}


const  getAllEventData=async()=>{
  try {
   
      const response = await MANAGER_API('/Manager/getAllEventData', {
          method: 'GET'
      });

      const data = response.data.data.data;
 console.log("Data form client",data);
      return data; // Return the OTP or any other relevant data
  } catch (error) {
      console.error("Error during registration:", error);
      return undefined; // Or throw an error if you want to handle it upstream
  }
}


const  handlePreviousEvents=async(id:string)=>{
  try {
   
      const response = await MANAGER_API(`/getPreviousEventDetails/${id}`, {
          method: 'GET'
      });

      const data = response.data.data;
 console.log("Data form client",data);
      return data; // Return the OTP or any other relevant data
  } catch (error) {
      console.error("Error during registration:", error);
      return undefined; // Or throw an error if you want to handle it upstream
  }
}
const updateEvent = async (eventDetails: FormData) => {
  try {console.log("EventData",eventDetails);
   

    
    const response = await MANAGER_API("/updateEvent", {
      method: "POST",
      headers:{
        'Content-Type':'multipart/form-data'
      },
      data:eventDetails,
      withCredentials: true,
    });

    console.log('success');
    const result = response.data; // No need to await here, as response.data is already resolved
    console.log("result message", result.message);
    return result;
  } catch (error) {
    console.error("Error in updateEvent:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};



export {createEventpost,createEventSeatDetails,getCategoryEventType,getAllEventData,handlePreviousEvents,updateEvent}