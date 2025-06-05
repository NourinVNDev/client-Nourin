import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
import { OfferData } from "../../validations/userValid/TypeValid";


const fetchManagerOffer=async(managerId:string)=>{
  return await managerApiRequest(`/getOffers/${managerId}`,'GET');
}
const addEventOffer = async (formData:{ [key: string]: string }) => {
  return await managerApiRequest('/addNewOffer','POST',formData);
};
const getSpecificOffer = async (offerId: string ,managerId:string) => {
  return await managerApiRequest(`/getSelectedOffer/${offerId}/${managerId}`,'GET');
};

const updateOffer=async(formData:OfferData)=>{
  return await managerApiRequest('/updateOffer','POST',formData);
}

const fetchManagerWallet=async(managerId:string)=>{
  return await managerApiRequest(`/fetchManagerWallet/${managerId}`,'GET');
}

const getEventDetails=async(managerId:string)=>{
  return await managerApiRequest(`/fetchEventNames/${managerId}`,'GET');
}







export {getSpecificOffer,getEventDetails,addEventOffer,updateOffer,fetchManagerOffer,fetchManagerWallet};