import { Link, useLocation } from "react-router-dom";
import person from "../../assets/person.png";
import { RootState } from "../../../App/store";
import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { postUserProfilePicture } from "../../service/userServices/userProfile";

const ProfileNavbar = () => {
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const firstName = useSelector((state: RootState) => state.user?.firstName ?? "");

  const { profileData = {} } = location.state || {}; // Default profile data

  const [selectedImage, setSelectedImage] = useState<string | null>(
    profileData.profilePicture || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file)); // Preview image

      // Upload the file
      try {
        if(!userId)return;
        const formData = new FormData();
        formData.append('profilePicture', file);
        await postUserProfilePicture(formData,userId);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Trigger file input when clicking the "+" button
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#f8f8f8] text-black min-h-screen flex flex-col w-64">
      {/* Profile section */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <img
            src={selectedImage || person}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mb-2"
          />
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          {/* Upload Button */}
          <button
            onClick={handleButtonClick}
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            +
          </button>
        </div>
        <p className="font-semibold text-lg">{firstName || "User Name"}</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-4 px-4">
        <Link to="/profile" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Profile
        </Link>
        <Link to="/event-history" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Event History
        </Link>
        <Link to="/user/bookedEvent" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Booked
        </Link>
        <Link to="/wallets" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Wallets
        </Link>
        <Link to="/notifications" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Notifications
        </Link>
        <Link to="/user/chat" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Chat
        </Link>
        <Link to="/user/resetPassword" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Reset Password
        </Link>
        <Link to="/logout" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default ProfileNavbar;
