import MANAGER_API from "../../utils/managerAxiosInstance";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
const fetchAllVerifiers=async(managerName:string)=>{
    try {
        const response = await MANAGER_API(`/fetchAllVerifier/${managerName}`, {
          method: "GET",
          withCredentials: true,
        });
        const result = response.data; // No need to await here, as response.data is already resolved
        console.log("fetching verifiers", result);
        return result.data;
      } catch (error) {
        console.error("Error in verifier:", error);
        throw error; // Rethrow the error to handle it in the calling function
      }


}
const updateVerifierStatus=async(verifierId:string)=>{
    try {
      console.log("VerifierId",verifierId);
      
        const response = await MANAGER_API(`/updateVerifierStatus/${verifierId}`, {
          method: "GET",
          withCredentials: true,
        });
        const result = response.data; // No need to await here, as response.data is already resolved
        console.log("fetching verifiers", result);
        return result.data;
      } catch (error) {
        console.error("Error in verifier:", error);
        throw error; // Rethrow the error to handle it in the calling function
      }

}

const fetchAllCompanyEvents=async(companyName:string)=>{
  try {
    console.log('Your CompanyName',companyName);
    const response = await MANAGER_API(`/fetchEventsName/${companyName}`, {
        method: "GET",
    });

    const data = response.data;
    console.log("Data fetched:", data);
    return data;
} catch (error) {
    console.error("Error fetching while retrtieving event Name:", error);
    return undefined;
}

}

const postNewVerifier=async(formInput:VerifierData,companyName:string)=>{
  try {
    console.log("Ya");
    console.log("Entered Form Input:", formInput);

    const formData = {
        ...formInput,
        companyName: companyName || "", 
    };

    console.log("FormData", formData);

    const response = await MANAGER_API(`/addNewVerifier`, {
        method: "POST",
        data: formData,
    });

    const data = response.data;
    console.log("Data:", data);
    return data;
} catch (error) {
    console.error("Error fetching existing review and rating:", error);
    return undefined;
}

}
const fetchSeletedVerifierData=async(verifierId:string)=>{
  console.log(verifierId);
  try {
  
    const response = await MANAGER_API(`/fetchVerifierDetails/${verifierId}`, {
        method: "GET",
    });

    const data = response.data;
    console.log("Data fetched:", data);
    return data;
} catch (error) {
    console.error("Error fetching while retrtieving event Name:", error);
    return undefined;
} 

}
const updateVerifierData=async(formattedValues:VerifierData,companyName:string)=>{
  try {

    console.log("Entered Form Input:", formattedValues);

    const formData = {
       verifierName:formattedValues.verifierName,
       email:formattedValues.email,
       Events:formattedValues.Events,
        companyName: companyName || "", 
        _id:formattedValues._id
    };

    console.log("FormData", formData);

    const response = await MANAGER_API(`/updateVerifier`, {
        method: "POST",
        data: formData,
    });

    const data = response.data;
    console.log("Data:", data);
    return data;
} catch (error) {
    console.error("Error fetching existing review and rating:", error);
    return undefined;
}
}

export {fetchAllVerifiers,updateVerifierStatus,fetchAllCompanyEvents,postNewVerifier,fetchSeletedVerifierData,updateVerifierData}
