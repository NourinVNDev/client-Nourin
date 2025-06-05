
import NavBar from "../../components/adminComponents/NavBar";
import Header from "../../components/adminComponents/Header";
import Footer from "../../components/adminComponents/Footer";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getUserDetails, updateUserBlockStatus } from "../../service/adminServices/adminUserManager";
import ReusableTable from "../../components/adminComponents/ReusableTable";

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
  const usersPerPage = 5;

const handleUserBlock = async (userId: string, currentStatus: boolean) => {
  const action = currentStatus ? "unblock" : "block";

  const result = await Swal.fire({
    title: `Are you sure you want to ${action} this user?`,
    text: `You are about to ${action} the user.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${action} them!`,
  });

  if (result.isConfirmed) {
    try {
      const updatedStatus = !currentStatus;
      const response = await updateUserBlockStatus(userId, updatedStatus);

      if (response.success) {
        const updatedUser = response.result;

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id
              ? { ...user, isBlock: updatedUser.isBlock }
              : user
          )
        );

        Swal.fire(
          `${updatedStatus ? "Blocked" : "Unblocked"}!`,
          `The user has been ${updatedStatus ? "blocked" : "unblocked"}.`,
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
        const result = await getUserDetails();
        console.log(result);
        setUsers(result.result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const heading=['No','Name','Email','PhoneNo','Status','Action'];
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
            <ReusableTable 
            headers={heading}
            data={currentUsers}
              renderRow={(user, index) => (
    <tr key={user._id}>
      <td className="border px-4 py-2">{indexOfFirstUser + index + 1}</td>
      <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
      <td className="border px-4 py-2">{user.email}</td>
      <td className="border px-4 py-2">{user.phoneNo || "Nil"}</td>
      <td className="border px-4 py-2">
        {user.isBlock ? "Inactive" : "Active"}
      </td>
      <td className="border px-4 py-2">
        <button
          onClick={() => handleUserBlock(user._id, user.isBlock)}
          className={`px-2 py-1 rounded ${
            user.isBlock ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {user.isBlock ? "Unblock" : "Block"}
        </button>
      </td>
    </tr>
  )}/>

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

