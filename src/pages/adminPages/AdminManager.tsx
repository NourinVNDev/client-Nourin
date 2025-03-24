


import NavBar from "../../components/adminComponents/NavBar";
import Header from "../../components/adminComponents/Header";
import Footer from "../../components/adminComponents/Footer";
import { useState, useEffect } from "react";
import { getManagerDetails, updateMangerBlockStatus } from "../../service/adminServices/adminUserManager";

interface Manager {
  _id: string; // Assuming _id is a string
  firmName: string;
  phoneNo: number;
  experience: number;
  email: string;
  status?: string;
  phone: string;
  isBlock: boolean;
}

const AdminManager = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleManagerIsBlock = async (managerId: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the status
      const response = await updateMangerBlockStatus(managerId, updatedStatus);

      if (response.success) {
        const updatedUser = response.result;

        // Update the state for the specific user
        setManagers((prevManager) =>
          prevManager.map((manager) =>
            manager._id === updatedUser._id
              ? { ...manager, isBlock: updatedUser.isBlock }
              : manager
          )
        );

        console.log(`User block status updated to ${updatedStatus ? "blocked" : "unblocked"}`);
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
        const result = await getManagerDetails();
        setManagers(result.user); // Update the users state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentManagers = managers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(managers.length / itemsPerPage);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex flex-1 w-full">
        {/* Navigation Bar */}
        <NavBar />

        <div className="flex flex-col items-center flex-1 bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">Manager's List</h2>

            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="border border-gray-400 p-3 text-left">Name</th>
                  <th className="border border-gray-400 p-3 text-left">Email</th>
                  <th className="border border-gray-400 p-3 text-left">Experience</th>
                  <th className="border border-gray-400 p-3 text-left">Phone</th>
                  <th className="border border-gray-400 p-3 text-left">Status</th>
                  <th className="border border-gray-400 p-3 text-left">Block/unblock</th>
                </tr>
              </thead>
              <tbody>
                {currentManagers.length > 0 ? (
                  currentManagers.map((manager) => (
                    <tr key={manager._id} className="odd:bg-white even:bg-gray-100 hover:bg-blue-50 text-black">
                      <td className="border border-gray-400 p-3">{manager.firmName}</td>
                      <td className="border border-gray-400 p-3">{manager.email}</td>
                      <td className="border border-gray-400 p-3">{manager.experience}</td>
                      <td className="border border-gray-400 p-3">{manager.phoneNo}</td>
                      <td className="border border-gray-400 p-3">{manager.isBlock ? "Inactive" : "Active"}</td>
                      <td className="border border-gray-400 p-3">
                        <button
                          onClick={() => handleManagerIsBlock(manager._id, manager.isBlock)}
                          className="text-blue-600 hover:underline"
                        >
                          {manager.isBlock ? "UnBlock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-3">
                      No managers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-blue-500 text-white rounded-l ${currentPage === 1 ? "opacity-50" : ""}`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-200 text-gray-800">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-blue-500 text-white rounded-r ${currentPage === totalPages ? "opacity-50" : ""}`}
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

export default AdminManager;


