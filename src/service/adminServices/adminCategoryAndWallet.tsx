import { adminApiRequest } from "../../utils/apiHelper/adminApiHelper";
const getCategoryDetails=async()=>{
    return await adminApiRequest('/admin/category','GET');
}
const updateCategoryBlockStatus = async (categoryId: string, updatedStatus: boolean) => {
    const response=await adminApiRequest('/admin/categoryIsBlock','POST',{categoryId,updatedStatus});
        if (response && response.result) {
            return {
                success: true,
                result: response.result,
            };
        } else {
            return { success: false, message: "Invalid response format" };
        }
  
};


const addNewCategoryDetails=async(formData:{[key:string]:string}):Promise<any>=>{
    return await adminApiRequest('/admin/addCategory','POST',formData);
}


const editSelectedCategory=async(category:string,categoryId:string)=>{
    return await adminApiRequest(`/admin/editSingleCategory/${categoryId}`,'POST',{category})
}


const  fetchSelectedCategory=async(categoryId:string)=>{
return await adminApiRequest(`/admin/fetchSelectedCategory/${categoryId}`,'GET');
}

const fetchAdminWallet=async()=>{
    const response=await adminApiRequest(`/admin/fetchAdminWallet`,'GET');
    return response.result;
}
export  {getCategoryDetails,addNewCategoryDetails,updateCategoryBlockStatus,fetchSelectedCategory,editSelectedCategory,fetchAdminWallet};


