import { useEffect, useState } from 'react';
import ProfileNavbar from '../../components/userComponents/ProfileNavbar';
import Footer from '../../components/userComponents/Footer';
import Header from '../../components/userComponents/Headers';
import { generateOtp } from '../../service/userServices/register';
// import { RootState } from '../../../App/store';
// import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { verifyOtpForPassword } from '../../service/userServices/register';
import { handleResetPassword } from '../../service/userServices/register';
const ResetPasswordALogin = () => {
  // const email=useSelector((state:RootState)=>state.user.email)
  const userId=localStorage.getItem('userId');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  useEffect(()=>{
    const generateOtpForPassword=async()=>{
      if(!userId){
     throw new Error("UserId is not Provided");
      }
       await generateOtp(userId);
   

    }
    generateOtpForPassword()

  },[]);
  // State for password fields
  const [passwordData, setPasswordData] = useState({
    otp:'',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle submit
  const handleSubmit =async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match!")
      return;
    }
    if(!userId){
      throw new Error('UserId is not found');
    }
    let result = await handleResetPassword(passwordData.newPassword,passwordData.confirmPassword,userId);
    console.log('Password Data Submitted:', result);
    toast.success("Password changed successfully!");
    setPasswordData({otp:'',newPassword:'',confirmPassword:''});
    // Add API call or other logic to process password change
  };

  // Handle button next to Old Password input
  const handleButtonClick =async() => {
    try {
      const result = await verifyOtpForPassword(passwordData.otp);
      if (result === 'Otp are matched') {
        toast.success('OTP verified successfully!')
        setIsOtpVerified(true); // Enable password fields
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.")
      
    }
  };

  return (
    <div>
    <Header />
    <Toaster position="top-center" reverseOrder={false}   toastOptions={{
    duration: 3000, // Default duration for toasts
  }} />
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="w-64 bg-gray-800 text-white">
          <ProfileNavbar />
        </div>
  
        <div className="flex-1 bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Change Password</h1>
  
            <div className="space-y-6">
              <div className="space-y-4 text-sm text-gray-600">
                {/* OTP Input */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="font-medium text-gray-700">Enter the OTP:</label>
                    <input
                      type="text"
                      name="otp"
                      value={passwordData.otp}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white w-full"
                    />
                  </div>
                  <button
                    onClick={handleButtonClick}
                    className="bg-purple-700 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                  >
                    Verify OTP
                  </button>
                </div>
  
                {/* Password Fields */}
                {isOtpVerified ? (
                  <>
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">New Password:</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleInputChange}
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Confirm Password:</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleInputChange}
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white"
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="bg-purple-700 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">New Password:</label>
                      <input
                        type="password"
                        name="newPassword"
                        disabled
                        value={passwordData.newPassword}
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-gray-200 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Confirm Password:</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        disabled
                        value={passwordData.confirmPassword}
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-gray-200 cursor-not-allowed"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
  
  );
};

export default ResetPasswordALogin;
