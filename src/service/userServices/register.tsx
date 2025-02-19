import axios from "axios";
axios.defaults.withCredentials=true;
import API from "../../utils/axiosInstance";


const fetchSocialEventDetails=async()=>{
    try {
        const response = await API('/fetchEventData', {
        
        });

        const data=response.data;
        console.log("Data",data);
        return data;
        


    } catch (error) {
        console.error("Error during event fetching:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }

}
const register = async (formData: { [key: string]: string }) => {
    console.log("formData from client service", formData.email);
    try {
     
        const response = await API('/submit', {
            method: 'POST',
            data: formData,
        });

        const data = response.data.message; // Assuming 'otpData' is the correct key from your response
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
};

const verifyOtp = async (otpData:string,formData:{ [key: string]: string }) => {
    console.log('Verifying OTP:', otpData);
    console.log("from client",formData);
    
    try {
        const dataToSend={
            otp:otpData,
            ...formData
        }
        const response = await API('/verifyOtp', {
            method: 'POST',
            data:dataToSend
        });

        const data = response.data; 
        return data; 
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return undefined; 
    }
}
    const userLogin=async(formData:{[key:string]:string})=>{
        try{
    const response = await API('/login', {
        method: 'POST',
        data:formData
    });
    console.log("hello from login",response.data);
    const user=response.data.data
    const data=response.data.message;
    const categoryNames=response.data.categoryNames
    console.log("hai",data);
    console.log(response,categoryNames);
    console.log("User",user);
    return {data,categoryNames,user};
}catch(error){
    console.error("Error during User Login:", error);
    return undefined; 
}
    }

const GoogleAuth=async(response:Object)=>{
    const res = await API('/googleAuth', {
        method: 'POST',
        data: { code: response },
    });
    const data = await res.data;
    console.log('User Data:', data);
    return data
}

const forgotPassword=async(email:string)=>{
    console.log("step",email);
        try{
    const response = await API('/forgotEmail', {
        method: 'POST',
        data:{email:email}
    });
    console.log("Came back");
    const data=response.data.message;
    console.log("hai",data);
    console.log(response.data.data);
    return data;
}catch(error){
    console.error("Error during User Login:", error);
    return undefined; 
}
    }

    const verifyOtpForForgot = async (otpData:string,email:string) => {
        console.log('Verifying OTP:', otpData);
        const dataToSend={
            otp:otpData,
            email:email
        }
        try {
            const response = await API('/verifyForgotOtp', {
                method: 'POST',
                data:dataToSend
            });
            const data = response.data.data; 
            console.log(data)
            return {data,email}; 
        } catch (error) {
            console.error("Error during OTP verification:", error);
            return undefined; 
        }
    }


    const resetPassword = async (email:string,formData:{ [key: string]: string }) => {
        console.log('Verifying email at resetPassword:', email);
        console.log("from client",formData);
        try {
            const dataToSend={
                email:email,
                ...formData
            }
            const response = await API('/resetPassword', {
                method: 'POST',
                data:dataToSend
            });
            const data = response.data.message; 
            return data; 
        } catch (error) {
            console.error("Error during OTP verification:", error);
            return undefined; 
        }
    }
 

    const getEventDataFromDB=async(category:string)=>{
        console.log('cs',category);
        const url = `/user/events/${category}`;
        const response = await API(url, {
            method: 'GET',
            withCredentials:true
        });
console.log(response?.data.data)
        const data = response?.data.data.user;
        console.log("checking123",data);
        return data;
    }
    const handleProfileData=async(user_id:string)=>{
    console.log("Hai from Profile",user_id);
        const response = await API(`/profile/${encodeURIComponent(user_id)}`,{
            method: 'GET',
            withCredentials:true  
    });
        const data = response?.data.data;
        console.log("checking",data);
        return data;
    }

    const getCategoryDataDetails=async()=>{
        console.log("Hai from Profile");
            const response = await API(`/getAllCategoryDetails`,{
                method: 'GET',
                withCredentials:true  
        });
            const data = response?.data.data;
            console.log("checking from Features",data);
            return data;
        }
        
        const handleProfileDetails = async (formData:{[key:string]:string}) => {
    
            console.log("from client",formData);
            try {
            
                const response = await API('/changeUserProfile', {
                    method: 'POST',
                    data:formData
                });
                const data = response.data.data; 
                console.log("boat",data);
                
                return data; 
            } catch (error) {
                console.error("Error during OTP verification:", error);
                return undefined; 
            }
        }
        const generateOtp=async(userId:string)=>{
            console.log("Hai from Profile");
                const response = await API(`/generateOtpForResetPassword/${userId}`,{
                    method: 'GET',
                    withCredentials:true  
            });
                const data = response?.data.data;
                console.log("checking from Features",data);
                return data;
            }
            const verifyOtpForPassword = async (Otp:string) => {
                
                console.log("from client",Otp);
                try {
                
                    const response = await API('/verifyOtpForPassword', {
                        method: 'POST',
                
                    data : {otp: Otp}
                    });
                    const data = response.data.message; 
                
                    
                    return data; 
                } catch (error) {
                    console.error("Error during OTP verification:", error);
                    return undefined; 
                }
            }
            const handleResetPassword = async (password:string,cPassword:string,userId:string) => {
                console.log('Verifying email at resetPassword:', userId);

                try {
                    const dataToSend={
                        userId:userId,
                        password:password,
                        confirmPassword:cPassword
                    }
                    const response = await API('/handleResetPassword', {
                        method: 'POST',
            
                        data:dataToSend
                    });
                    const data = response.data.message; 
                    return data; 
                } catch (error) {
                    console.error("Error during OTP verification:", error);
                    return undefined; 
                }
            }



    


    


  






export { fetchSocialEventDetails,register, verifyOtp,userLogin,GoogleAuth,forgotPassword,verifyOtpForForgot,resetPassword,getEventDataFromDB,handleProfileData,getCategoryDataDetails,handleProfileDetails,generateOtp,verifyOtpForPassword,handleResetPassword};