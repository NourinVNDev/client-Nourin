import React, { useEffect, useState } from "react";
import NavBar from "../../components/managerComponents/NavBar";
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { createEventpost, getCategoryEventType } from "../../service/managerServices/handleEventService";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { eventValidSchema} from "../../validations/managerValid/eventValidSchema";
import { eventFormValues } from "../../validations/managerValid/eventValidSchema";
const ManagerEvents = () => {
  const navigate = useNavigate();
  const managerCompanyName = localStorage.getItem('ManagerName') ?? " ";
  const [eventType, setEventType] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]); // Changed to array for multiple images

const formik = useFormik<eventFormValues>({
  initialValues: {
    _id:"",
    eventName: "",
    title: "",
    content: "",
    location: { address: "", city: "" },
    startDate: "",
    endDate: "",
    time: "",
    tags: [""],
    images: [] as (File | string)[],
    noOfPerson: 0,

    destination: "",
    Included: [""],
    notIncluded: [""],
    Amount: 0
  },
  // validationSchema:eventValidSchema,
  onSubmit: async (values) => {
    console.log("Form Submitted", values);
    const formData = new FormData();
    
    formData.append("eventName", values.eventName);
    formData.append("companyName", managerCompanyName || ""); // Ensure it's defined
    formData.append("title", values.title);
    formData.append("content", values.content);
    
    formData.append("location", JSON.stringify(values.location));
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("time", values.time);
    formData.append("tags", values.tags.join(","));
    formData.append("destination", values.destination);
    formData.append("noOfPerson", values.noOfPerson.toString());
    formData.append("amount", values.Amount.toString()); 
    formData.append("Included", values.Included.join(","));
    formData.append("notIncluded", values.notIncluded.join(","));

    if (values.images.length > 0) {
      values.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }

    console.log("Maad", formData);


    const postEventData=async ()=>{
          try {
      const result = await createEventpost(formData);
      if (result.message === "Event data saved successfully") {
        toast.success("Event data saved successfully");
        navigate("/Manager/events");
        formik.resetForm({ values: formik.initialValues });
        setImagePreview([]);
      } else if (result.message === "Duplicate Event Name") {
        toast.error("Duplicate Event Name");
       }
     } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the event.");
    }

    }
    postEventData();
  },
});

useEffect(() => {
const fetchCategoryEventType = async () => {
  try {
    const result = await getCategoryEventType();
    if (Array.isArray(result)) {
      const categoryNames = result.map(item => item.categoryName);
      setEventType(categoryNames);
    } else {
      console.error("Invalid categoryName format");
    }
  } catch (error) {
    console.error("Error fetching category event type:", error);
  }
};
fetchCategoryEventType();
}, []);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const files = e.target.files;
if (files) {
  const fileArray = Array.from(files);
  const newImages = fileArray.filter(file => !imagePreview.includes(URL.createObjectURL(file)));
  console.log("New Image",newImages);
  
  formik.setFieldValue("images", [...formik.values.images, ...newImages]);
  const previews = newImages.map(file => URL.createObjectURL(file));
  setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
}
};

