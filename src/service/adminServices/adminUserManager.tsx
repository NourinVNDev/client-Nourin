import ADMIN_API from "../../utils/adminAxiosIntance";
import { adminApiRequest } from "../../utils/apiHelper/adminApiHelper";

const getUserDetails = async () => {
    return await adminApiRequest('/admin/users','GET');
};
const getManagerDetails = async (): Promise<any> => {
    const response=await adminApiRequest(`/admin/managers`,'GET');
        const data = response.result;
        if (!data) {
            console.error("No data found for the given company name");
            return null;
        }
        return data;
};
const updateUserBlockStatus = async (userId: string, updatedStatus: boolean) => {
    const response=await adminApiRequest('/admin/toggleIsBlock','POST',{userId,updatedStatus})
        if (response && response.result) {
            return {
                success: true,
                result: response.result, 
            };
        } else {
            return { success: false, message: "Invalid response format" };
        }
};
const updateMangerBlockStatus = async (managerId: string, updatedStatus: boolean) => {
    const response=await adminApiRequest('/admin/managerIsBlock','POST',{managerId,updatedStatus});
        if (response && response.result) {
            return {
                success: true,
                result: response.result,
            };
        } else {
            return { success: false, message: "Invalid response format" };
        }
};
const fetchEventsAndBookingData=async(managerId:string)=>{
    const response=await adminApiRequest(`/admin/managerEvents/${managerId}`,'GET')
        const data = response.result;

        if (!data) {
            console.error("No data found for the given company name");
            return null;
        }
        return data;
}
export {getUserDetails,getManagerDetails,updateUserBlockStatus,updateMangerBlockStatus,fetchEventsAndBookingData};