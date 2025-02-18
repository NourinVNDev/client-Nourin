import React, { useState,useEffect } from "react";
import '../TailwindSetup.css';
import connectionImage from '../../../src/assets/new.avif'; 
import {register,verifyOtp,forgotPassword} from '../../service/userServices/register';
import { useNavigate } from "react-router-dom";
import { registerValidation } from "../../validations/userValid/RegisterValid";

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

    const [timer, setTimer] = useState(30); // Timer for 30 seconds
    const [resendVisible, setResendVisible] = useState(false);
   
    const [errors, setErrors] = useState<Record<string, string>>({});

  
      useEffect(() => {
    let countdown: number | null = null;
    if (isOtp) {
      setTimer(30);
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
  }, [isOtp]);


  const TimerCount=async()=>{
    let countdown: number | null = null;
    if (isOtp) {
      setTimer(30);
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

  }
    
    const handleResendOtp = async () => {
        try {
            TimerCount();
            setOtp(['', '', '', '', '', '']);

            await forgotPassword(formData.email);
          
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
        const validationResult = registerValidation(formData);


        console.log("error checking",validationResult);
    
        const { success, errors } = validationResult;

        if (success) {
            console.log('Form Submitted Successfully');
            try {
                // Registration logic
                await register(formData); // Await the register function
                setIsOtp(true);
                setTimer(30);
                console.log("User Registered Details:", formData);
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

        // Allow only one digit
        if (/^[0-9]*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setIsOtp(true);
            setOtp(newOtp);

            // Automatically focus on the next input if a digit is entered
            if (value) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };
    const handleVerify = () => {
        const otpValue = otp.join(''); // Combine the OTP values into a single string
        console.log("Verifying OTP:", otpValue);
        // You can add your verification logic here
        verifyOtp(otpValue,formData);
        navigate('/');
        
    };

    return (
        <div className="bg-white w-screen min-h-screen flex">
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
  {errors.firstName && <p className="text-red-500">{errors.firstName}</p>} {/* Error message for firstName */}
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
                                className="w-full h-[400px] object-cover mt-7"  // Full width and 400px height
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white w-screen min-h-screen flex">
                    {/* OTP Confirmation Section */}
                    <div className="bg-gray-100 w-full flex justify-center items-center p-6">
                        <div className="bg-gray-800 text-white rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-6 shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">OTP Sent!</h2>
                            <p className="mb-4">An OTP has been sent to your email. Please check your inbox.</p>

                            <div className="flex justify-center space-x-2 mb-4">
                                {/* OTP Input Boxes */}
                                {otp.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`} // Unique ID for each input
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        value={value}
                                        onChange={(e) => handleChangeOne(e, index)}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerify} // Call handleVerify on button click
                                className="w-full py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition duration-200"
                            >
                                Verify OTP
                            </button>
                            {timer > 0 ? (
                        <p className="text-gray-300 text-center mt-4">
                            Resend OTP in <span className="font-bold">{timer}</span> seconds
                        </p>
                    ) : (
                        resendVisible && (
                            <button
                                onClick={handleResendOtp}
                                className="w-full mt-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition duration-200"
                            >
                                Resend OTP
                            </button>
                        )
                    )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;