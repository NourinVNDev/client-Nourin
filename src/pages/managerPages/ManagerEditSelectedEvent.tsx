import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { handlePreviousEvents, updateEvent } from "../../service/managerServices/handleEventService"; // Ensure you have an updateEvent function
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import NavBar from "../../components/managerComponents/NavBar";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import { EventData } from "../../validations/userValid/TypeValid";
import { eventFormValues, eventValidSchema } from "../../validations/managerValid/eventValidSchema";
import { useFormik } from "formik";

const ManagerEditSelectedEvents = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const managerCompanyName = localStorage.getItem('ManagerName') ?? " ";

  const formik = useFormik<eventFormValues>({
    initialValues: {
    _id:"",
      eventName: "",
      title: "",
      content: "",
     address:"",
      startDate: '',
      endDate: '',
      time: "",
 
      images: [] as (File | string)[],
      noOfPerson: 0,
      destination: '',
    },


  validationSchema:eventValidSchema,
    onSubmit:  (values) => {
      console.log("Form Submitted", values);
      const formData = new FormData();
      formData.append("id", values._id)
      formData.append("eventName", values.eventName); 
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append('companyName',managerCompanyName||'');
      formData.append("address", JSON.stringify(values.address));
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
      const postEditEventData=async ()=>{
        try {
          const result = await updateEvent(formData);
          if (result?.message === 'Event data updated saved successfully') {
            toast.success("Event updated successfully!");
            navigate('/manager/events');
          } else {
            toast.error(result?.message || "Failed to update event");
          }
        } catch (error) {
          console.error("Error updating event:", error);
          toast.error("An error occurred while updating the event.");
        }

      }

    

      postEditEventData()
    }
  });


  useEffect(() => {
    console.log("Formik Errors:", formik.errors);
  }, [formik.errors]);
  

  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [eventDetails, setEventDetails] = useState<EventData>({
    _id: "",
    eventName: "",
    title: "",
    content: "",
   address:"",
    startDate: "",
    endDate: "",
    noOfPerson: 0,
    time: "",
 
    destination: "",
   
    tags: [""],
    images: [] as (File | string)[],
  });
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
  
      try {
        const result = await handlePreviousEvents(eventId);
        console.log("Result from API:", result);
  
        if (result?.data?.result) {
          console.log("Set Event Details", result.data.result);
          setEventDetails(result.data.result);
  
          formik.setValues((prevValues) => ({
            ...prevValues,
            ...result.data.result,
            address:result.data.result.address||"",
            Included: result.data.result.Included || [""],
            notIncluded: result.data.result.notIncluded || [""],
            tags: result.data.result.tags || [""],
            images: result.data.result.images || [],
          }));
        } else {
          console.error("Invalid data structure:", result);
        }
  
        const categoryNames = result.data.category.map(
          (cat: { categoryName: string }) => cat.categoryName
        );
        setCategoryName(categoryNames);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventDetails();
  }, [eventId]);
  



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  if (["Included", "notIncluded", "tags"].includes(name)) {
      formik.setFieldValue(name, value.split(",").map((item) => item.trim())); // Convert input to array
    } else if (["noOfPerson", "amount"].includes(name)) {
      const parsedValue = Number(value);
      formik.setFieldValue(name, isNaN(parsedValue) ? 0 : parsedValue); // Handle NaN cases gracefully
    } else {
      formik.setFieldValue(name, value);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const files = e.target.files;
    console.log("Checking the photo",files);
    
    if (files) {
      const fileArray = Array.from(files); // Convert FileList to Array
      formik.setFieldValue("images", fileArray); // Replace the images array with new images
      setEventDetails((prev) => ({
        ...prev, // Keep the existing data
        images: fileArray, // Update only the images field
      }));
      
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // Default duration for toasts
        }}
      />

      <div className="flex flex-1">
        <NavBar />

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Event</h2>

          {loading ? (
            <p>Loading...</p> // Show loading state
          ) : eventDetails ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6 bg-white p-8 rounded shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-400">Event Name</label>
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    disabled
                    value={formik.values.eventName}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                  />
                      {formik.touched.eventName && formik.errors.eventName ? (
              <div className="text-red-500 text-sm">{formik.errors.eventName}</div>
            ) : null}
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-400">Title</label>
                  <select
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                  >
                    <option value="" disabled>Select a category...</option>
                    {categoryName.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-400">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formik.values.content}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                />
                      {formik.touched.content && formik.errors.content ? (
            <div className="text-red-500 text-sm">{formik.errors.content}</div>
          ) : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-400">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="location.address"
                    value={formik.values.address}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                  />
                      {formik.touched.address && formik.errors.address ? (
              <div className="text-red-500 text-sm">{formik.errors.address}</div>
            ) : null}
                </div>
     
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="noOfPerson" className="block text-sm font-medium text-gray-400">Number of People</label>
                <input
                  type="number"
                  id="noOfPerson"
                  name="noOfPerson"
                  value={formik.values.noOfPerson}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                />
                        {formik.touched.noOfPerson && formik.errors.noOfPerson ? (
              <div className="text-red-500 text-sm">{formik.errors.noOfPerson}</div>
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
                           dateFormat="dd-MM-yyyy"
                           // required
                         />
                         {formik.touched.startDate && formik.errors.startDate ? (
                           <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
                         ) : null}
                       </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-400">End Date</label>
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
                <label htmlFor="destination" className="block text-sm font-medium text-gray-400">Destination</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formik.values.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black"
                />
                {formik.touched.destination && formik.errors.destination ? (
            <div className="text-red-500 text-sm">{formik.errors.destination}</div>
          ) : null}
              </div>
         
              </div>
           

              <div className="mt-4">
                <strong>Previous Images:</strong>
                <div className="flex space-x-4 mt-2">
                  {eventDetails.images?.map((img, index) => {
                    return (
                      <div key={index} className="relative">
                        {img instanceof File ? (
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Event Image ${index + 1}`}
                            className="w-32 h-32 object-cover rounded"
                          />
                        ) : (
                          <img
                            src={img}
                            alt={`Event Image ${index + 1}`}
                            className="w-32 h-32 object-cover rounded"
                          />
                        )}
                        <input
                          multiple
                          type="file"
                          accept="image/*"
                          className="absolute bottom-0 right-0 opacity-0"
                          onChange={(e) => handleImageChange(e)}
                          id={`image-upload-${index}`}
                        />
                              {formik.touched.images && formik.errors.images ? (
          <div className="text-red-500 text-sm">{formik.errors.images}</div>
        ) : null}
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full cursor-pointer"
                        >
                          Edit
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
        >
                   Update  Event
                </button>
              </div>
            </form>
          ) : (
            <p>No event details found.</p>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ManagerEditSelectedEvents;