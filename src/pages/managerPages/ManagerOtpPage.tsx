import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from "react";
import '../TailwindSetup.css';
import { verifyOtpForgotForManager,forgotPasswordForManager} from "../../service/managerServices/mRegister";
import { useParams } from "react-router-dom";



const ManagerOtpPage:React.FC=()=>{
    const { email } = useParams<{ email: string }>();
    
  if (!email) {
    return <div>Error: Email parameter is missing</div>;
  }
    const navigate=useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30); // Timer for 30 seconds
    const [resendVisible, setResendVisible] = useState(false);
  const [otpError, setOTPError] = useState<string>('');

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
        await forgotPasswordForManager(email);
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
            const otpValue = otp.join('');
            console.log("Verifying OTP:", otpValue);
    

            const result = await verifyOtpForgotForManager(otpValue, email); 
            console.log("cheat",result);
            if(result?.response.message==='OTP Matched'){
                console.log("Black");
                navigate(`/manager/Reset-password/${email}`);
            }

            if (result?.response.message==='OTP is not matched!') {
                setOTPError('Invalid OTP. Try Again');
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
                     className="w-10 h-10 text-center border border-gray-400 rounded-md bg-white text-black focus:ring-2 focus:ring-gray-600"
                            value={value}
                            onChange={(e) => handleChangeOne(e, index)}
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
  
    )

}
export default ManagerOtpPage;