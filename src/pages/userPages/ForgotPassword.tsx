
import React, { useState } from 'react';
import connectionImage from '../../../src/assets/connection.jpeg'; 
import '../TailwindSetup.css';
import { forgotPassword } from '../../service/userServices/register';
import { useNavigate } from 'react-router-dom';
import toast,{Toaster} from 'react-hot-toast';







const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
     
        setEmail(e.target.value);
    };


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Email:', email);
    
      try {
        const result = await forgotPassword(email);
        if (result === 'OTP Success') {
            console.log("Cant find");
            
          navigate(`/otpPage/${email}`);
        } else {
            toast.error('Email is not Correct!');
        }
      } catch (error) {
        console.error('Error during Reset Password:', error);
        alert('An error occurred during password resetting. Please try again later.');
      }
    };
    return (
        <div className="bg-white w-screen min-h-screen flex">
                <Toaster position="top-center" reverseOrder={false}   toastOptions={{
    duration: 3000, // Default duration for toasts
  }} />
            {/* Left Section: Form */}
            <div className="bg-gray-100 w-full md:w-4/5 flex justify-center items-center p-6">
                <div className="text-black rounded-xl w-full sm:w-4/5 lg:w-3/4 p-8 shadow-lg">
                    {/* Title */}
                    <h2 className="text-3xl font-semibold mb-6">Email for Password-Reset</h2>

                    {/* Form */}
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleData}
                                required
                            />
                        </div>
                      

                        <button
                            type="submit"
                            className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                        >
                            Submit
                        </button>
                    </form>

          

               

             
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
                        className="w-3/4 h-[300px] object-cover mt-7"  // Full width and 300px height
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
