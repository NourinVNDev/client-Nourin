import { useEffect,useState } from "react";
import { fetchEventsAndBookingData } from "../../service/adminServices/adminUserManager";
import { useParams } from "react-router-dom";
import Header from "../../components/adminComponents/Header";
import Footer from "../../components/adminComponents/Footer";
import NavBar from "../../components/adminComponents/NavBar";

type Booking = {
    event: {
      _id: string;
      eventName: string;
      title: string;
      startDate: string;
      images: string[];
    };

    bookingDetails: {
      bookingDate: string;
      totalAmount: number;
      ticketType: string;
      paymentStatus: string;
      noOfPersons: number;
    };
  };
  
  
  const ManagerEventsDetails = () => {
    const { managerId } = useParams();
    const [eventsData, setEventsData] = useState<Booking[]>([]);
  
    useEffect(() => {
      const fetchEventData = async () => {
        if (managerId) {
          const result = await fetchEventsAndBookingData(managerId);
          if (result?.success && result.user) {
            console.log("Result:",result);
            
            setEventsData(result.user);
          }
        }
      };
  
      fetchEventData();
    }, [managerId]);
  
    const getTicketSummaryPerEvent = (bookings: Booking[]) => {
        const eventMap: Record<string, any> = {};


        console.log("Bookingg",bookings);
        
      
        bookings.forEach(booking => {
          const eventId = booking.event._id;    
          const ticketType = booking.bookingDetails.ticketType==='undefined'?'Online':booking.bookingDetails.ticketType;
          const status = booking.bookingDetails.paymentStatus;


          console.log("Booking",ticketType,status);
          
      
          if (!eventMap[eventId]) {
            eventMap[eventId] = {
              event: booking.event,
              tickets: {}
            };
          }
      
          if (!eventMap[eventId].tickets[ticketType]) {
            eventMap[eventId].tickets[ticketType] = {
              Confirmed: 0,
              Cancelled: 0,
              Completed: 0
            };
          }
      
          eventMap[eventId].tickets[ticketType][status] += booking.bookingDetails.noOfPersons;
          console.log("EventMap:",eventMap);
        });
      
        return Object.values(eventMap);
      };
      
      const eventSummaries = getTicketSummaryPerEvent(eventsData);
    return(
        <div className="w-screen h-screen flex flex-col bg-gray-100 text-gray-800">
        <Header />
        <div className="flex flex-1">
          <NavBar />
          <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
  <h2 className="text-2xl font-bold">
    🎟️ Manager's Event Ticket Summary
  </h2>

</div>


      
{eventSummaries.map((summary, idx) => (
  <div
    key={idx}
    className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
  >
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={summary.event.images[0]}
          alt={summary.event.eventName}
          className="w-48 h-auto rounded-md shadow"
        />
        <div>
          <h3 className="text-xl font-semibold">
            {summary.event.eventName}{' '}
            <span className="text-gray-500">({summary.event.title})</span>
          </h3>
          <p className="text-sm text-gray-600">
            Start Date: {new Date(summary.event.startDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Download File
      </button> */}
    </div>

    <table className="w-full table-auto border-collapse">
      <thead className="bg-blue-100 text-blue-900">
        <tr>
          <th className="border px-4 py-2">Ticket Type</th>
          <th className="border px-4 py-2">Confirmed</th>
          <th className="border px-4 py-2">Cancelled</th>
          <th className="border px-4 py-2">Completed</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(summary.tickets).map(([ticketType, counts]: any) => (
          <tr key={ticketType} className="bg-white even:bg-gray-50">
            <td className="border px-4 py-2">{ticketType}</td>
            <td className="border px-4 py-2">{counts.Confirmed || 0}</td>
            <td className="border px-4 py-2">{counts.Cancelled || 0}</td>
            <td className="border px-4 py-2">{counts.Completed || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}

          </div>
        </div>
        <Footer />
      </div>
      
      
      
    )

}
export default ManagerEventsDetails;