import { useEffect, useState } from "react";
import { getSpecificOffer, updateOffer } from "../../service/managerServices/handleOfferService";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { useFormik } from "formik";
import { OfferFormValues, offerValidSchema } from "../../validations/managerValid/offerValidSchema";

const ManagerEditOffer = () => {
  const navigate = useNavigate();
  const { offerId } = useParams(); 
  const [categories, setCategories] = useState<string[]>([]); 

  const formik = useFormik<OfferFormValues>({
    initialValues: {
      offerName: "",
      discount_on: "",
      discount_value: "",
      startDate: "",
      endDate: "",
      item_description: "",
    },
    validationSchema: offerValidSchema,
    onSubmit: async (values) => {
      try {
        console.log("Puzzle",values.discount_value);
        

     const formattedValues = { 
  ...values, 
  discount_value:String(values.discount_value) // Round to two decimal places (or as needed)
};

console.log("Discount value before submit:", values.discount_value);



        const result = await updateOffer(formattedValues);
        if (result?.message === "Offers Updated successfully") {
          toast.success("Offer updated successfully!");
          navigate("/manager/offer");
        } else {
          toast.error(result?.message || "Failed to update offer");
        }
      } catch (error) {
        console.error("Error updating offer:", error);
        toast.error("An error occurred while updating the offer.");
      }
    },
  });

  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) return;

      try {
        const result = await getSpecificOffer(offerId);
        if (result?.data?.data?.result) {
          const offerData = result.data.data.result;
          formik.setValues({
            offerName: offerData.offerName,
            discount_on: offerData.discount_on || "",
            discount_value: offerData.discount_value || 0,
            startDate: offerData.startDate ? offerData.startDate.split("T")[0] : "",
            endDate: offerData.endDate ? offerData.endDate.split("T")[0] : "",
            item_description: offerData.item_description || "",
          });
        }

        if (result?.data?.data?.category) {
          setCategories(result.data.data.category.map((cat: { categoryName: string }) => cat.categoryName));
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
        toast.error("Failed to load offer data");
      }
    };

    fetchOffer();
  }, [offerId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-1">
        <NavBar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Edit Offer</h2>
          <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6 bg-white p-8 rounded shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black">Offer Name:</label>
                  <input
                    disabled
                    type="text"
                    name="offerName"
                    value={formik.values.offerName}
                    onChange={formik.handleChange}
                    className="w-full p-2 border rounded text-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black">Discount On:</label>
                  <select
                    name="discount_on"
                    value={formik.values.discount_on}
                    onChange={formik.handleChange}
                    className="w-full p-2 border rounded text-black bg-white"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formik.touched.discount_on && formik.errors.discount_on && (
                    <p className="text-red-500 text-sm">{formik.errors.discount_on}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Discount Value:</label>
                <input
                  type="number"
                  name="discount_value"
                  value={formik.values.discount_value}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded text-black bg-white"
                />
                {formik.touched.discount_value && formik.errors.discount_value && (
                  <p className="text-red-500 text-sm">{formik.errors.discount_value}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Start Date:</label>
                <DatePicker
                  className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                  selected={formik.values.startDate ? new Date(formik.values.startDate) : null}
                  onChange={(date) => formik.setFieldValue("startDate", date)}
                  dateFormat="yyyy-MM-dd"
                  required
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="text-red-500 text-sm">{formik.errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black">End Date:</label>
                <DatePicker
                  className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                  selected={formik.values.endDate ? new Date(formik.values.endDate) : null}
                  onChange={(date) => formik.setFieldValue("endDate", date)}
                  dateFormat="yyyy-MM-dd"
                  required
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <p className="text-red-500 text-sm">{formik.errors.endDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Item Description:</label>
                <textarea
                  name="item_description"
                  value={formik.values.item_description}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded text-black bg-white"
                  rows={3}
                />
                {formik.touched.item_description && formik.errors.item_description && (
                  <p className="text-red-500 text-sm">{formik.errors.item_description}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Update Offer
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManagerEditOffer;
