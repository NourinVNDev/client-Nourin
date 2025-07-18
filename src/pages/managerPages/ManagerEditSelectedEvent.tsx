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
import MapboxAutocomplete from "../../components/managerComponents/LocationSearch";
import { Link } from "react-router-dom";
// interface LocationState {
//   lat: number;
//   lng: number;
//   place: string;
// }
const ManagerEditSelectedEvents = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  // const managerCompanyName = localStorage.getItem('ManagerName') ?? " ";
    const [location, setLocation] = useState('');

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
    
      destination: '',
    },


  validationSchema:eventValidSchema,
    onSubmit:  (values) => {
      console.log("Location",location);
      
      console.log("Form Submitted", values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'images') {
          values.images.forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        } else if (value !== null && value !== undefined) {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      if(formik.values.title==='Virtual'){
        formData.append('address','null');
        formData.append('destination','null');
      }else{
        formData.append('amount','null');
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
    if(location){
      console.log("Loc",location);
      
    }
  }, [formik.errors,location]);
  

  

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
    amount:0,
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
  
        if (result?.result) {
          console.log("Set Event Details", result.result);
          setEventDetails(result.result);
  
          formik.setValues((prevValues) => ({
            ...prevValues,
            ...result.result,
            address:result.result.address||"",
            amount:result.result.amount||0,
            time:result.result.time||'',
         
            images: result.result.images || [],
          }));
          setLocation(result.result.address);
        } else {
          console.error("Invalid data structure:", result);
        }
  
        const categoryNames = result.category.map(
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
  const handleLocationSelect = (lat: number, lng: number, place: string): void => {
   
    formik.setFieldValue("address", place);
    setLocation(place);

    console.log("Selected:", { lat, lng, place });
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
          {formik.values.title!='Virtual' && (
              <div className=" flex justify-end">
              <Link to={`/Manager/update2Page/${formik.values._id}`}>
            <button  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition">Update Tickets</button>
            </Link>
            </div>
          )}
        
        <br />
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
              {formik.values.title!='Virtual' ? (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400">
                  Address
                </label>
                <MapboxAutocomplete onSelectLocation={handleLocationSelect} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div>
                    <input
                      type="text"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      placeholder="Address"
                      readOnly
                      className={`w-full p-2 border rounded bg-white text-black ${
                        formik.touched.address && formik.errors.address ? 'border-red-500' : ''
                      }`}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-red-500 text-sm">{formik.errors.address}</div>
                    )}
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
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                        formik.touched.destination && formik.errors.destination ? 'border-red-500' : ''
                      }`}
                    />
                    {formik.touched.destination && formik.errors.destination && (
                      <div className="text-red-500 text-sm">{formik.errors.destination}</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                    formik.touched.amount && formik.errors.amount ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.amount && formik.errors.amount && (
                  <div className="text-red-500 text-sm">{formik.errors.amount}</div>
                )}
              </div>
            )}
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