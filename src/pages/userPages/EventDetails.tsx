import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/userComponents/Headers";
import Footer from "../../components/userComponents/Footer";
import { getEventData } from "../../service/userServices/userPost";
import { Star, Users, Calendar } from "lucide-react";
import { makeStripePayment } from "../../service/userServices/userPost";
import { PaymentData } from "../../validations/userValid/TypeValid";
import { useSelector} from "react-redux";
import { RootState } from "../../../App/store";
import { saveBillingDetails } from "../../service/userServices/userPost";
import toast,{Toaster} from "react-hot-toast";

const EventDetails = () => {
  const [memberName, setMemberName] = useState(""); // State for input field
  const [members, setMembers] = useState<string[]>([]); // State for storing added members

  const handleNoOfPerson = (e: React.FormEvent) => {
    e.preventDefault();

    
    
    if (!memberName.trim()) return; // Prevent empty entries

    setMembers([...members, memberName]); // Add member to array
    setMemberName(""); // Clear input field

  };  
  const user=useSelector((state:RootState)=>state.user);
  const userId=localStorage.getItem('userId');

  console.log("User Details from store",user.Address);
  
  const { id } = useParams();
  const [eventData, setEventData] = useState<PaymentData>({
    bookedId:"",
    userId:"",
    categoryName:"",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: 0,
    address: "",
    companyName: "",
    images: [""],
    eventName: "",
    location: { address: "", city: "" },
    noOfPerson: 0,
    noOfDays: 0,
    Amount: 0
  });
  const makePayment = async () => {
    console.log("Match");
    if (members.length<=0) {
      toast.error("Add Members Name");
        return;
  }
    try {
        // Assuming eventData contains necessary details like product info
        const result = await makeStripePayment(eventData); 
        console.log("Results:", result);
    } catch (error) {
        console.error("Error during payment:", error);
    }
};

useEffect(() => {
  const fetchEventData = async () => {
    try {
      if (!id) throw new Error("ID is not found");

      const result = await getEventData(id);
      console.log("Results12:", result);

      const event = result?.data?.result?.savedEvent || {}; // Extract event data correctly

      setEventData((prevData) => ({
        ...prevData,
        userId: user?._id ||prevData.userId,
        firstName: user?.firstName || prevData.firstName || "",
        lastName: user?.lastName || prevData.lastName || "",
        email: user?.email || prevData.email || "",
        phoneNo: Number(user?.phoneNo) || prevData.phoneNo || 0,
        address: user?.Address || prevData.address || "",
        categoryName: event?.title || prevData.categoryName,
        companyName: event?.companyName || prevData.companyName,
        images: event?.images || prevData.images,
        eventName: event?.eventName || prevData.eventName,
        location: event?.location || prevData.location,
        noOfPerson: event?.noOfPerson || prevData.noOfPerson,
        noOfDays: event?.noOfDays || prevData.noOfDays,
        Amount: event?.offerDetails.offerAmount||event.Amount,

      }));
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };


  fetchEventData();
}, [id, user]);

useEffect(() => {
  console.log("Updated eventData:", eventData);
}, [eventData]);




useEffect(() => {
  setEventData((prevData) => ({
    ...prevData,  // Keep existing values
    Amount: prevData.Amount * members.length,
    noOfPerson: prevData.noOfPerson * members.length
  }));
}, [members]);



const SaveBillingDetails = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevent page reload
  console.log("Saving billing details...");

  if (!eventData) {
    console.error("eventData is undefined");
    return;
  }

  const eventId = id ?? userId;
  if (!eventId) {
    console.error("Neither id nor userId is defined.");
    return;
  }

  const formData={
    eventId:eventId,
    categoryName:eventData.categoryName,
    userId:eventData.userId,
    firstName:eventData.firstName,
    lastName:eventData.lastName,
    email:eventData.email,
    phoneNo:eventData.phoneNo,
    address:eventData.address
  }

  const result=await saveBillingDetails(formData);
  console.log("Onnce",result.data);
  if (result.success) {
    console.log("Billing details saved successfully:", result.data);
    toast.success('Saved Billing Details');
    setEventData((prevData) => ({
      ...prevData,
      ...result.data.billingDetails, // Corrected field access
      bookedId: result.data?.data.id, // Ensure bookedId is updated
    }));
  } else {
    console.error("Failed to save billing details:", result.message);
  }
};

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // Default duration for toasts
        }}/>
      <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-screen pt-0 pb-10 flex justify-center">
        <div className="flex w-full max-w-screen-xl space-x-8">
          {/* Left Section - Add Members Form and Billing Details */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-lg mt-8 space-y-8">
            {/* Billing Details Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="bg-yellow-200 w-full h-[100px] flex items-center pl-5 text-black font-bold m-0 text-4xl">
                Book The Slot:
              </h1>

              <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Billing Details</h2>
              <form className="space-y-4" onSubmit={SaveBillingDetails}>
                {/* Existing form fields */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={eventData.firstName}
                    onChange={(e) => setEventData({ ...eventData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName" 
                    value={eventData.lastName}
                    onChange={(e) => setEventData({ ...eventData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={eventData.email}
                    onChange={(e) => setEventData({ ...eventData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNo">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNo"
                    value={eventData.phoneNo}
                    onChange={(e) => setEventData({ ...eventData, phoneNo: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    value={eventData.address}
                    onChange={(e) => setEventData({ ...eventData, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    value={eventData.companyName}
                    onChange={(e) => setEventData({ ...eventData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
                  />
                </div>

                <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  Save Billing Details
                </button>
              </form>
            </div>

            {/* Add Members Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Add Members</h2>
      <form className="space-y-4" onSubmit={handleNoOfPerson}>
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="memberName">
            Name
          </label>
          <input
            type="text"
            id="memberName"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white"
            placeholder="Enter member's name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>

      
    </div>
          </div>

          <div className="flex-1 ml-8 bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full mt-8">
  {/* Adjust the height of the div to make it more like a poster */}
  <div className="relative w-full h-[500px]"> {/* Set fixed height for the right-side container */}
    <img
      src={eventData.images[0]} // Display dynamic image
      alt="Event Image"
      className="object-cover w-full h-[250px] rounded-lg mb-4" // Keep the image height smaller
    />
    <div className="space-y-4 pt-4 text-black">
      <h2 className="text-2xl font-semibold">{eventData.eventName} Conference</h2>
      <p className="text-sm text-gray-600">📍 {eventData.location.city}</p>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">1,259 ratings (2.3k reviews)</span>
      </div>
      <p className="text-sm text-gray-600">Conducted by {eventData.companyName}</p>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm">{eventData.noOfPerson * members.length<1?1:eventData.noOfPerson} person</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm">{eventData.noOfDays} days</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">₹{eventData.Amount}</span>
      </div>
      <p className="text-lg font-semibold text-gray-800 border-b-2 pb-1">No of People</p>
<ul className="mt-4 space-y-2">
  {members.map((member, index) => (
    <li key={index} className="text-gray-700 bg-gray-100 p-1">
      {member}
    </li>
  ))}
</ul>


      <br /><br /><br />  
      <button
      onClick={makePayment}
        className="bg-purple-700 text-white py-2 rounded-lg w-full hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Payment
      </button>
    </div>
  </div>
</div>


        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
