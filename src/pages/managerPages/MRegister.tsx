import React, { useState, useEffect } from "react";
import '../TailwindSetup.css';
import connectionImage from '../../../src/assets/new.avif';
import { useNavigate } from "react-router-dom";
import { ManagerRegister, mVerifyOtp } from '../../service/managerServices/mRegister';
import { forgotPasswordForManager } from '../../service/managerServices/mRegister';
import { registerValidationFormanager } from "../../validations/managerValid/RegisterValid";
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';

const MRegister: React.FC = () => {
    const navigate = useNavigate();
    const [isOtp, setIsOtp] = useState(false);
    const [formData, setFormData] = useState({
        firmName: "",
        email: "",
        experience: "",
        password: "",
        confirmPassword: "",
        phoneNo: "",
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [resendVisible, setResendVisible] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [otpError, setOTPError] = useState<string>('');

    useEffect(() => {
        let countdown: number | null = null;
        if (isOtp) {
            console.log("Bang");
            
            
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

    const handleResendOtp = async () => {
        try {
            setOtp(['', '', '', '', '', '']);
            setOTPError('');
            setTimer(30);

          
            await forgotPasswordForManager(formData.email);
            toast.success("OTP has been resent to your email.");
        } catch (error) {
            console.error("Failed to resend OTP:", error);
            alert("Error resending OTP. Please try again.");
        }
    };

   

    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = registerValidationFormanager(formData);
        console.log("Validation Errors:", validationErrors);

        if (validationErrors.length === 0) {
            try {
                const result = await ManagerRegister(formData);
                console.log("Registration Result:", result);
                setIsOtp(true);
                setTimer(30);
                
            } catch (error) {
                console.error("Error registering user:", error);
                toast.error("Registration failed. Please try again.");
            }
        } else {
            setErrors(validationErrors);
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

    const handleVerify = async () => {
        try {
            const otpValue = otp.join("");
            console.log("Verifying OTP:", otpValue);
            const result = await mVerifyOtp(otpValue, formData);
            console.log("Verification Result:", result);
            if (result.message === 'Otp is Matched') {
                toast.success("Otp is Matched");
                navigate("/mLogin");
            }
        } catch (error) {
            console.log("Caught error:", error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "OTP verification failed";
                console.log(message, "OTP ERROR");
                setOTPError("Invalid OTP. Try Again");
                toast.error(message);
            } else {
                console.error("Unexpected error:", error);
                toast.error("An unexpected error occurred");
            }
        }
    };
    return (
        
        <div className="bg-white w-screen min-h-screen flex">
             <Toaster position="top-center" reverseOrder={false}   toastOptions={{
    duration: 3000, // Default duration for toasts
  }} />
            {!isOtp ? (
                <>
               
                    <div className="bg-gray-100 w-full md:w-4/5 flex justify-center items-center p-6">
                        <div className="text-black rounded-xl w-full sm:w-4/5 lg:w-3/4 p-8 shadow-lg">
                            {/* Title */}
                            <h2 className="text-3xl font-semibold mb-6">Create Organization Account</h2>

                            {/* Form */}
                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="firmName" className="block text-gray-700">Organization Name</label>
                                    <input
                                        id="firmName"
                                        type="text"
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        placeholder="Enter your Organization Name"
                                        value={formData.firmName}
                                        onChange={handleData}
                                    />
                                                    {errors.includes("Organization Name is required.") && (
                    <p className="error text-red-500">Organization Name is required.</p>
                )}
                {errors.includes("Organization Name must contain only letters and spaces.") && (
                    <p className="error text-red-500">Organization Name must contain only letters and spaces.</p>
                )}

                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        placeholder="Enter your Organization email"
                                        value={formData.email}
                                        onChange={handleData}
                                    />
                                       {errors.includes("Email is required.") && <p className="error text-red-500">Email is required.</p>}
                {errors.includes("Please enter a valid email address.") && (
                    <p className="error text-red-500">Please enter a valid email address.</p>
                )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="experience" className="block text-gray-700">Year of Experience</label>
                                    <input
                                        id="experience"
                                        type="text"
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        placeholder="Enter your Year of Experience"
                                        value={formData.experience}
                                        onChange={handleData}
                                    />
                                    {errors.includes("Years of Experience is required.") && (
                    <p className="error text-red-500">Years of Experience is required.</p>
                )}
                {errors.includes("Years of Experience must be a number.") && (
                    <p className="error text-red-500">Years of Experience must be a number.</p>
                )}
                                </div>
                                <div className="mb-6 flex items-center space-x-4">
                                    <div className="flex flex-col w-1/2">
                                        <label htmlFor="password" className="text-gray-700">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleData}
                                        />
                                          {errors.includes("Password is required.") && (
                    <p className="error text-red-500">Password is required.</p>
                )}
                {errors.includes("Password must be at least 8 characters long.") && (
                    <p className="error text-red-500">Password must be at least 8 characters long.</p>
                )}
                {errors.includes("Password must contain at least one uppercase letter.") && (
                    <p className="error text-red-500">Password must contain at least one uppercase letter.</p>
                )}
                {errors.includes("Password must contain at least one lowercase letter.") && (
                    <p className="error text-red-500">Password must contain at least one lowercase letter.</p>
                )}
                {errors.includes("Password must contain at least one number.") && (
                    <p className="error text-red-500">Password must contain at least one number.</p>
                )}
                {errors.includes("Password must contain at least one special character (!@#$%^&*).") && (
                    <p className="error text-red-500">Password must contain at least one special character (!@#$%^&*).</p>
                )}
                                      
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                            placeholder="Enter the password again"
                                            value={formData.confirmPassword}
                                            onChange={handleData}
                                        />
                                       {errors.includes("Confirm password is required.") && (
                    <p className="error text-red-500">Confirm password is required.</p>
                )}
                {errors.includes("Passwords do not match.") && <p className="error text-red-500">Passwords do not match.</p>}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phoneNo" className="block text-gray-700">Phone No</label>
                                    <input
                                        id="phoneNo"
                                        type="tel"
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        placeholder="Enter your Phone Number"
                                        value={formData.phoneNo}
                                        onChange={handleData}
                                    />
                                {errors.includes("Phone number is required.") && (
                    <p className="error text-red-500">Phone number is required.</p>
                )}
                {errors.includes("Phone number must be exactly 10 digits.") && (
                    <p className="error text-red-500">Phone number must be exactly 10 digits.</p>
                )}
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
                                    onClick={() => navigate('/mLogin')}
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
                <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-screen min-h-screen flex justify-center items-center p-6">
              <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-96 p-8">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">OTP Verification</h2>
                  <p className="text-center text-gray-600 mb-4">We've sent a 6-digit OTP to your email.</p>
          
                  {otpError && (
                      <p className="text-center text-red-500 text-sm mb-2">{otpError}</p>
                  )}
                              <div className="flex justify-center gap-2 mb-4">
                                {/* OTP Input Boxes */}
                                {otp.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`} // Unique ID for each input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleChangeOne(e, index)}
                                        maxLength={1}
                                        className="w-10 h-10 text-center border border-gray-400 rounded-md bg-white text-black focus:ring-2 focus:ring-gray-600"
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
    );
}

export default MRegister;
