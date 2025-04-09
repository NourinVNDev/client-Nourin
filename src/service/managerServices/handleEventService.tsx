
import MANAGER_API from "../../utils/managerAxiosInstance";



export interface eventSeat {
  Included: string[];
  notIncluded: string[];
  Amount: number;
  noOfSeats: number;
  typesOfTickets: string;
}
interface TicketType {
  type: string;
  noOfSeats: number;
  Amount: number;
  Included: string[];
  notIncluded: string[];
  _id: string
}
const createEventpost = async (formData: FormData) => {
  console.log('data from client', formData);
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
  console.log("pattilla", result.message);
  return result;
}
const createEventSeatDetails = async (ticketList: eventSeat[], id: string) => {
  console.log('data eventSeat', ticketList);
  const response = await MANAGER_API(`/createEventSeatDetails/${id}`, {
    method: "POST",

    data: ticketList,
    withCredentials: true,

  });


  console.log('suucesss');
  const result = await response.data;
  console.log("pattilla", result.message);
  return result;
}



const getCategoryEventType = async () => {
  console.log("fronend");

  const response = await MANAGER_API("/Manager/getEventType", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,



  });


  console.log('suucesss', response);
  const result = await response.data;
  console.log("pattilla", result.message);
  console.log(result.data);

  return result.data;

}


const getAllEventData = async (managerId: string) => {
  try {

    const response = await MANAGER_API(`/Manager/getAllEventData/${managerId}`, {
      method: 'GET'
    });

    const data = response.data.data.data;
    console.log("Data form client", data);
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
    return undefined;
  }
}


const handlePreviousEvents = async (id: string) => {
  try {

    const response = await MANAGER_API(`/getPreviousEventDetails/${id}`, {
      method: 'GET'
    });

    const data = response.data.data;
    console.log("Data form client", data);
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
    return undefined;
  }
}
const updateEvent = async (eventDetails: FormData) => {
  try {
    console.log("EventData", eventDetails);



    const response = await MANAGER_API("/updateEvent", {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: eventDetails,
      withCredentials: true,
    });

    console.log('success');
    const result = response.data;
    console.log("result message", result.message);
    return result;
  } catch (error) {
    console.error("Error in updateEvent:", error);
    throw error;
  }
};
const fetchSocialEventDetails = async (id: string) => {
  try {

    const response = await MANAGER_API(`/getPreviousTicketDetails/${id}`, {
      method: 'GET'
    });

    const data = response.data.data;
    console.log("Data form of tickets", data);
    return data;
  } catch (error) {
    console.error("Error during ticket fetching:", error);
    return undefined;
  }
}
const updateTicketService = async (ticketToUpdate: TicketType) => {
  console.log("Ticket Updation:", ticketToUpdate);
  try {

    const response = await MANAGER_API(`/updateSeatInfo`, {
      method: 'POST',
      data:ticketToUpdate
    });

    const data = response.data.data;
    console.log("Data form of tickets", data);
    return data;
  } catch (error) {
    console.error("Error during ticket fetching:", error);
    return undefined;
  }




}



export { createEventpost, createEventSeatDetails, getCategoryEventType, getAllEventData, handlePreviousEvents, updateEvent, fetchSocialEventDetails, updateTicketService }