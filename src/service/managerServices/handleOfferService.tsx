import MANAGER_API from "../../utils/managerAxiosInstance";
import { OfferData } from "../../validations/userValid/TypeValid";
const getAllOffers=async()=>{
    const response = await MANAGER_API("/getOffers",{
        method: "GET",
        
        withCredentials: true,
      });
      console.log('suucesss from offer');
      const result = await response.data;
      console.log("Have",result.message);
      return result;

}

const fetchSearchData=async(searchTerm:string)=>{

  try {

    console.log('searching the data',searchTerm );
    
    const response = await MANAGER_API(`/searchOfferInput/${searchTerm}`, {
      method: "GET",
      withCredentials: true,
    });
    const result = response.data; // No need to await here, as response.data is already resolved
    console.log("result message", result.message);
    return result;
  } catch (error) {
    console.error("Error in updateEvent:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }

}
const addEventOffer = async (formData:{ [key: string]: string }) => {
  try {

    console.log('data from client123', formData);
    
    const response = await MANAGER_API("/addNewOffer", {
      method: "POST",
 
      data: formData,
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

const getSpecificOffer = async (offerId: string ) => {
  try {

    console.log('data from Offer', offerId);
    
    const response = await MANAGER_API(`/getSelectedOffer/${offerId}`, {
      method: "GET",
 
    
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

const updateOffer=async(formData:OfferData)=>{
  try {console.log("EventData",formData);
   

    
    const response = await MANAGER_API("/updateOffer", {
      method: "POST",
      data:formData,
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

}







export {getAllOffers,addEventOffer,getSpecificOffer,updateOffer,fetchSearchData};