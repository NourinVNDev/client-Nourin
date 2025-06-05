import React, { useState } from 'react';
import connectionImage from '../../../src/assets/new.avif'; 
import '../TailwindSetup.css';
import { userLogin } from '../../service/userServices/register';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import {GoogleAuth}  from '../../service/userServices/register';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../App/store';
import { setUserDetails } from '../../../Features/userSlice';
import toast,{Toaster} from 'react-hot-toast';






const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const dispatch=useDispatch<AppDispatch>();




     const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        setErrorMessage(null);  
    };

  


        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            console.log('Email:', formData.email);
            console.log('Password:', formData.password);
            let result = await userLogin(formData);
            console.log("Wait",result);
            
            if ( result?.data==='Login Successful' && result?.user.isBlock===false ) {

                const userData = {
                    _id:result.user._id,
                    firstName: result.user.firstName,
                    lastName:result.user.lastName,
                    phoneNo: result.user.phoneNo,
                    email: result.user.email,
                    profilePhoto:result.user.profilePhoto||null,
                    Address:result.user.address||null,
                    role:'user',
                    location: {
                        coordinates: [
                            result.user.location?.coordinates[0] || 0,
                            result.user.location?.coordinates[1] || 0
                        ] as [number, number]
                    }
                };
                dispatch(setUserDetails(userData));
                localStorage.setItem('userAuth','true');
                toast.success('Login SuccessFull');
                if (userData && userData._id) {
                    console.log("UserId for  Profile",userData._id);
                    localStorage.setItem('userId', userData._id);
                    navigate(`/home`, { replace: true });
                } else {
                    console.log("Invalid user data: _id is missing");
                 
                }
            } else if(result?.data ===  'Login Successful' && result?.user.isBlock===true){
                setErrorMessage('User is Blocked by Admin')
            }else {
                setErrorMessage('Username and Password do not match');
            
            
            }
        };    
    const login = useGoogleLogin({
        onSuccess: async (response) => {
          console.log("Google Login Successful:", response);
      
          // Ensure that you send the response correctly
          let result = await GoogleAuth(response.code);
          console.log("GoogleAuth Result:", result);
      
          if (result.message === 'Login Successful') {
            const userData = {
              firstName: result.data.user.firstName,
              lastName: result.data.user.lastName,
              email: result.data.user.email,
              _id:result.data.user._id,
              phoneNo:result.data.user.phoneNo||null,
              Address:result.data.user.address||null,
              profilePhoto:result.data.user.profilePhoto||null,
              location: {
                coordinates: [
                    result.data.user.location?.coordinates[0] || 0,
                    result.data.user.location?.coordinates[1] || 0
                ] as [number, number]
            },
            role:'user'

            };
      
            // Log user data before dispatching
            console.log("Dispatching User Data:", userData);
      
            localStorage.setItem('userAuth', 'true');
            localStorage.setItem('userId', result.data.user._id);
            dispatch(setUserDetails(userData));
            toast.success("Login Successful");
            navigate('/home', { replace: true });
          } else {
            toast.error('Username and Password do not match');
          }
        },
        flow: 'auth-code',
      });
      
    return (
        <div className="bg-white w-screen min-h-screen flex">
             <Toaster position="top-center" reverseOrder={false}   toastOptions={{
    duration: 3000, // Default duration for toasts
  }} />
            {/* Left Section: Form */}
            <div className="bg-gray-100 w-full md:w-4/5 flex justify-center items-center p-6">
                <div className="text-black rounded-xl w-full sm:w-4/5 lg:w-3/4 p-8 shadow-lg">
                    {/* Title */}
                    <h2 className="text-3xl font-semibold mb-6">Login to Your Account</h2>

                    {/* Form */}
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleData}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleData}
                                required
                            />
                        </div>
                        {errorMessage && (
                            <div className="mb-4 text-red-600 text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                        >
                            Login
                        </button>
                    </form>
                 

                    {/* Forgot Password Link */}
                    <div className="mt-4 text-center">
                        <a href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-4 text-center">
                        <p>Don't have an account? 
                            <a href="/register" className="text-blue-600 hover:text-blue-800">
                                Sign Up
                            </a>
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <div className="mt-6 text-center">
                    <button
                        onClick={() => login()} // Wrap the call to ensure the correct type
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Login with Google
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
                        className="w-3/4 h-[300px] object-cover mt-7"  // Full width and 300px height
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
