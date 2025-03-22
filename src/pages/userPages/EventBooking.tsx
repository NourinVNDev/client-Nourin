import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button, Card } from "@nextui-org/react";
import { Calendar, Users } from "lucide-react";
import { animateScroll as scroll } from "react-scroll"; // Import scrolling effect
import Header from "../../components/userComponents/Headers";
import Footer from "../../components/userComponents/Footer";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import { eventBookingDetails } from "../../service/userServices/userProfile";
import OrderDetailsModal from "../../components/userComponents/OrderDetailModal";
import { EventDetails } from "../../validations/userValid/TypeValid";
import { cancelEventBooking } from "../../service/userServices/userOfferAndWallet";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { useNavigate } from "react-router-dom";

const EventBooking = () => {
  const [eventDetails, setEventDetails] = useState<EventDetails[]>([]);
  const  navigate=useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3; // Number of events per page
  const userId=useSelector((state:RootState)=>state.user._id)

  useEffect(() => {
    const fetchEventBooking = async () => {
      try {
        const result = await eventBookingDetails();
        console.log("Data checking", result.data);

        if (result.success && result.data.length > 0) {
          const events = result.data.map((event: any) => ({
            _id: event._id,
            eventName: event.eventId.eventName || "",
            companyName: event.eventId.companyName || "",
            title: event.eventId.title || "",
            noOfPerson: event.NoOfPerson || 0,
            noOfDays: event.eventId.noOfDays || 0,
            endDate: format(new Date(event.eventId.endDate), "dd-MM-yyyy"),
            amount: event.totalAmount || 0,
            userId: event.userId || "",
            eventId: event.eventId._id || "",
            image: event.eventId.images[0] || "",
            bookingId: event.bookingId,
            type: event.ticketDetails.type || "",
            Included: event.ticketDetails.Included || [],
            notIncluded: event.ticketDetails.notIncluded || [],
            paymentStatus:event.paymentStatus
          }));
          setEventDetails(events);
        }
      } catch (error) {
        console.error("Error fetching event history:", error);
      }
    };

    fetchEventBooking();
  }, []);

  // Pagination Logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventDetails.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(eventDetails.length / eventsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    scroll.scrollToTop({ duration: 800, smooth: "easeInOutQuad" }); // Smooth scrolling
  };
  const onCancelEventfn = async(bookedId: string) => {
    console.log("BookingId:", bookedId);
    if(userId){
      const result=await cancelEventBooking(bookedId,userId);
      console.log("Result of Cancel",result);
      if(result.success){
        navigate('/user/bookedEvent')
      }

    }

    
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>

        <main className="flex-1 p-4 lg:p-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Booked Events</h1>

            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <Card key={event._id} className="bg-white shadow-md rounded-lg mb-4">
                  <div className="flex flex-col md:flex-row items-start gap-4 p-3 md:p-4">
                    <div className="w-full md:w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.eventName || "Event Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{event.eventName}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-gray-600">
                          <p className="text-xs">
                            Agency: <span className="text-green-700 font-medium">{event.companyName}</span>
                          </p>
                          <p className="text-xs">
                            Package: <span className="text-gray-900 font-medium">{event.title}</span>
                          </p>
                          <p className="text-xs">
                            Ticket-Type: <span className="text-gray-900 font-medium">{event.type}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Users className="w-3 h-3" />
                          <span>{event.noOfPerson} Person</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          <span>{event.noOfDays} Days</span>
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded-full">
                          Date: <span className="text-gray-900 font-medium">{event.endDate}</span>
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded-full">
                          Status: <span className="text-gray-900 font-medium">{event.paymentStatus}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                        <p className="text-xl font-bold text-orange-500">₹{event.amount.toLocaleString()}</p>
                        <Button
                          className="w-full sm:w-auto bg-green-500 text-white text-sm px-3 py-1 hover:bg-green-600"
                          onClick={() => setSelectedEvent(event)} // Set selected event details
                        >
                          Order Details
                        </Button>

                        <OrderDetailsModal
                          isOpen={!!selectedEvent}
                          onClose={() => setSelectedEvent(null)}
                          event={selectedEvent}
                          onCancelEvent={onCancelEventfn}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

              ))
            ) : (
              <div className="text-center text-gray-600 col-span-full">No  Booking events found.</div>
            )}

            {/* Pagination Controls */}
            {eventDetails.length > eventsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-gray-800 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EventBooking;
