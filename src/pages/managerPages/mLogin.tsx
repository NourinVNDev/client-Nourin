import React, { useState } from 'react';
import connectionImage from '../../../src/assets/new.avif'; 
import '../TailwindSetup.css';
import { managerLogin } from '../../service/managerServices/mRegister';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../App/store';
import { useDispatch, UseDispatch } from 'react-redux';
import { setManagerDetails } from '../../../Features/managerSlice';
const MLogin: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch=useDispatch();

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
        let result = await managerLogin(formData);
        console.log("User Data checking",result.user);
        
        if (result.message === 'Login successful.' && result.user.isBlock===false){
            const managerData={
                _id:result.user._id,
                companyName:result.user.firmName,
                email:result.user.email
            }
            dispatch(setManagerDetails(managerData));
            localStorage.setItem('managerAuth','true');
            localStorage.setItem('ManagerName',managerData.companyName);
            navigate('/Manager/dashboard', { replace: true });
        }else if(result?.message ===  'Login Successful.' ||     result?.user.isBlock===true){
            setErrorMessage('Manager is Blocked by Admin');
        }else {
            setErrorMessage('Username and Password do not match');
        }
    };

    return (
        <div className="bg-white w-screen min-h-screen flex">
            {/* Left Section: Form */}
            <div className="bg-gray-100 w-full md:w-4/5 flex justify-center items-center p-6">
                <div className="text-black rounded-xl w-full sm:w-4/5 lg:w-3/4 p-8 shadow-lg">
                    {/* Title */}
                    <h2 className="text-3xl font-semibold mb-6">Login to Your Business Account</h2>

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

                        {/* Forgot Password Link */}
                        <div className="mt-4 text-center">
                            <a href="/forgot-passwordM" className="text-blue-600 hover:text-blue-800">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-4 text-center">
                            <p>Don't have an account? 
                                <a href="/mRegister" className="text-blue-600 hover:text-blue-800">
                                    Sign Up
                                </a>
                            </p>
                        </div>
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
                        className="w-3/4 h-[300px] object-cover mt-7"  // Full width and 400px height
                    />
                </div>
            </div>
        </div>
    );
};

export default MLogin;
