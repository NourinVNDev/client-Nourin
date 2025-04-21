import { Link, useLocation } from "react-router-dom";
import person from "../../assets/person.png";
import { RootState } from "../../../App/store";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { postUserProfilePicture } from "../../service/userServices/userProfile";
import { setUserDetails } from "../../../Features/userSlice"; // Import Redux action
import { AppDispatch } from "../../../App/store";
import toast,{Toaster} from "react-hot-toast";
import Cropper,{Area} from 'react-easy-crop';
import getCroppedImg from "./CropUserProfile";

const ProfileNavbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  // Get user data from Redux **only once**
  const user = useSelector((state: RootState) => state.user);
  const { firstName = "", profilePhoto = "" } = user;

  const { profileData = {} } = location.state || {}; // Default profile data
  const [selectedImage, setSelectedImage] = useState<string>(profilePhoto || profileData.profilePicture || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area|null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  
  // Update selectedImage when profilePhoto changes
  useEffect(() => {
    if (profilePhoto) {
      setSelectedImage(profilePhoto);
    }
  }, [profilePhoto]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageURL = URL.createObjectURL(file);
      setImageToCrop(imageURL);
      setShowCropModal(true);
    }
  };
  const handleCropConfirm = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
    setSelectedImage(croppedImage.preview); // Set for preview
    setShowCropModal(false);
  
    try {
      if (!userId) return;
      const file = croppedImage.file; // Cropped file
      const formData = new FormData();
      formData.append("profilePicture", file);
      const result = await postUserProfilePicture(formData, userId);
  
      if (result.message === "Profile Photo Uploaded") {
        toast.success('Profile Photo is updated');
        const updatedUserProfile = {
          ...user,
          profilePhoto: result.data.data,
        };
        dispatch(setUserDetails(updatedUserProfile));
      }
    } catch (error) {
      console.error("Error uploading cropped image:", error);
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
            onError={(e) => (e.currentTarget.src = person)} // Fallback in case of error
          />
        
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
        {showCropModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded shadow-lg w-96 h-96 relative">
      <Cropper
        image={imageToCrop!}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
      />
      <button
        onClick={handleCropConfirm}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Crop & Save
      </button>
    </div>
  </div>
)}

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
        <Link to="/user/wallet" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Wallets
        </Link>
        <Link to="/notifications" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
          Notifications
        </Link>
        <Link to="/user/chat/null/null" className="text-black hover:bg-[#e0e0e0] px-4 py-2 rounded-md transition duration-200">
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