return (
<div className="min-h-screen flex flex-col bg-gray-100">
  <Header />
  <Toaster position="top-center" reverseOrder={false} toastOptions={{
    duration: 3000,
  }} />

  <div className="flex flex-1">
    <NavBar />

    <main className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Event</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6 bg-white p-8 rounded shadow-md" encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-400">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formik.values.eventName}
              onChange={formik.handleChange}
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.eventName && formik.errors.eventName ? 'border-red-500' : ''}`}
            />
            {formik.touched.eventName && formik.errors.eventName ? (
              <div className="text-red-500 text-sm">{formik.errors.eventName}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400">
              Event Title
            </label>
            <select
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
           
             
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''}`}
            >
              <option value="" disabled>Select an option</option>
              {eventType.map((event, index) => (
                <option key={index} value={event}>
                  {event}
                </option>
              ))}
            </select>
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-400">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.content && formik.errors.content ? 'border-red-500' : ''}`}
          />
          {formik.touched.content && formik.errors.content ? (
            <div className="text-red-500 text-sm">{formik.errors.content}</div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-400">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="location.address"
              value={formik.values.location.address}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // required
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.location?.address && formik.errors.location?.address ? 'border-red-500' : ''}`}
            />
            {formik.touched.location?.address && formik.errors.location?.address ? (
              <div className="text-red-500 text-sm">{formik.errors.location.address}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-400">
              City
            </label>
            <input
              type="text"
              id="city"
              name="location.city"
              value={formik.values.location.city}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // required
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.location?.city && formik.errors.location?.city ? 'border-red-500' : ''}`}
            />
            {formik.touched.location?.city && formik.errors.location?.city ? (
              <div className="text-red-500 text-sm">{formik.errors.location.city}</div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="noOfPerson" className="block text-sm font-medium text-gray-400">
              Number of People
            </label>
            <input
              type="number"
              id="noOfPerson"
              name="noOfPerson"
              value={formik.values.noOfPerson}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // required
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.noOfPerson && formik.errors.noOfPerson ? 'border-red-500' : ''}`}
            />
            {formik.touched.noOfPerson && formik.errors.noOfPerson ? (
              <div className="text-red-500 text-sm">{formik.errors.noOfPerson}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="Amount" className="block text-sm font-medium text-gray-400">
              Amount
            </label>
            <input
              type="number"
              id="Amount"
              name="Amount"
              value={formik.values.Amount}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              // required
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.Amount && formik.errors.Amount ? 'border-red-500' : ''}`}
            />
            {formik.touched.Amount && formik.errors.Amount ? (
              <div className="text-red-500 text-sm">{formik.errors.Amount}</div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">
              Start Date
            </label>
            <DatePicker className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
              selected={formik.values.startDate ? new Date(formik.values.startDate) : null}
              onChange={(date) => formik.setFieldValue('startDate', date)}
              dateFormat="yyyy-MM-dd"
              // required
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-400">
              End Date
            </label>
            <DatePicker className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
              selected={formik.values.endDate ? new Date(formik.values.endDate) : null}
              onChange={(date) => formik.setFieldValue('endDate', date)}
              dateFormat="yyyy-MM-dd"
              // required
            />
            {formik.touched.endDate && formik.errors.endDate ? (
              <div className="text-red-500 text-sm">{formik.errors.endDate}</div>
            ) : null}
          </div>
        </div>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-400">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formik.values.destination}
            onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            // required
            className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.destination && formik.errors.destination ? 'border-red-500' : ''}`}
          />
          {formik.touched.destination && formik.errors.destination ? (
            <div className="text-red-500 text-sm">{formik.errors.destination}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-400">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formik.values.tags.join(", ")}
            onChange={(e) => {
              const value = e.target.value.split(",").map(item => item.trim());
              formik.setFieldValue("tags", value);
            }}
            className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.tags && formik.errors.tags ? 'border-red-500' : ''}`}
            placeholder="comma-separated tags"
          />
          {formik.touched.tags && formik.errors.tags ? (
            <div className="text-red-500 text-sm">{formik.errors.tags}</div>
          ) : null}
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="included" className="block text-sm font-medium text-gray-400">
              Included (comma-separated)
            </label>
            <input
              type="text"
              id="included"
              name="Included"
              value={formik.values.Included.join(", ")}
              onChange={(e) => {
                const value = e.target.value.split(",").map(item => item.trim()); // Filter out empty strings
                formik.setFieldValue("Included", value);
              }}
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.Included && formik.errors.Included ? 'border-red-500' : ''}`}
            />
            {formik.touched.Included && formik.errors.Included ? (
              <div className="text-red-500 text-sm">{formik.errors.Included}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="notIncluded" className="block text-sm font-medium text-gray-400">
              Not Included (comma-separated)
            </label>
            <input
              type="text"
              id="notIncluded"
              name="notIncluded"
              value={formik.values.notIncluded.join(", ")}
              onChange={(e) => {
                const value = e.target.value.split(",").map(item => item.trim());
                formik.setFieldValue("notIncluded", value);
              }}
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.notIncluded && formik.errors.notIncluded ? 'border-red-500' : ''}`}
            />
            {formik.touched.notIncluded && formik.errors.notIncluded ? (
              <div className="text-red-500 text-sm">{formik.errors.notIncluded}</div>
            ) : null}
          </div>
        </div>

   

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-400">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
          
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
          />
          {formik.touched.images && formik.errors.images ? (
          <div className="text-red-500 text-sm">{formik.errors.images}</div>
        ) : null}
          {imagePreview.length > 0 && (
            <div className="mt-2">
              {imagePreview.map((src, idx) => (
                <img key={idx} src={src} alt={`Preview ${idx}`} className="w-20 h-20 object-cover mt-2" />
              ))}
            </div>
          )}
         

        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            Create Event
          </button>
        </div>
      </form>
    </main>
  </div>

  <Footer />
</div>
);
};

export default ManagerEvents;
