
import NavBar from "../../components/adminComponents/NavBar";
import Header from "../../components/adminComponents/Header";
import Footer from "../../components/adminComponents/Footer";
import { useEffect, useState } from "react";
import { getUserDetails, updateUserBlockStatus } from "../../service/adminServices/adminUserManager";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
  phoneNo: string;
  isBlock: boolean;
}

const AdminUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Define how many users to display per page

  const handleUserBlock = async (userId: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the status
      const response = await updateUserBlockStatus(userId, updatedStatus);

      if (response.success) {
        const updatedUser = response.result;

        // Update the state for the specific user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id
              ? { ...user, isBlock: updatedUser.isBlock }
              : user
          )
        );

        console.log(
          `User block status updated to ${updatedStatus ? "blocked" : "unblocked"}`
        );
      } else {
        console.error("Failed to update user block status:", response.message);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error updating user block status:", error);
      alert("An unexpected error occurred while updating the block status.");
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getUserDetails();
        console.log(result);
        setUsers(result.result); // Update the users state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Calculate the users to display for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 w-full">
        <NavBar />

        <div className="flex flex-col items-center flex-1 bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="mt-10"></div>

          <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
              User List
            </h2>

            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="border border-gray-400 p-3 text-left">No.</th>
                  <th className="border border-gray-400 p-3 text-left">Name</th>
                  <th className="border border-gray-400 p-3 text-left">Email</th>
                  <th className="border border-gray-400 p-3 text-left">Phone</th>
                  <th className="border border-gray-400 p-3 text-left">Status</th>
                  <th className="border border-gray-400 p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="odd:bg-white even:bg-gray-100 hover:bg-blue-50 text-black"
                    >
                      <td className="border border-gray-400 p-3">{indexOfFirstUser + index + 1}</td>
                      <td className="border border-gray-400 p-3">
                        {`${user.firstName} ${user.lastName}`}
                      </td>
                      <td className="border border-gray-400 p-3">{user.email}</td>
                      <td className="border border-gray-400 p-3">{user.phoneNo || "Nil"}</td>
                      <td className="border border-gray-400 p-3">
                        {user.isBlock ? "Inactive" : "Active"}
                      </td>
                      <td className="border border-gray-400 p-3">
                        <button
                          onClick={() => handleUserBlock(user._id, user.isBlock)}
                          className="text-blue-600 hover:underline"
                        >
                          {user.isBlock ? "UnBlock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-3">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-2 text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUser;

