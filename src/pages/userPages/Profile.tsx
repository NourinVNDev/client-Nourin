import { useState, useEffect } from 'react';
import ProfileNavbar from '../../components/userComponents/ProfileNavbar';
import Footer from '../../components/userComponents/Footer';
import Header from '../../components/userComponents/Headers';
import { handleProfileDetails, handleProfileData } from '../../service/userServices/register';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../App/store';
import { updateAddress } from '../../../Features/userSlice';
import { useFormik } from 'formik';
import { profileValidSchema } from '../../validations/userValid/profileValidSchema';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNo: "",
      address: "",
      email: ""
    },
    validationSchema: profileValidSchema,
    onSubmit: async (values) => {
      try {
        const result = await handleProfileDetails(values);
        if (result.user) {
          dispatch(updateAddress(result.user.address));
          toast.success("Profile updated successfully!");
        }
      } catch (error) {
        toast.error("Failed to update profile");
      }
    }
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const response = await handleProfileData(userId);
        if (response.message === "User details retrieved successfully.") {
          formik.setValues({
            firstName: response.user.firstName || "",
            lastName: response.user.lastName || "",
            email: response.user.email || "",
            phoneNo: response.user.phoneNo || "",
            address: response.user.address || ""
          });
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [userId]);

  return (
    <div>
      <Header />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <div className="w-64 bg-gray-800 text-white">
            <ProfileNavbar />
          </div>

          <div className="flex-1 bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="space-y-4 text-sm text-gray-600">
                    {/* First Name */}
                    <div className="flex space-x-4">
                      <div className="flex flex-col w-1/2">
                        <label className="font-medium text-gray-700">First Name:</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white"
                        />
                        {formik.touched.firstName && formik.errors.firstName && (
                          <p className="text-red-500 text-xs">{formik.errors.firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div className="flex flex-col w-1/2">
                        <label className="font-medium text-gray-700">Last Name:</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white"
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                          <p className="text-red-500 text-xs">{formik.errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email (Disabled) */}
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        disabled
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Phone:</label>
                      <input
                        type="text"
                        name="phoneNo"
                        value={formik.values.phoneNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white"
                      />
                      {formik.touched.phoneNo && formik.errors.phoneNo && (
                        <p className="text-red-500 text-xs">{formik.errors.phoneNo}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                      <label className="font-medium text-gray-700">Address:</label>
                      <input
                        type="text"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border-2 border-gray-300 p-2 rounded-md mt-1 bg-white"
                      />
                      {formik.touched.address && formik.errors.address && (
                        <p className="text-red-500 text-xs">{formik.errors.address}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
