import { useParams } from "react-router-dom";
import Header from "../../components/userComponents/Headers";
import Footer from "../../components/userComponents/Footer";
import { useEffect, useState } from "react";
import { fetchBookingData } from "../../service/userServices/userPost";
import { Users, Calendar } from "lucide-react";
import toast,{Toaster} from "react-hot-toast";
import { retryStripePayment } from "../../service/userServices/userPost";
import { saveRetryBillingDetails } from "../../service/userServices/userPost";
import { BillingValidation } from "../../validations/userValid/BillingValidSchema";
const RetryPayment = () => {
  const { bookingId } = useParams();

  const [eventData, setEventData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    images: [""],
    eventName: '',
    location: '',
    companyName: '',
    amount: 0,
    noOfDays: '',
    bookedMembers:[''],
    bookedEmails:[''],
    noOfPerson:0,
    bookedId:'',
    type:'',
    paymentStatus:'',
    userId:'',
    managerId:'',
    title:'',
    _id:'',
  

  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
  });

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);

   const saveBillingDetails = async (e: React.FormEvent) => {
     e.preventDefault();
     const validationErrors = await BillingValidation(eventData);
     if (validationErrors) {
       setErrors(validationErrors);
       return;
     }
 
     console.log("Saving billing details...");
 
 
     if (!eventData) {
       console.error("eventData is undefined");
       return;
     }
 
  
 
     const formData = {
      _id:eventData._id,
       userId: eventData.userId,
       firstName: eventData.firstName,
       lastName: eventData.lastName,
       email: eventData.email,
       phoneNo: eventData.phoneNo,
       address: eventData.address,
   
     }
     console.log("Helloo");
 
     const result = await saveRetryBillingDetails(formData);
     console.log("Onnce", result);
     if (result.success) {
       console.log("Billing details saved successfully:", result.data.data.id);
       toast.success('Saved Billing Details');
       setEventData((prevData) => ({
         ...prevData,
         ...result.data.billingDetails,
         _id: result.data?.data.id,
         bookedId: result.data?.data.bookingId
       }));
     } else if (result.message == 'No available seats for the selected ticket type') {
       toast.error(result.message);
     } else {
       console.error("Failed to save billing details:", result.message);
     }
   };

  const handleNoOfPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberName && memberEmail) {
      const updatedMembers = [...members, memberName];
      const updatedEmails = [...emails, memberEmail];
      const basePricePerPerson = eventData.amount / Math.max(1, members.length);
      const updatedAmount = basePricePerPerson * updatedMembers.length;
      
      setMembers(updatedMembers);
      setEmails(updatedEmails);
      setEventData(prev => ({
        ...prev,
        amount: updatedAmount,
        bookedMembers: updatedMembers,
        bookedEmail: updatedEmails
      }));
      setMemberName("");
      setMemberEmail("");
    }
  };

  const makePayment = async () => {
    console.log("Match");
    if (members.length <= 0) {
      toast.error("Add Members Name");
      return;
    }
    if (emails.length <= 0) {
      toast.error("Add Members Email");
      return;
    }
    try {

      const result = await retryStripePayment(eventData);
      console.log("Results:", result);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };


  useEffect(() => {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}, []); 

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async (id: string) => {
        try {
          const result = await fetchBookingData(id);
          console.log("Result of cancel Booking:", result.data.result.savedEvent);
          const data = result.data.result.savedEvent;
          const memberNames = data.bookedUser.map((user: any) => user.user || "");
          const memberEmails = data.bookedUser.map((user: any) => user.email || "");
          setEventData({
            firstName: data.billingDetails?.firstName || "",
            lastName: data.billingDetails?.lastName || "",
            email: data.billingDetails?.email || "",
            phoneNo: data.billingDetails?.phoneNo || "",
            address: data.billingDetails?.address || "",
           images: data.eventId?.images?.[0] ? [data.eventId.images[0]] : [""],
            eventName: data.eventId?.eventName || "",
            location: data.eventId?.address || 'Virual Event',
            companyName: data.eventId?.companyName || "",
            amount: data.totalAmount || 0,
            noOfDays: data.eventId?.noOfDays || "",
            bookedMembers:memberNames.filter((name: string) => name),
            bookedEmails:memberEmails.filter((email: string) => email),
            noOfPerson:data.NoOfPerson,
            bookedId:data.bookingId,
            type:data.ticketDetails.type,
            paymentStatus:data.paymentStatus,
            userId:data.userId,
            managerId:data.eventId.Manager,
            title:data.eventId.title,
            _id:data._id
          });

          // Initialize members and emails from bookedUse   r data
          if (data.bookedUser && Array.isArray(data.bookedUser)) {

            setMembers(memberNames.filter((name: string) => name));
            setEmails(memberEmails.filter((email: string) => email));
          }
        } catch (error) {
          console.error("Failed to fetch booking data:", error);
        }
      };
      fetchBookingDetails(bookingId);
    }
  }, [bookingId]);

  useEffect(() => {
    console.log("EventData:", eventData);
  }, [eventData]);

  
  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    const updatedEmails = emails.filter((_, i) => i !== index);
    const basePricePerPerson = eventData.amount / Math.max(1, members.length); // Calculate base price
    const updatedAmount = basePricePerPerson * updatedMembers.length;
  
    setMembers(updatedMembers);
    setEmails(updatedEmails);
    setEventData(prev => ({
      ...prev,
      amount: updatedAmount,
      bookedMembers: updatedMembers,
      bookedEmails: updatedEmails,
      noOfPerson:updatedMembers.length
    }));
  };
  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
            <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }} />
      <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-screen pt-0 pb-10 flex justify-center">
        <div className="flex w-full max-w-screen-xl space-x-8">
          <div className="flex-1 bg-white p-8 rounded-lg shadow-lg mt-8 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="bg-yellow-200 w-full h-[100px] flex items-center pl-5 text-black font-bold m-0 text-4xl">
                Book The Slot:
              </h1>

              <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Billing Details</h2>
              <form className="space-y-4" onSubmit={saveBillingDetails}>
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={eventData.firstName}
                    onChange={(e) => setEventData({ ...eventData, firstName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white ${errors.firstName ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={eventData.lastName}
                    onChange={(e) => setEventData({ ...eventData, lastName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white ${errors.lastName ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={eventData.email}
                    onChange={(e) => setEventData({ ...eventData, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white ${errors.email ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNo">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNo"
                    value={eventData.phoneNo}
                    onChange={(e) => setEventData({ ...eventData, phoneNo: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white ${errors.phoneNo ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNo && <p className="text-red-500 text-sm">{errors.phoneNo}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    value={eventData.address}
                    onChange={(e) => setEventData({ ...eventData, address: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 text-black bg-white ${errors.address ? "border-red-500" : ""
                      }`}
                    placeholder="Enter your address"
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  Save Billing Details
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Add Members</h2>
              <form className="space-y-6" onSubmit={handleNoOfPerson}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="memberName" className="block text-gray-700 font-semibold mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="memberName"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black bg-white"
                      placeholder="Enter member's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="memberEmail" className="block text-gray-700 font-semibold mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="memberEmail"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black bg-white"
                      placeholder="Enter member's email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Add Member
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1 ml-8 bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg w-full mt-8">
            <div className="relative w-full h-[500px]">
              <img
                src={eventData.images[0]}
                alt="Event Image"
                className="object-cover w-full h-[250px] rounded-lg mb-4"
              />
              <div className="space-y-4 pt-4 text-black">
                <h2 className="text-2xl font-semibold">{eventData.eventName}</h2>
                <p className="text-sm text-gray-600">📍 {eventData.location || 'Virtual Event'}</p>
                <p className="text-sm text-gray-600">Conducted by {eventData.companyName}</p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">
                      {members.length} person{members.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{eventData.noOfDays} days</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">₹{eventData.amount}</span>
                </div>
                <p className="text-lg font-semibold text-gray-800 border-b-2 pb-1">No of People</p>
                <ul className="mt-4 space-y-2">
                  {members.map((member, index) => (
                    <li key={index} className="text-gray-700 bg-gray-100 p-1 flex justify-between items-center">
                      <div>
                        <div>{member}</div>
                        <div className="text-sm text-gray-500">{emails[index]}</div>
                      </div>
                      <button
                        onClick={() => {
                          setMembers((mem) => mem.filter((_, i) => i !== index));
                          setEmails((em) => em.filter((_, i) => i !== index));
                        }}
                        aria-label="Remove member"
                        className="text-gray-600 hover:text-purple-500 transition"
                      >
                        ✖
                      </button>
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
      <p className="text-center text-lg mt-4">{bookingId}</p>
      <Footer />
    </div>
  );
};

export default RetryPayment;