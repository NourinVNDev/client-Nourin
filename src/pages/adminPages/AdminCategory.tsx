import { useEffect,useState } from "react";
import { getCategoryDetails } from "../../service/adminServices/adminCategory";
import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";
import Footer from "../../components/adminComponents/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import {updateCategoryBlockStatus} from '../../service/adminServices/adminCategory';
interface Category{
    categoryName:string,
    Description:string
    _id:string,
    isListed:boolean
}
const  AdminCategory=()=>{
     const [category, setCategory] = useState<Category[]>([]);
    const navigate=useNavigate()
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
                  `Category block status updated to ${
                      updatedStatus ? 'inactive' : 'active'
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
  
    useEffect(()=>{
        const fetchCategory = async () => {
            console.log('yes');
            
            try {
              const result = await getCategoryDetails();
              console.log("Hai");
              
              console.log(result);
              setCategory(result.data.result); // Update the users state
              console.log("data",category);
            } catch (error) {
              console.error("Error fetching users:", error);
            }
          };
          fetchCategory();

    },[]);
    useEffect(() => {
      console.log("Updated category:", category); // This will log after category state updates
  }, [category]); 
    const handleEventData=()=>{
    navigate('/admin/addEvents')
    }
    return(
        <div className="w-screen h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header />
  
        <div className="flex flex-1 w-full">
          {/* Navigation Bar */}
          <NavBar />
  
          <div className="flex flex-col items-center flex-1 bg-gradient-to-br from-gray-100 to-gray-300">
            {/* Space between Navbar and Content */}
            <div className="mt-10"></div>
  
            {/* User List */}
            <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
  <h2 className="text-3xl font-extrabold text-gray-900">
    Category's List
  </h2>
  <button onClick={handleEventData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    ADD
  </button>
</div>


     
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-gray">
                    <th className="border border-gray-400 p-3 text-left">Name</th>
                    <th className="border border-gray-400 p-3 text-left">Description</th>
                    <th className="border border-gray-400 p-3 text-left">Edit</th>
                    <th className="border border-gray-400 p-3 text-left">Status</th>
                    <th className="border border-gray-400 p-3 text-left">Block/unblock</th>
                  </tr>
                </thead>
                <tbody>
    {category.length > 0 ? (
      category.map((category, index) => (
        <tr key={category._id} className="odd:bg-white even:bg-gray-100 hover:bg-blue-50 text-black">
          <td className="border border-gray-400 p-3">{category.categoryName}</td>
          <td className="border border-gray-400 p-3">{category.Description}</td>
          <td> <button>Edit</button></td>
          <td className="border border-gray-400 p-3">
      {category.isListed ? "Active" : "Inactive"}
    </td>
          <td className="border border-gray-400 p-3">
          {!category.isListed ? (
    <button
      onClick={() => handleCategoryBlock(category._id, category.isListed)}
      className="text-blue-600 hover:underline"
    >
      UnBlock
    </button>
  ) : (
    <button
      onClick={() => handleCategoryBlock(category._id, category.isListed)}
      className="text-blue-600 hover:underline"
    >
      Block
    </button>
  )}

          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="text-center p-3">
          No Category found.
        </td>
      </tr>
    )}
  </tbody>
  
              </table>
            </div>
  
            <br /><br /><br /><br />
          </div>
        </div>
  
        <Footer />
      </div>
    )

}
export default AdminCategory;