


import NavBar from "../../components/adminComponents/NavBar";
import Header from "../../components/adminComponents/Header";
import Footer from "../../components/adminComponents/Footer";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { getManagerDetails, updateMangerBlockStatus } from "../../service/adminServices/adminUserManager";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../components/adminComponents/ReusableTable";
interface Manager {
  _id: string; 
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
  const navigate=useNavigate();

 const handleManagerIsBlock = async (managerId: string, currentStatus: boolean) => {
  const action = currentStatus ? "unblock" : "block";

  const result = await Swal.fire({
    title: `Are you sure you want to ${action} this manager?`,
    text: `You are about to ${action} the manager.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${action} them!`,
  });

  if (result.isConfirmed) {
    try {
      const updatedStatus = !currentStatus;
      const response = await updateMangerBlockStatus(managerId, updatedStatus);

      if (response.success) {
        const updatedUser = response.result;

        setManagers((prevManager) =>
          prevManager.map((manager) =>
            manager._id === updatedUser._id
              ? { ...manager, isBlock: updatedUser.isBlock }
              : manager
          )
        );

        Swal.fire(
          `${updatedStatus ? "Blocked" : "Unblocked"}!`,
          `The manager has been ${updatedStatus ? "blocked" : "unblocked"}.`,
          "success"
        );
      } else {
        console.error("Failed to update user block status:", response.message);
        Swal.fire("Error", response.message, "error");
      }
    } catch (error) {
      console.error("Error updating user block status:", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  }
};


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getManagerDetails();
        setManagers(result.user);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentManagers = managers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(managers.length / itemsPerPage);
const showManagerInformation=(managerId:string)=>{
  console.log("Blank");
  
  navigate(`/manager/managerEvents/${managerId}`)
}

const heading=['Name','Email','Experience','PhoneNo','Status','Block/UnBlock'];


  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">

      <Header />

      <div className="flex flex-1 w-full">
        
        <NavBar />

        <div className="flex flex-col items-center flex-1 bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="mt-10"></div>
          <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">Manager's List</h2>


            <ReusableTable
            headers={heading}
            data={currentManagers}
            renderRow={(manager: Manager, _: number) => (
  <tr
    key={manager._id}
    className="odd:bg-white even:bg-gray-100 hover:bg-blue-50 text-black"
  >
    <td
      onClick={() => showManagerInformation(manager._id)}
      className="border border-gray-400 p-3 cursor-pointer hover:underline"
    >
      {manager.firmName}
    </td>
    <td className="border border-gray-400 p-3">{manager.email}</td>
    <td className="border border-gray-400 p-3">{manager.experience}</td>
    <td className="border border-gray-400 p-3">{manager.phoneNo}</td>
    <td className="border border-gray-400 p-3">
      {manager.isBlock ? "Inactive" : "Active"}
    </td>
    <td className="border border-gray-400 p-3">
      <button
        onClick={() => handleManagerIsBlock(manager._id, manager.isBlock)}
        className="text-blue-600 hover:underline"
      >
        {manager.isBlock ? "UnBlock" : "Block"}
      </button>
    </td>
  </tr>
)}
/>

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


