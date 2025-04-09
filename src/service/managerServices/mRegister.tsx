import MANAGER_API from "../../utils/managerAxiosInstance";

const ManagerRegister=async(formData:{[key:string]:string})=>{
    console.log(formData);
    try {
     
        const response = await MANAGER_API('/mSubmit', {
            method: 'POST',
       
            data: formData,
        });

        const data = response.data.otpData; // Assuming 'otpData' is the correct key from your response
        return data; // Return the OTP or any other relevant data
    } catch (error) {
        console.error("Error during registration:", error);
        return undefined; // Or throw an error if you want to handle it upstream
    }
}
    const mVerifyOtp=async(otpData:string,formData:{[key:string]:string})=>{

        console.log('Verifying OTP:', otpData);
        console.log("from client",formData);
        
        try {
            const dataToSend={
                otp:otpData,
                ...formData
            }
            const response = await MANAGER_API('/MverifyOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:dataToSend
            });
    
            const data = await response.data; 
            console.log("VerifyOtp",data);
            return data; 
        } catch (error) {
            console.error("Error during OTP verification:", error);
            throw error 
        }
        
    }

    const managerLogin=async(formData:{[key:string]:string})=>{
        try{
    
    const response = await MANAGER_API('/Mlogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data:formData
    });
    const data=response.data;
    console.log("hai",data);
    return data;
}catch(error){
    console.error("Error during User Login:", error);
    return undefined; 
}
    }



    const forgotPasswordForManager=async(email:string)=>{
        try{
            console.log("Hello from here");
            
    
    const response = await MANAGER_API('/forgotM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data:{email}
    });
    const data=response.data.message;
    console.log("hai",data);
    return data;
}catch(error){
    console.error("Error during User Login:", error);
    return undefined; 
}
    }

    const verifyOtpForgotForManager = async (otpData:string,email:string) => {
        console.log('Verifying OTP:', otpData);
        const dataToSend={
            otp:otpData,
            email:email
        }
        try {
            const response = await MANAGER_API('/verifyForgotOtpM', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:dataToSend
            });
    
            const data = response.data; 
            console.log(data)
            return {data,email}; 
        } catch (error) {
            console.error("Error during OTP verification:", error);
            return undefined; 
        }
    }
    
    const ManagerResetPassword1 = async (email:string,formData:{ [key: string]: string }) => {
        console.log('Verifying email at resetPassword:', email);
        console.log("from client",formData);
        
        try {
            const dataToSend={
                email:email,
                ...formData
            }
            const response = await MANAGER_API('/resetPasswordM', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:dataToSend
            });
    
            const data = response.data.message; 
            return data; 
        } catch (error) {
            console.error("Error during OTP verification:", error);
            return undefined; 
        }
    }


    const getmanagerDetails = async (otpData:string,email:string) => {
    const response = await MANAGER_API("/Manager/getOffers",{
        method: "GET",
        
        withCredentials: true,
      });
      console.log('suucesss from offer');
      const result = await response.data;
      console.log("Have",result.message);
      return result;

    }

    const updateManagerData = async (formData:{[key:string]:string}) => {

        console.log("From front",formData);
        
        const response = await MANAGER_API("/updateManagerData",{
            method: "POST",
            data:formData,
            
            withCredentials: true,
          });
          console.log('suucesss from offer');
          const result = await response.data;
          console.log("Have",result.message);
          return result;
    
        }


        
    const updateManagerPassword = async (formData:{[key:string]:string}) => {

        console.log("From front",formData);
        
        const response = await MANAGER_API("/changeManagerPassword",{
            method: "POST",
            data:formData,
            
            withCredentials: true,
          });
          console.log('suucesss from offer');
          const result = await response.data;
          console.log("Have",result.message);
          return result;
    
        }
        const getAManagerDetails = async (companyName: string): Promise<any> => {
            try {
                const response = await MANAGER_API(`/managerProfile/${companyName}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // To make sure cookies/session are sent with the request
                });
                const data = response.data.data;
        
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
        



        


    
    

    

    

    




    


export  {ManagerRegister,mVerifyOtp,managerLogin,forgotPasswordForManager,verifyOtpForgotForManager,ManagerResetPassword1,getmanagerDetails,updateManagerData,updateManagerPassword,getAManagerDetails};