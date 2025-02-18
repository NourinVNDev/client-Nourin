import ADMIN_API from "../../utils/adminAxiosIntance";
import MANAGER_API from "../../utils/managerAxiosInstance";
const getUserDetails = async () => {
    try {
        const response = await ADMIN_API('/admin/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                withCredentials:true
            },
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
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // To make sure cookies/session are sent with the request
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
            headers: {
                'Content-Type': 'application/json',
            },
            data: { userId, updatedStatus },
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


const updateMangerBlockStatus = async (managerId: string, updatedStatus: boolean) => {
    try {
        const response = await ADMIN_API('/admin/managerIsBlock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: { managerId, updatedStatus },
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









export {getUserDetails,getManagerDetails,updateUserBlockStatus,updateMangerBlockStatus};