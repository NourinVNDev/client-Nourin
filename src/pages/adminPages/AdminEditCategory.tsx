import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSelectedCategory, editSelectedCategory } from "../../service/adminServices/adminCategoryAndWallet";
import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";
import Footer from "../../components/adminComponents/Footer";
import toast, { Toaster } from "react-hot-toast";

type CategoryData = {
  categoryName: string;
  Description: string;
};

const AdminEditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategoryDetails] = useState<CategoryData>({
    categoryName: "",
    Description: "",
  });

  useEffect(() => {
    const fetchParticularCategory = async () => {
      if (id) {
        try {
          const result = await fetchSelectedCategory(id);
          console.log("Fetched category data:", result.data.result); // Debugging log

          if (result.message === "Selected Category fetched successfully") {
            setCategoryDetails(result.data.result);
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      }
    };

    fetchParticularCategory();
  }, [id]);

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategoryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (category.Description === "") {
      toast.error("Category Description is required");
      return;
    }

    try {
      if (id) {
        const result = await editSelectedCategory(category.Description, id);
        if (result.message === "Category edited successfully") {
          toast.success("Category edited successfully!");
          setCategoryDetails({
            categoryName: "",
            Description: "",
          });
          navigate("/admin/category");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <div className="w-screen h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />

        <div className="flex flex-1 w-full">
          {/* Navigation Bar */}
          <NavBar />
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Event Category</h2>
            <form onSubmit={handleFormSubmit} className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-gray-700 font-medium mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={category.categoryName}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 text-black"
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
                  name="Description"
                  value={category.Description}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
                  placeholder="Enter category description"
                  onChange={handleFormInput}
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
              >
                Edit Category
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminEditCategory;
