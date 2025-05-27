import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
import MANAGER_API from "../../utils/managerAxiosInstance";
import { OfferData } from "../../validations/userValid/TypeValid";
const getAllOffers=async(managerId:string)=>{
  return await managerApiRequest(`/getOffers/${managerId}`,'GET');
}

const fetchSearchData=async(searchTerm:string)=>{
  return await managerApiRequest(`/searchOfferInput/${searchTerm}`,'GET');
}
const addEventOffer = async (formData:{ [key: string]: string }) => {
  return await managerApiRequest('/addNewOffer','POST',formData);
};

const getSpecificOffer = async (offerId: string ) => {
  return await managerApiRequest(`/getSelectedOffer/${offerId}`,'GET');
};

const updateOffer=async(formData:OfferData)=>{
  return await managerApiRequest('/updateOffer','POST',formData);
}

const fetchManagerWallet=async(managerId:string)=>{
  return await managerApiRequest(`/fetchManagerWallet/${managerId}`,'GET');
}







export {getAllOffers,addEventOffer,getSpecificOffer,updateOffer,fetchSearchData,fetchManagerWallet};