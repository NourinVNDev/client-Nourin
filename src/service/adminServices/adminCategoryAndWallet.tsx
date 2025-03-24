import ADMIN_API from "../../utils/adminAxiosIntance";
const getCategoryDetails=async()=>{
    try {
       const response = await ADMIN_API('/admin/category', {
                  method: 'GET',
                  withCredentials:true
              });
              const data = response.data;
              console.log("hello", data);
              return data; // Return the resolved data
          } catch (error) {
              console.error('Error fetching category details:', error);
              return []; // Return an empty array or handle it based on your app's needs
          }

}
const updateCategoryBlockStatus = async (categoryId: string, updatedStatus: boolean) => {
    try {
        const response = await ADMIN_API('/admin/categoryIsBlock', {
            method: 'POST',
            data: { categoryId, updatedStatus },
            withCredentials: true, // Move this here
        });

        console.log("Response", response.data);

        // Validate response structure
        if (response.data && response.data.result) {
            return {
                success: true,
                result: response.data.result, // Pass only the result
            };
        } else {
            return { success: false, message: "Invalid response format" };
        }
    } catch (error) {
        console.error('Error updating user block status:', error);
        return { success: false, message: "Failed to update user block status" };
    }
};


const addNewCategoryDetails=async(formData:{[key:string]:string}):Promise<any>=>{
    console.log("Freak",formData);
    
    try {
        const response = await ADMIN_API('/admin/addCategory', {
                   method: 'POST',
                   data:formData,
                   withCredentials:true
               });
               const data1= response.data;
               console.log("hello", data1);
               return data1; // Return the resolved data
           } catch (error) {
               console.error('Error fetching category details:', error);
               return []; // Return an empty array or handle it based on your app's needs
           }

}


const editSelectedCategory=async(category:string,categoryId:string)=>{
    
    try {
        const response = await ADMIN_API(`/admin/editSingleCategory/${categoryId}`, {
                   method: 'POST',
                   withCredentials:true,
                   data:{category}
               });
               const data = response.data;
               console.log("hello hai", data);
               return data; // Return the resolved data
           } catch (error) {
               console.error('Error fetching category details:', error);
               return []; // Return an empty array or handle it based on your app's needs
           }

}


const  fetchSelectedCategory=async(categoryId:string)=>{


    try {
        const response = await ADMIN_API(`/admin/fetchSelectedCategory/${categoryId}`, {
                   method: 'GET',
                   withCredentials:true
               });
               const data = response.data;
               console.log("hello", data);
               return data; // Return the resolved data
           } catch (error) {
               console.error('Error fetching category details:', error);
               return []; // Return an empty array or handle it based on your app's needs
           }
    
}

const fetchAdminWallet=async()=>{
    try {
     
        const response = await ADMIN_API(`/admin/fetchAdminWallet`, {
            method: 'GET',
    
        });
    
        const data = response.data.result;
    console.log("Data from Admin Wallet",data);
        return data; 
    } catch (error) {
        console.error("Error during cancelling event booking:", error);
        return undefined; 
    }


}
export  {getCategoryDetails,addNewCategoryDetails,updateCategoryBlockStatus,fetchSelectedCategory,editSelectedCategory,fetchAdminWallet};


