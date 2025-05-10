import ADMIN_API from "../../utils/adminAxiosIntance";

const getUserDetails = async () => {
    try {
        const response = await ADMIN_API('/admin/users', {
            method: 'GET',
            withCredentials:true
        });
        const data = response.data;
        console.log("hello", data);
        return data; // Return the resolved data
    } catch (error) {
        console.error('Error fetching user details:', error);
        return []; // Return an empty array or handle it based on your app's needs
    }
};



const getManagerDetails = async (): Promise<any> => {
    try {
        const response = await ADMIN_API(`/admin/managers`, {
            method: 'GET',


        });
        const data = response.data.result;

        if (!data) {
            console.error("No data found for the given company name");
            return null; // Or return an error message if needed
        }

        console.log("Manager details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null; // Handle the error appropriately
    }
};

const updateUserBlockStatus = async (userId: string, updatedStatus: boolean) => {
    try {
        const response = await ADMIN_API('/admin/toggleIsBlock', {
            method: 'POST',
     
            data: { userId, updatedStatus },
            
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


const updateMangerBlockStatus = async (managerId: string, updatedStatus: boolean) => {
    try {
        const response = await ADMIN_API('/admin/managerIsBlock', {
            method: 'POST',
        
            data: { managerId, updatedStatus },
       
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
const fetchEventsAndBookingData=async(managerId:string)=>{
    console.log("ManagerId:",managerId);
    try {
        const response = await ADMIN_API(`/admin/managerEvents/${managerId}`, {
            method: 'GET',
      

        });
        const data = response.data.result;

        if (!data) {
            console.error("No data found for the given company name");
            return null;
        }

        console.log("Manager details:", data);
        return data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null; 
    }


    

}









export {getUserDetails,getManagerDetails,updateUserBlockStatus,updateMangerBlockStatus,fetchEventsAndBookingData};