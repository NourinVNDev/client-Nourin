import { useState } from "react";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
import { handleVerifierData } from "../../service/verifierServices/verifierLogin";
import { useNavigate } from "react-router-dom";
import toast,{Toaster} from "react-hot-toast";

import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";


const HomePage = () => {
    const [formInput, setFormInput] = useState<VerifierData>({
        name: "",
        email: "",
        password: "",
    });
    const navigate=useNavigate();
    const companyName=useSelector((state:RootState)=>state.verifier.companyName);

    const handleVerifierForm = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (companyName) {
            const formattedCompanyName = companyName || "";
    
            const result = await handleVerifierData(formInput, formattedCompanyName);
            console.log("Welcome", result);
    
            if (result?.message === "Manager has already accepted your request") {
                navigate("/verifier/listAllEvents");
            } else {
                toast.error(result?.message || "Unknown error");
            }
        }
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen">
             <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />
            <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

                    <form onSubmit={handleVerifierForm}>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-500"
                                value={formInput.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-semibold mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="example@email.com"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-500"
                                value={formInput.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-600 font-semibold mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="********"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-500"
                                value={formInput.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
