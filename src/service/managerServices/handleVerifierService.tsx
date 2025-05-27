import { managerApiRequest } from "../../utils/apiHelper/managerApiHelper";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
const fetchAllVerifiers=async(managerName:string)=>{
  const response=await managerApiRequest(`/fetchAllVerifier/${managerName}`,'GET');
  return response.data;
}
const updateVerifierStatus=async(verifierId:string)=>{
  const response=await managerApiRequest(`/updateVerifierStatus/${verifierId}`,'GET');
  return response.data;
}

const fetchAllCompanyEvents=async(companyName:string)=>{
  return await managerApiRequest(`/fetchEventsName/${companyName}`,'GET');
}

const postNewVerifier=async(formInput:VerifierData,companyName:string)=>{
    const formData = {
        ...formInput,
        companyName: companyName || "", 
    };
  return await managerApiRequest(`/addNewVerifier`,'POST',formData);

   

}
const fetchSeletedVerifierData=async(verifierId:string)=>{
  return await managerApiRequest(`/fetchVerifierDetails/${verifierId}`,'GET');
}
const updateVerifierData=async(formattedValues:VerifierData,companyName:string)=>{
  const formData = {
       verifierName:formattedValues.verifierName,
       email:formattedValues.email,
       Events:formattedValues.Events,
        companyName: companyName || "", 
        _id:formattedValues._id
    };
return await managerApiRequest(`/updateVerifier`,'POST',formData);
}

export {fetchAllVerifiers,updateVerifierStatus,fetchAllCompanyEvents,postNewVerifier,fetchSeletedVerifierData,updateVerifierData}
