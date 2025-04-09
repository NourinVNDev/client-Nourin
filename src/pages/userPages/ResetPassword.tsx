import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import '../TailwindSetup.css';
import { resetPassword } from "../../service/userServices/register";
import toast,{Toaster} from "react-hot-toast";

const ResetPassword:React.FC=()=>{
    const { email } = useParams<{ email: string }>();
    const [formData, setFormData] = useState({
      password:'',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            alert('Email is missing');
            return; // Return early if email is not available
        }
        console.log('Password:', formData.password);
        console.log('Confirm Password:', formData.confirmPassword);
        if (formData.password !== formData.confirmPassword) {
            toast.error("New Password and Confirm Password do not match!")
            return;
          }else{
            let result = await resetPassword(email, { password: formData.password, confirmPassword: formData.confirmPassword });
    
            if (result=='password Reset Success') {
                navigate('/');
            } else {
                alert(result.message || 'password is not Changing');
            }
          }
        // Assuming resetPassword expects the email and password separately
       
    };
    
    return (
        <div className="min-h-screen w-screen bg-blue-50  flex items-center justify-center"> {/* Added flex, items-center, and justify-center */}

        <Toaster position="top-center" reverseOrder={false} toastOptions={{
            duration: 3000, // Default duration for toasts
        }} />
    
        <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-full max-w-md p-8 rounded-lg shadow-lg"> {/* Added max-w-md, padding, and shadow */}
            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Reset Your Password</h2>
    
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleData}
                        required
                    />
                </div>
    
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleData}
                        required
                    />
                </div>
    
                <button
                    type="submit"
                    className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                >
                    Reset Password
                </button>
            </form>
        </div>
    </div>
        
        
    );
    
    

}
export default ResetPassword;