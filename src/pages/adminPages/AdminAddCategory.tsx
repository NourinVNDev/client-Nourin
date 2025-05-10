import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";
import Footer from "../../components/adminComponents/Footer";
import { addNewCategoryDetails } from "../../service/adminServices/adminCategoryAndWallet";
import useSocket from "../../utils/SocketContext";
import  { useState } from "react";
import toast ,{Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
type CategoryData={
  categoryName:string,
  description:string
}
const AdminAddCategory = () => {
    const [eventCategory, setEventCategory] = useState<CategoryData>({
     categoryName:'',
     description:''
      });
      const navigate=useNavigate();

      const {socket}=useSocket();

    const handleFormSubmit=async (e:React.FormEvent)=>{
    
      e.preventDefault();
      console.log("Can")
      if(eventCategory.categoryName==''){
        toast.error('CategoryName is required');
      }
      else if(eventCategory.description==''){
        toast.error('Category Description is required');
      }else{
        try {
          const result = await addNewCategoryDetails(eventCategory);
  
          if (result.message=='Category data saved successfully') {
            toast.success("New Category created successfully!")
         
            socket?.emit('post-new-category',eventCategory.categoryName,(response:any)=>{
              console.log("Acknowledgement",response);
              
            })

            navigate('/admin/category')
          
          } else {
           toast.error("Duplicate Category Name");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("An error occurred while submitting the event.");
        }

      }
   

    }
    const handleFormInput=(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>)=>{
      const { name, value } = e.target;
      setEventCategory({
        ...eventCategory,
        [name]:value
      })

    }
  return (
    <div>

      <div className="w-screen h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header />
        <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // Default duration for toasts
        }}
      />

        <div className="flex flex-1 w-full">
          {/* Navigation Bar */}
          <NavBar />
          <div className="flex-1 p-6">
            {/* Add Category Form */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Event Category</h2>
            <form onSubmit={handleFormSubmit} className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-gray-700 font-medium mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
                  placeholder="Enter category name"
                  onChange={handleFormInput}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                 Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
                  placeholder="Enter category description"
                  onChange={handleFormInput}
                ></textarea>

              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAddCategory;
