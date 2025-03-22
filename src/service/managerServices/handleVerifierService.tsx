import MANAGER_API from "../../utils/managerAxiosInstance";
const fetchAllVerifiers=async()=>{
    try {
        const response = await MANAGER_API(`/fetchAllVerifier`, {
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

export {fetchAllVerifiers,updateVerifierStatus}
