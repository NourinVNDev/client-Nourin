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
            const otpValue = otp.join(''); // Combine the OTP values into a single string
            console.log("Verifying OTP:", otpValue);
    
            // Call OTP verification logic
            const result = await verifyOtpForgotForManager(otpValue, email); // Assuming verifyOtpForForgot is async
            console.log("cheat",result);
            if (!result) {
                return <div>Error: Result return parameter is missing</div>;
              }
            
    
            if (result?.data == 'Otp is Not matched') {
                alert('OTP is not correct');
             
            } else {
                navigate(`/reset-password/${result.email}`);
               
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            alert('An error occurred. Please try again.');
        }
    };
    
    return(
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
    )

}
export default ManagerOtpPage;