import { useEffect, useState } from "react";
import { getCategoryDetails } from "../../service/adminServices/adminCategoryAndWallet";
import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";
import Footer from "../../components/adminComponents/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import { updateCategoryBlockStatus } from '../../service/adminServices/adminCategoryAndWallet';
import ReusableTable from "../../components/adminComponents/ReusableTable";
interface Category {
  categoryName: string,
  Description: string
  _id: string,
  isListed: boolean
}
const AdminCategory = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const handleCategoryBlock = async (categoryId: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the status
      const response = await updateCategoryBlockStatus(categoryId, updatedStatus);

      if (response?.success) {
        const updatedCategory = response.result;

        setCategory((prevCategory) =>
          prevCategory.map((category) =>
            category._id === updatedCategory._id
              ? { ...category, isListed: updatedCategory.isListed }
              : category
          )
        );

        console.log(
          `Category block status updated to ${updatedStatus ? 'inactive' : 'active'
          }`
        );
      } else {
        console.error("Failed to update block status:", response?.message);
        alert(`Error: ${response?.message || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Error updating block status:", error);
      alert("An unexpected error occurred while updating the block status.");
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      console.log('yes');

      try {
        const result = await getCategoryDetails();
        console.log("Hai");

        console.log(result);
        setCategory(result.data.result); // Update the users state
        console.log("data", category);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    console.log("Updated category:", category); // This will log after category state updates
  }, [category]);
  const handleEventData = () => {
    navigate('/admin/addEvents')
  }
  const handleCategoryEdit = (id: string) => {
    navigate(`/admin/editCategory/${id}`)
  }
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentCategorys = category.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(category.length / usersPerPage);
  const heading = ['Name', 'Description', 'Status', 'Block/unBlock', 'Action'];
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 w-full">
        <NavBar />
        <div className="flex flex-col items-center flex-1 bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="mt-10"></div>
          <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
                Category's List
              </h2>
              <button onClick={handleEventData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                ADD
              </button>
            </div>
            <ReusableTable
              headers={heading}
              data={currentCategorys}
              renderRow={(category: Category) => (
                <tr key={category._id} className="odd:bg-white even:bg-gray-100 hover:bg-blue-50 text-black">
                  <td className="border border-gray-400 p-3">{category.categoryName}</td>
                  <td className="border border-gray-400 p-3">{category.Description}</td>
                  <td className="border border-gray-400 p-3">
                    {category.isListed ? "Active" : "Inactive"}
                  </td>
                  <td className="border border-gray-400 p-3">
                    <button
                      onClick={() => handleCategoryBlock(category._id, category.isListed)}
                      className="text-blue-600 hover:underline"
                    >
                      {category.isListed ? "Block" : "Unblock"}
                    </button>
                  </td>
                  <td className="border border-gray-400 p-3">
                    <button
                      onClick={() => handleCategoryEdit(category._id)}
                      className="px-4 py-1 bg-yellow-500 text-white text-sm font-semibold rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )} />
            <div className="flex justify-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${currentPage === 1 && "opacity-50 cursor-not-allowed"
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
                className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${currentPage === totalPages && "opacity-50 cursor-not-allowed"
                  }`}
              >
                Next
              </button>
            </div>
          </div>

          <br /><br /><br /><br />
        </div>
      </div>

      <Footer />
    </div>
  )

}
export default AdminCategory;