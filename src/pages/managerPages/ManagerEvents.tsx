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
import { eventValidSchema } from "../../validations/managerValid/eventValidSchema";
import MapboxAutocomplete from "../../components/managerComponents/LocationSearch";

interface LocationState {
  lat: number;
  lng: number;
  place: string;
}

interface EventPostResponse {
  message: string;
  data?: {
    _id: string;
    [key: string]: any;
  };
}

interface CategoryEvent {
  categoryName: string;
  [key: string]: any;
}

interface EventFormValues {
  _id: string;
  eventName: string;
  title: string;
  content: string;
  address?: string;
  startDate: Date | null;
  endDate: Date | null;
  time: string;
  images: (File | string)[];
  amount?: number;
  destination?: string;
}

const ManagerEvents: React.FC = () => {
  const navigate = useNavigate();
  const managerCompanyName = localStorage.getItem('ManagerName') ?? "";
  const [eventType, setEventType] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  const initialValues: EventFormValues = {
    _id: "",
    eventName: "",
    title: "",
    content: "",
    address: "",
    startDate: null,
    endDate: null,
    time: "",
    images: [],
    amount: undefined,
    destination: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: eventValidSchema,
    onSubmit: async (values) => {
      try {
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

        formData.append("companyName", managerCompanyName);
        if(formik.values.title==='Virtual'){
          formData.append('address','null');
          formData.append('destination','null');
        }else{
          formData.append('amount','null');
        }
        const result = await createEventpost(formData) as EventPostResponse;
        
        if (result.message === "Event data saved successfully" && result.data) {
          if (values.title === 'Virtual') {
            toast.success("Virtual event created successfully");
            navigate('/Manager/events');
          } else {
            toast.success("Event data saved successfully");
            navigate(`/Manager/addNewEvent2/${result.data._id}`);
          }
          formik.resetForm();
          setImagePreview([]);
        } else if (result.message === "Duplicate Event Name") {
          toast.error("Duplicate Event Name");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred while submitting the event.");
      }
    },
  });

  useEffect(() => {
    const fetchCategoryEventType = async (): Promise<void> => {
      try {
        const result = await getCategoryEventType() as CategoryEvent[];
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newImages = fileArray.filter(file =>
        !imagePreview.some(preview => preview === URL.createObjectURL(file))
      );

      formik.setFieldValue("images", [...formik.values.images, ...newImages]);
      const previews = newImages.map(file => URL.createObjectURL(file));
      setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, place: string): void => {
    formik.setFieldValue("address", place);
    setLocation({ lat, lng, place });
  };

  const isVirtualEvent = formik.values.title === 'Virtual';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

      <div className="flex flex-1">
        <NavBar />

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Event</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6 bg-white p-8 rounded shadow-md">
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
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                    formik.touched.eventName && formik.errors.eventName ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.eventName && formik.errors.eventName && (
                  <div className="text-red-500 text-sm">{formik.errors.eventName}</div>
                )}
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
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                    formik.touched.title && formik.errors.title ? 'border-red-500' : ''
                  }`}
                >
                  <option value="" disabled>Select an option</option>
                  {eventType.map((event, index) => (
                    <option key={index} value={event}>{event}</option>
                  ))}
                </select>
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-sm">{formik.errors.title}</div>
                )}
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
                onBlur={formik.handleBlur}
                className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                  formik.touched.content && formik.errors.content ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.content && formik.errors.content && (
                <div className="text-red-500 text-sm">{formik.errors.content}</div>
              )}
            </div>

            {!isVirtualEvent ? (
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
                  value={formik.values.amount || ''}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">
                  Start Date
                </label>
                <DatePicker
                  id="startDate"
                  selected={formik.values.startDate}
                  onChange={(date: Date | null) => formik.setFieldValue('startDate', date)}
                  onBlur={formik.handleBlur}
                  dateFormat="yyyy-MM-dd"
                  className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                    formik.touched.startDate && formik.errors.startDate ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
                )}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-400">
                  End Date
                </label>
                <DatePicker
                  id="endDate"
                  selected={formik.values.endDate}
                  onChange={(date: Date | null) => formik.setFieldValue('endDate', date)}
                  onBlur={formik.handleBlur}
                  dateFormat="yyyy-MM-dd"
                  className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                    formik.touched.endDate && formik.errors.endDate ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="text-red-500 text-sm">{formik.errors.endDate}</div>
                )}
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-400">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 p-2 border rounded focus:outline-blue-400 bg-white text-black ${
                    formik.touched.time && formik.errors.time ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.time && formik.errors.time && (
                  <div className="text-red-500 text-sm">{formik.errors.time}</div>
                )}
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
              {formik.touched.images && formik.errors.images && (
                <div className="text-red-500 text-sm">{formik.errors.images}</div>
              )}
              {imagePreview.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {imagePreview.map((src, idx) => (
                    <img key={idx} src={src} alt={`Preview ${idx}`} className="w-20 h-20 object-cover" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Saving...' : 'Save Event'}
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