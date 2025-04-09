import { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import connectionImage from "../../assets/new.avif";
import { checkManagerHaveEvent, sendResendOtp, verifyOtp } from "../../service/verifierServices/verifierLogin";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setVerifierDetails } from "../../../Features/verifierSlice";

const VerifierLogin = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const dispatch=useDispatch()
    
    const [otp, setOtp] = useState<string[]>(new Array(6).fill("")); // Fixed OTP state
    const [showOtpInput, setShowOtpInput] = useState(false);
    const navigate = useNavigate();
    const [timer, setTimer] = useState<number | null>(null);
    const otpInputs = useRef<Array<HTMLInputElement | null>>(
        new Array(6).fill(null)
    );
    const handleToCheckManager = async () => {
        try {
            const result = await checkManagerHaveEvent(email);
            if (result.success) {
                toast.success("OTP sent successfully!");
               
                setShowOtpInput(true);
                setErrorMessage(null);
                setTimer(30);
            }
        } catch (error) {
            if (error instanceof axios.AxiosError) {
                setErrorMessage(error.response?.data.message);
                toast.error("You are not hosting any events");
            } else {
               
                setErrorMessage("This email is not permitted by manager");
            }
        }
    };

    // Timer countdown effect
    useEffect(() => {
        if (timer === null || timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // Handle OTP input change with auto-focus
    const handleOtpChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) { // Allow only single digit
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < otp.length - 1) {
                otpInputs.current[index + 1]?.focus(); // Move to next input
            }
        }
    };

    // Handle OTP deletion with backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus(); // Move focus to previous input
        }
    };

    const handleResendOtp = async () => {
        setOtp(new Array(6).fill("")); // Reset OTP
        const result = await sendResendOtp(email);
        if (result.message === "Resend the OTP again!!") {
            setTimer(30);
        } else {
            toast.error("OTP is not resended!");
        }
    };

    // Handle OTP verification
    const handleOtpVerification = async () => {
        const enteredOtp = otp.join(""); // Combine digits
        const result = await verifyOtp(enteredOtp,email);
        console.log("yes", result);
        if (result.success) {
            localStorage.setItem('verifierAuth','true');
            const formData={
                email:email,
                companyName:''
            }
            dispatch(setVerifierDetails(formData));
            navigate(`/verifier/listAllEvents/${email}`);
        } else {

            setErrorMessage(result.message);
            toast.error(result.message);
        }
    };

    return (
        <div className="bg-white w-screen min-h-screen flex">
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

            <div className="bg-gray-100 w-full md:w-4/5 flex justify-center items-center p-6">
                <div className="text-black rounded-xl w-full sm:w-4/5 lg:w-3/4 p-8 shadow-lg">
                    <h2 className="text-3xl font-semibold mb-6">Login to Verifier Account</h2>

                    <div className="mb-4 flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
                     
                        <br />
                        <label htmlFor="email" className="text-gray-700 font-medium">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="p-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 w-72"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={handleToCheckManager}
                            className="py-2 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200"
                        >
                            Submit
                        </button>
                    </div>

                    {/* Show OTP Input Fields */}
                    {showOtpInput && (
                        <div className="flex flex-col items-center mt-4">
                            <h3 className="text-lg font-semibold mb-2">Enter OTP</h3>
                            <div className="flex gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpInputs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-10 text-center bg-white text-black text-xl font-semibold border-2 border-gray-400 rounded-lg focus:border-gray-800"
                                    />
                                ))}
                            </div>
                            {timer !== null && timer > 0 && (
                                <p className="mt-2 text-gray-600">Resend OTP in {timer} seconds</p>
                            )}
                            {timer === 0 ? (
                                <button
                                    className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                                    onClick={handleResendOtp} // Resend OTP logic
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <button
                                    className="mt-4 py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                                    onClick={handleOtpVerification}
                                >
                                    Verify
                                </button>
                            )}
                        </div>
                    )}

                    {errorMessage && <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>}
                </div>
            </div>

            {/* Right Section: Content */}
            <div className="bg-gray-100 w-full md:w-2/3 flex justify-center items-start p-8">
                <div className="flex flex-col items-start w-full pt-20 text-center">
                    <h2 className="font-bold text-black text-3xl">MeetCraft</h2>
                    <h3 className="text-black text-xl mt-2">Crafting Meaningful Connections!</h3>
                    <img
                        src={connectionImage}
                        alt="MeetCraft Image"
                        className="w-3/4 h-[300px] object-cover mt-7"
                    />
                </div>
            </div>
        </div>
    );
};

export default VerifierLogin;
