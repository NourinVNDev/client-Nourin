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
import PlacesAutocomplete from "../../components/managerComponents/LocationSearch";
import { LoadScript } from "@react-google-maps/api";
const libraries: Array<"places"> = ["places"];

 const GOOGLE_API_KEY = "AIzaSyCPaX7uEVQp_z69iGjGmN-kD8M-ENWweOQ";
const ManagerEvents = () => {
  const navigate = useNavigate();
  const managerCompanyName = localStorage.getItem('ManagerName') ?? " ";
  const [eventType, setEventType] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedLocation,setSelectedLocation]=useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  

const formik = useFormik<eventFormValues>({
  initialValues: {
    _id:"",
    eventName: "",
    title: "",
    content: "",
    address:"",
    startDate: "",
    endDate: "",
    time: "",
    images: [] as (File | string)[],
    noOfPerson: 0,
    destination: "",  

  },

  validationSchema:eventValidSchema,
  onSubmit: async (values) => {
    console.log("Hello")
    console.log("Form Submitted", values);
    const formData = new FormData();
    
    formData.append("eventName", values.eventName);
    formData.append("companyName", managerCompanyName || ""); // Ensure it's defined
    formData.append("title", values.title);
    formData.append("content", values.content);
    
    formData.append("address",values.address);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("time", values.time);

    formData.append("destination", values.destination);
    formData.append("noOfPerson", values.noOfPerson.toString());
    // formData.append("amount", values.Amount.toString()); 
    // formData.append("Included", values.Included.join(","));
    // formData.append("notIncluded", values.notIncluded.join(","));

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
      console.log("Daata checking",result);
      if (result.message === "Event data saved successfully") {
        toast.success("Event data saved successfully");
        navigate(`/Manager/addNewEvent2/${result.data._id}`);
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
        setIsScriptLoaded(true);
      } else {
        console.error("Invalid categoryName format");
      }
    } catch (error) {
      console.error("Error fetching category event type:", error);
    }
  };

  fetchCategoryEventType();
}, []);

useEffect(() => {
  if (isScriptLoaded) {
    console.log("Script loaded and eventType fetched:", eventType);
  }
}, [isScriptLoaded, eventType]);


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

const handleLocationSelect=(address:string)=>{
  formik.handleChange(address)
  setSelectedLocation(address);

}

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
            className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.content && formik.errors.content ? 'border-red-500' : ''}`}
          />
          {formik.touched.content && formik.errors.content ? (
            <div className="text-red-500 text-sm">{formik.errors.content}</div>
          ) : null}
        </div>
        {isScriptLoaded && (
        <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-400">Address</label>
          <PlacesAutocomplete onSelectLocation={handleLocationSelect} />
          {selectedLocation && (
            <p className="mt-2 text-green-500">Selected: {selectedLocation}</p>
          )}
        </div>
      </LoadScript>
      )}
   

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
           
              className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${formik.touched.noOfPerson && formik.errors.noOfPerson ? 'border-red-500' : ''}`}
            />
            {formik.touched.noOfPerson && formik.errors.noOfPerson ? (
              <div className="text-red-500 text-sm">{formik.errors.noOfPerson}</div>
            ) : null}
          </div>
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
            Save Event
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
