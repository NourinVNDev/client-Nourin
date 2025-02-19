
import API from "../../utils/axiosInstance";
const CheckOfferAvailable=async (category:string)=>{
    console.log("MAAAHN");
    try {
     
        const response = await API(`/post/checkOfferAvailable/${category}`, {
            method: 'GET',
    
        });

        const data = response.data;
   console.log("Data form unique",data);
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}

export {CheckOfferAvailable}