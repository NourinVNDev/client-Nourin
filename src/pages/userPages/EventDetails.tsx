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
  const [members, setMembers] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const userId = localStorage.getItem('userId');

  console.log("User Details from store", user.Address);

  const { id, selectedType } = useParams();
  const handleNoOfPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    setMembers([...members, memberName]);
    setMemberName("");

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
    location:''


  });
  const makePayment = async () => {
    console.log("Match");
    if (members.length <= 0) {
      toast.error("Add Members Name");
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
        console.log("Ticket", ticket);

        setEventData((prevData) => ({
          ...prevData,
          userId: user?._id || prevData.userId,
          firstName: user?.firstName || prevData.firstName || "",
          lastName: user?.lastName || prevData.lastName || "",
          email: user?.email || prevData.email || "",
          phoneNo: user?.phoneNo || prevData.phoneNo || '',
          categoryName: event?.title || prevData.categoryName,
          companyName: event?.companyName || prevData.companyName,
          images: event?.images || prevData.images,
          eventName: event?.eventName || prevData.eventName,
          address: user?.Address || prevData.address,
          location:event.address,
          noOfPerson: event?.noOfPerson || prevData.noOfPerson,
          noOfDays: event?.noOfDays || prevData.noOfDays,
          Amount: ticket?.offerDetails?.offerAmount ?? ticket?.Amount ?? prevData.Amount,
          actualAmount: ticket?.offerDetails?.offerAmount ?? ticket?.Amount ?? prevData.Amount,
          bookedId: prevData.bookedId,
          bookingId: prevData.bookingId,
          type: selectedType || "",
          managerId: event?.Manager || prevData.managerId,
          Included: event?.typesOfTickets.find((ticket: any) => ticket.type?.toLowerCase()=== selectedType)?.Included || [],
          notIncluded: event?.typesOfTickets.find((ticket: any) => ticket.type?.toLowerCase() === selectedType)?.notIncluded || [],
          bookedMembers: [],
          startDate:event?.startDate

        }));

      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };


    fetchEventData();
  }, [id, user]);

  useEffect(() => {
    console.log("Updated eventData:", selectedType);
    console.log("Check Included,notIncluded",eventData.Included,eventData.notIncluded);
  }, [eventData]);




  useEffect(() => {
    setEventData((prevData) => ({
      ...prevData,
      Amount: prevData.actualAmount * members.length,
      noOfPerson: Math.max(members.length, 1),
      bookedMembers: [...members],
    }));
  }, [members]);



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
      ticketType: selectedType || ''
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
        bookedId: result.data?.data.id,
        bookingId: result.data?.data.bookingId
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
                  className="w-1/2 bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
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
                <p className="text-sm text-gray-600">📍 {eventData.location}</p>
                {/* <div className="flex items-center gap-2">
         <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div> 
        <span className="text-sm text-gray-600">1,259 ratings (2.3k reviews)</span>
      </div>  */}
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
                  <span className="text-2xl font-bold">₹{eventData.Amount}</span>
                </div>
                <p className="text-lg font-semibold text-gray-800 border-b-2 pb-1">No of People</p>
                <ul className="mt-4 space-y-2">
                  {members.map((member, index) => (
                    <li key={index} className="text-gray-700 bg-gray-100 p-1 flex justify-between items-center">
                      <span>{member}</span>
                      <button
                        onClick={() =>
                          setMembers((mem) => mem.filter((m) => m !== member))
                        }
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
      <Footer />
    </div>
  );
};

export default EventDetails;
