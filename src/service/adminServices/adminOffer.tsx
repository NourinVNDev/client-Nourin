import { adminApiRequest } from "../../utils/apiHelper/adminApiHelper";
import { OfferData } from "../../validations/userValid/TypeValid";
const addEventOffer = async (formData:{ [key: string]: string }) => {
  return await adminApiRequest('/addNewOffer','POST',formData);
};
const getAllOffers=async()=>{
  return await adminApiRequest(`/getOffers`,'GET');
}
const getSpecificOffer = async (offerId: string ) => {
  return await adminApiRequest(`/getSelectedOffer/${offerId}`,'GET');
};
const updateOffer=async(formData:OfferData)=>{
  return await adminApiRequest('/updateOffer','POST',formData);
}

export  {addEventOffer,getAllOffers,getSpecificOffer,updateOffer}