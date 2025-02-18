import NavBar from "../../components/managerComponents/NavBar";
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import { useParams } from "react-router-dom";
import { getAManagerDetails } from "../../service/managerServices/mRegister";
import { useEffect, useState } from "react";
import { updateManagerData, updateManagerPassword } from "../../service/managerServices/mRegister";
import toast, { Toaster } from "react-hot-toast";

const ManagerProfile = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const [managerProfile, setManagerProfile] = useState({
    firmName: '',
    email: '',
    phoneNo: '',
    password: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const managerProfile = async () => {
      try {
        console.log("Hello");

        if (!companyName) {
          toast.error('Company Name is required');
        } else {
          const result = await getAManagerDetails(companyName);
          setManagerProfile({
            firmName: result.firmName || '',
            email: result.email || '',
            phoneNo: result.phoneNo || '',
            password: result.password || ''
          });
        }
      } catch (error) {
        console.error("Error fetching manager details:", error);
      }
    };

    managerProfile();
  }, [companyName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setManagerProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "new-password") setNewPassword(value);
    if (id === "confirm-password") setConfirmPassword(value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!managerProfile.phoneNo.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }
    const formData = {
      phone: managerProfile.phoneNo,
      email: managerProfile.email
    };
    const result = await updateManagerData(formData);
    if (result.message === 'Event data fetched successfully') {
      toast.success("Manager details updated successfully");
    } else {
      toast.error("Can't edit Manager Profile");
    }
  };

  const handlePasswordChecking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = {
      newPassword, // Send only the new password
      email: managerProfile.email
    };

    const result = await updateManagerPassword(formData);
    if (result.message === "Manager Password updated successfully") {
      toast.success("Manager Password updated successfully");
      // Clear the password fields after successful update
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error("Can't update password");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        duration: 3000, // Default duration for toasts
      }} />

      <div className="flex flex-1 w-full">
        {/* Navigation Bar */}
        <NavBar />
        <div className="flex flex-col items-center flex-1 bg-gray-100">
          <div className="mt-10"></div>
          <div className="flex flex-row gap-10 w-full max-w-5xl">
            {/* User Details Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                User Details
              </h2>
              <form onSubmit={handleFormSubmit}>
                {/* Firm Name */}
                <div className="mb-4">
                  <label htmlFor="firmName" className="block text-sm font-medium text-gray-700">
                    Firm Name
                  </label>
                  <input
                    type="text"
                    id="firmName"
                    disabled
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    value={managerProfile.firmName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email Address */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    disabled
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    value={managerProfile.email}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNo"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    value={managerProfile.phoneNo}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Password Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Password Management
              </h2>
              <form onSubmit={handlePasswordChecking}>
                {/* New Password */}
                <div className="mb-4">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    value={newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ManagerProfile;
