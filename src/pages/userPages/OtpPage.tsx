import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from "react";
import '../TailwindSetup.css';
import {verifyOtpForForgot,forgotPassword} from '../../service/userServices/register';
import { useParams } from "react-router-dom";
import toast,{Toaster} from "react-hot-toast";



const OtpPage:React.FC=()=>{
    const { email } = useParams<{ email: string }>();
    
  if (!email) {
    return <div>Error: Email parameter is missing</div>;
  }
    const navigate=useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30); // Timer for 30 seconds
    const [resendVisible, setResendVisible] = useState(false);
  const [otpError,setOtpError]=useState<string>('');
    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(countdown); // Cleanup the interval on component unmount
        } else {
            setResendVisible(true); // Show the "Resend OTP" button
        }
    }, [timer]);

    const handleResendOtp = async () => {
        setOtp(['', '', '', '', '', ''])
        await forgotPassword(email);
        setTimer(30); 
        setResendVisible(false); // Hide the resend button
    };


    const handleChangeOne = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Allow only one digit
        if (/^[0-9]*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
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
    const handleVerify = async () => {
        try {
            const otpValue = otp.join(''); // Combine the OTP values into a single string
            console.log("Verifying OTP:", otpValue);
    
         
            const result = await verifyOtpForForgot(otpValue, email); // Assuming verifyOtpForForgot is async
            console.log("cheat",result);
    
            if (result?.data == 'Otp is Not matched') {
             setOtpError(result.data);
              
             
            } else {
                navigate(`/reset-password/${result?.email}`);
               
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            alert('An error occurred. Please try again.');
        }
    };
    
    return(
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
                            id={`otp-input-${index}`} // Unique ID for each input
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                            value={value}
                            onChange={(e) => handleChangeOne(e, index)}
                        />
                    ))}
                </div>
                {timer > 0 ? (
                    <>
                        <p className="text-black text-center mt-4">
                            Resend OTP in <span className="font-semibold">{timer}</span> seconds
                        </p>
                          <button
                          onClick={handleVerify}
                          className="w-full py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition duration-200"
                      >
                          Verify OTP
                      </button>
                      </>
                    ) : (
                        resendVisible && (
                            <button
                                onClick={handleResendOtp}
                                className="w-full mt-4 py-2 bg-gray-600 rounded-md hover:bg-gray-600 transition duration-200"
                            >
                                Resend OTP
                            </button>
                        )
                    )}
            
       
    </div>
    </div>
    )

}
export default OtpPage;