import React, { useState,useEffect } from "react";
import '../TailwindSetup.css';
import connectionImage from '../../../src/assets/new.avif'; 
import {register,verifyOtp,handleResentOtp} from '../../service/userServices/register';
import { useNavigate } from "react-router-dom";
import { registerValidation } from "../../validations/userValid/RegisterValid";
import toast,{Toaster} from "react-hot-toast";
import axios from "axios";

const Register: React.FC = () => {

    const navigate=useNavigate();
    const [isOtp, setIsOtp] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNo: ''
    });
    const [otp, setOtp] = useState(['', '', '', '', '', '']); 

    const [timer, setTimer] = useState(30); 
    const [resendVisible, setResendVisible] = useState(false);
   
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpError,setOTPError]=useState<string>('')

  
      useEffect(() => {
    let countdown: number | null = null;
    if (isOtp) {
    
      setResendVisible(false);
      countdown = window.setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown!);
            setResendVisible(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [isOtp,timer]);


  // const TimerCount=async()=>{
  //   let countdown: number | null = null;
  //   if (isOtp) {
  //     setTimer(30);
  //     setResendVisible(false);
  //     countdown = window.setInterval(() => {
  //       setTimer((prevTimer) => {
  //         if (prevTimer <= 1) {
  //           clearInterval(countdown!);
  //           setResendVisible(true);
  //           return 0;
  //         }
  //         return prevTimer - 1;
  //       });
  //     }, 1000);
  //   }

  //   return () => {
  //     if (countdown) clearInterval(countdown);
  //   };

  // }

    
    const handleResendOtp = async () => {
        try {

          
            setOtp(['', '', '', '', '', '']);
            setOTPError('');
            setTimer(30);

            await handleResentOtp(formData.email);

          
        } catch (error) {
            console.error("Failed to resend OTP:", error);
            alert("Error resending OTP. Please try again.");
        }
    };
    


    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        // Validate form data
        const validationResult = await registerValidation(formData);


        console.log("error checking",validationResult);
    
        const { success, errors } = validationResult;

        if (success) {
            console.log('Form Submitted Successfully');
            try {
              
                const result=await register(formData); // Await the register function
              if(result.error){
                toast.error(result.error);
              }else{
                console.log("Result Details:",result);
                
                setIsOtp(true);
                setTimer(30);
                console.log("User Registered Details:", result.message);

              }

            } catch (error) {
                console.error("Error registering user:", error);
                alert("Registration failed. Please try again.");
            }

        }
            // Handle form submission (e.g., send data to the server)
         else {
            setErrors(errors as Record<string, string>);
        }
        
       
      
    };
    

    const handleChangeOne = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

     
        if (/^[0-9]*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setIsOtp(true);
            setOtp(newOtp);

            
            if (value) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };
    const handleVerify = async() => {

      try {
        
        const otpValue = otp.join(''); 
        console.log("Verifying OTP:", otpValue);

        const result=await verifyOtp(otpValue,formData);
        if(result.success){
          navigate('/login');
        }
        console.log("Result of  verifyOtp",result);

      } catch (error) {
        if(error instanceof axios.AxiosError){
          console.log(error.response?.data.message,"OTP ERROR")
          setOTPError(error.response?.data.message)
          toast.error(error.response?.data.message)
        }else{
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    };  

    return (
<div className="w-screen min-h-screen h-screen overflow-hidden">
<div className="bg-white w-screen min-h-screen flex">
<Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />
            {/* Conditional Rendering */}
            {!isOtp ? (
                <>
                    {/* Left Section: Form */}
                    <div className="bg-gray-100 w-full md:w-4/5 flex justify-center items-center p-6 ">
                        <div className="text-black rounded-xl w-full sm:w-4/5 lg:w-3/4 p-8 shadow-lg">
                            {/* Title */}
                            <h2 className="text-3xl font-semibold mb-6">Create Your Account</h2>

                            {/* Form */}
                            <form className="w-full" onSubmit={handleSubmit}>
                           <div className="mb-4">
                          <label htmlFor="firstName" className="block text-gray-700">First Name</label>
                          <input
                            id="firstName"
                            type="text"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder -gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your First Name"
                            value={formData.firstName}
                            onChange={handleData}
                          />
                          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>} 
                        </div>

                        <div className="mb-4">
                          <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
                          <input
                            id="lastName"
                            type="text"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder -gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your Last Name"
                            value={formData.lastName}
                            onChange={handleData}
                          />
                          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>} {/* Error message for lastName */}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="email" className="block text-gray-700">Email</label>
                          <input
                            id="email"
                            type="email"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder -gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your Email"
                            value={formData.email}
                            onChange={handleData}
                          />
                          {errors.email && <p className="text-red-500">{errors.email}</p>} {/* Error message for email */}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="password" className="block text-gray-700">Password</label>
                          <input
                            id="password"
                            type="password"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder -gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your Password"
                            value={formData.password}
                            onChange={handleData}
                          />
                          {errors.password && <p className="text-red-500">{errors.password}</p>} {/* Error message for password */}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                          <input
                            id="confirmPassword"
                            type="password"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder -gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Confirm your Password"
                            value={formData.confirmPassword}
                            onChange={handleData}
                          />
                          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>} {/* Error message for confirmPassword */}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="phoneNo" className="block text-gray-700">Phone No</label>
                          <input
                            id="phoneNo"
                            type="tel"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder -gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your Phone Number"
                            value={formData.phoneNo}
                            onChange={handleData}
                          />
                          {errors.phoneNo && <p className="text-red-500">{errors.phoneNo}</p>} {/* Error message for phoneNo */}
                        </div>
                           <button
                                    type="submit"
                                    className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                                >
                                    Register
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <span className="text-gray-600">Already have an account? </span>
                                <button
                                    onClick={() => navigate('/')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Login here
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Content */}
                    <div className="bg-gray-100 w-full md:w-2/3 flex justify-center items-start p-8">
                        <div className="flex flex-col items-start w-full pt-20 text-center">
                            <h2 className="font-bold text-black text-3xl">MeetCraft</h2>
                            <h3 className="text-black text-xl mt-2">Crafting Meaningful Connections!</h3>
                            <img
                                src={connectionImage} // Using the imported image
                                alt="MeetCraft Image"
                                className="w-full object-cover mt-7 max-h-[400px]"  // Full width and 400px height
                            />
                        </div>
                    </div>
                </>
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-screen min-h-screen flex justify-center items-center p-6">
              <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-96 p-8">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">OTP Verification</h2>
                  <p className="text-center text-gray-600 mb-4">We've sent a 6-digit OTP to your email.</p>
          
                  {otpError && (
                      <p className="text-center text-red-500 text-sm mb-2">{otpError}</p>
                  )}
          
                  <div className="flex justify-center gap-2 mb-4">
                      {otp.map((value, index) => (
                          <input
                              key={index}
                              id={`otp-input-${index}`}
                              type="text"
                              maxLength={1}
                              value={value}
                              onChange={(e) => handleChangeOne(e, index)}
                              className="w-12 h-12 text-center bg-white text-lg font-semibold text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                      ))}
                  </div>
          
             
          
                  {timer > 0 ? (
                    <>
                      <p className="text-center text-gray-600 mt-4">
                          Resend OTP in <span className="font-semibold">{timer}</span> seconds
                      </p>
                           <button
                           onClick={handleVerify}
                           className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
                       >
                           Verify OTP
                       </button>
                       </>
                  ) : (
                      resendVisible && (
                          <button
                              onClick={handleResendOtp}
                              className="w-full mt-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                          >
                              Resend OTP
                          </button>
                      )
                  )}
              </div>
          </div>
          
            )}
        </div>
        </div>
    );
};

export default Register;