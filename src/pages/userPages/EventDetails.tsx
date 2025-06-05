import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/userComponents/Headers";
import Footer from "../../components/userComponents/Footer";
import { getEventData } from "../../service/userServices/userPost";
import { Users, Calendar } from "lucide-react";
import { makeStripePayment } from "../../service/userServices/userPost";
import { PaymentData } from "../../validations/userValid/TypeValid";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { saveBillingDetailsOfUser } from "../../service/userServices/userPost";
import toast, { Toaster } from "react-hot-toast";
import { BillingValidation } from "../../validations/userValid/BillingValidSchema";

const EventDetails = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
const [editIndex, setEditIndex] = useState<number|null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const userId = localStorage.getItem('userId');


  const { id, selectedType } = useParams();
const handleNoOfPerson = (e: React.FormEvent) => {
  e.preventDefault();

  if (!memberName.trim() || !memberEmail.trim()) return;

  let updatedMembers: string[] = [];
  let updatedEmails: string[] = [];

  if (isEditing && editIndex !== null) {
    updatedMembers = [...members];
    updatedEmails = [...emails];

    updatedMembers[editIndex] = memberName;
    updatedEmails[editIndex] = memberEmail;

    setIsEditing(false);
    setEditIndex(null);
  } else {
    updatedMembers = [...members, memberName];
    updatedEmails = [...emails, memberEmail];
  }

  const updatedAmount = (eventData.actualAmount || eventData.amount || 0) * updatedMembers.length;

  setMembers(updatedMembers);
  setEmails(updatedEmails);

  setEventData((prev) => ({
    ...prev,
    Amount: updatedAmount,
    amount: updatedAmount,
    noOfPerson: updatedMembers.length,
    bookedMembers: updatedMembers,
    bookedEmails: updatedEmails
  }));

  setMemberName("");
  setMemberEmail("");
};
  const [eventData, setEventData] = useState<PaymentData>({
    bookedId: "",
    userId: "",
    categoryName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    companyName: "",
    images: [""],
    eventName: "",
    noOfPerson: 0,
    noOfDays: 0,
    Amount: 0,
    type: "",
    managerId: "",
    Included: [""],
    notIncluded: [""],
    bookingId: "",
    actualAmount: 0,
    bookedMembers: [],
    bookedEmails: [],
    location: '',
    amount: 0,
    paymentStatus: '',
    totalPercentage:0
  });
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
      const result = await makeStripePayment(eventData);
      console.log("Results:", result);
      if (!result.success) {
        toast.error(result.message);
      }
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

      const event = result?.data?.result?.savedEvent || {};
      const ticket = event?.typesOfTickets?.find(
        (ticket: any) => ticket.type.toLowerCase() === selectedType
      );

      const managerDiscount = Number(event?.managerOffer?.discount_value || 0);
      const adminDiscount = Number(event?.adminOffer?.discount_value || 0);
      const totalDiscount = Math.min(managerDiscount + adminDiscount, 100);

      const isVirtual = event.title === 'Virtual';

      const baseTicketAmount = ticket?.Amount ?? 0;
      const discountedTicketAmount = Math.floor(baseTicketAmount * (1 - totalDiscount / 100));

      const baseEventAmount = event?.amount ?? 0;
      const discountedEventAmount = Math.floor(baseEventAmount * (1 - totalDiscount / 100));

      setEventData((prevData) => ({
        ...prevData,
        userId: user?._id || prevData.userId,
        firstName: user?.firstName || prevData.firstName || "",
        lastName: user?.lastName || prevData.lastName || "",
        email: user?.email || prevData.email || "",
        phoneNo: user?.phoneNo || prevData.phoneNo || '',
        address: user?.Address || prevData.address,
        categoryName: event?.title || prevData.categoryName,
        companyName: event?.companyName || prevData.companyName,
        images: event?.images || prevData.images,
        eventName: event?.eventName || prevData.eventName,
        location: event?.address,
        noOfPerson: event?.noOfPerson || prevData.noOfPerson,
        noOfDays: event?.noOfDays || prevData.noOfDays,
        type: selectedType || "",
        managerId: event?.Manager || prevData.managerId,
        Included: ticket?.Included || [],
        notIncluded: ticket?.notIncluded || [],
        actualAmount: isVirtual
          ? discountedEventAmount
          : discountedTicketAmount,
        Amount: isVirtual
          ? 0
          : discountedTicketAmount,
        bookedId: prevData.bookedId || '',
        bookingId: prevData.bookingId || '',
        bookedMembers: [],
        startDate: event?.startDate,
        amount: isVirtual ? discountedEventAmount : 0,
        paymentStatus: prevData.paymentStatus || '',
      }));
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  fetchEventData();
}, [id, user, selectedType]);



  useEffect(() => {
    console.log("Event PaymentStatus:", eventData);
  }, [eventData]);

  const SaveBillingDetails = async (e: React.FormEvent) => {
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

    const eventId = id ?? userId;
    if (!eventId) {
      console.error("Neither id nor userId is defined.");
      return;
    }

    const formData = {
      eventId: eventId,
      categoryName: eventData.categoryName,
      userId: eventData.userId,
      firstName: eventData.firstName,
      lastName: eventData.lastName,
      email: eventData.email,
      phoneNo: eventData.phoneNo,
      address: eventData.address,
      ticketType: selectedType || '',
      categoryType: eventData.categoryName,

    }
    console.log("Helloo");

    const result = await saveBillingDetailsOfUser(formData);
    console.log("Onnce", result);
    if (result.success) {
      console.log("Billing details saved successfully:", result.data.data.id);
      toast.success('Saved Billing Details');
      setEventData((prevData) => ({
        ...prevData,
        ...result.data.billingDetails,
        bookedId: result.data?.data.bookingId,
        bookingId: result.data?.data.id,
        paymentStatus: result.data?.data.paymentStatus
      }));
    } else if (result.message == 'No available seats for the selected ticket type') {
      toast.error(result.message);
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
              <form className="space-y-4" onSubmit={SaveBillingDetails}>
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
  {isEditing ? "Update Member" : "Add Member"}
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
                      {members.length} person{(members.length < 1 || eventData.noOfPerson > 1) ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{eventData.noOfDays} days</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">₹{eventData.Amount || eventData.amount}</span>
                </div>
                <p className="text-lg font-semibold text-gray-800 border-b-2 pb-1">No of People</p>
                <ul className="mt-4 space-y-2">
                  {members.map((member, index) => (
                    <li key={index} className="text-gray-700 bg-gray-100 p-1 flex justify-between items-center">
                      <div>
                        <div>{member}</div>
                        <div className="text-sm text-gray-500">{emails[index]}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                       
                        <button
                          onClick={() => {
    setMemberName(members[index]);
    setMemberEmail(emails[index]);
    setIsEditing(true);
    setEditIndex(index);
  }}
                          aria-label="Edit member"
                          className="text-gray-600 hover:text-blue-500 transition"
                        >
                          ✎
                        </button>

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
                      </div>
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
