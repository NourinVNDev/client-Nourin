
import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
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
  const response=await managerApiRequest('/createEvent','POST',formData);
  return response.message;
}
const createEventSeatDetails = async (ticketList: eventSeat[], id: string) => {
  return await managerApiRequest(`/createEventSeatDetails/${id}`,'POST',ticketList);
}
const getCategoryEventType = async () => {
  const response=await managerApiRequest("/Manager/getEventType",'GET');
  return response.data;
}
const getAllEventData = async (managerId: string) => {
  const response=await managerApiRequest(`/Manager/getAllEventData/${managerId}`,'GET');
    return response.data.data;
}
const handlePreviousEvents = async (id: string) => {
  const response=await managerApiRequest(`/getPreviousEventDetails/${id}`,'GET');
    return response.data;
}
const updateEvent = async (eventDetails: FormData) => {
  return await managerApiRequest('updateEvent','POST',eventDetails);
};
const fetchSocialEventDetails = async (id: string) => {
  const response=await managerApiRequest(`/getPreviousTicketDetails/${id}`,'GET')
    return response.data;
}
const updateTicketService = async (ticketToUpdate: TicketType) => {
  const response=await managerApiRequest(`/updateSeatInfo`,'POST',ticketToUpdate);
  return response.data;
}



export { createEventpost, createEventSeatDetails, getCategoryEventType, getAllEventData, handlePreviousEvents, updateEvent, fetchSocialEventDetails, updateTicketService }