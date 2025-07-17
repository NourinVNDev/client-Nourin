import { useEffect, useState } from "react";
import { getAllEventData } from "../../service/managerServices/handleEventService";
import { Link } from "react-router-dom";
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import NavBar from "../../components/managerComponents/NavBar";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import useSocket from "../../utils/SocketContext";
import ReusableTable from "../../components/managerComponents/ReusableTable";


interface Location {
  address: string;
  city: string;
}

interface Like {
  user: string;
  createdAt: Date;
}

interface Comment {
  user: string;
  content: string;
  createdAt: Date;
}

interface EventData {
  _id: string
  user: string;
  title: string;
  content: string;
  location: Location;
  startDate: string;
  time: string | null;
  images: string[];
  tags: string[];
  likes: Like[];
  Included: string[],
  notIncluded: string[],
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  eventName: string
  destination: string,
  typesOfTickets: [{ type: string, noOfSeats: number, Amount: number }]
}

const ManagerAllEvents = () => {
  const { socket } = useSocket();
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const navigate = useNavigate();
  const managerId = useSelector((state: RootState) => state.manager._id);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        if (managerId) {
          const response: EventData[] = await getAllEventData(managerId);
          setEvents(response);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchAllEvents();
  }, [managerId]);

  // Sort events
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  // Filter events based on search term
  const filteredEvents = sortedEvents.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEventEdit = (id: string) => {
    navigate(`/editEventDetails/${id}`);
  };

  const handleSearchEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

const token = '007eJxTYGDesOHc8U9eAbn6Qnosl9ZFfE+4/chFI/NHsU5QzceDVToKDEYWBoYWRmlGyZZmqSYmSUmWRsZpRgYmpkappqkpKaaGq6qdMhoCGRn0/LJYGBkgEMTnZEjOzytJzMxLLWJgAADbOCCu';

const startVideoCall = (eventName:string) => {
  navigate(
    '/Manager/videoCall?channelName=container' +
    '&role=manager' +
    '&eventName='+eventName+
    '&token=' + encodeURIComponent(token)
  );
};


  const handleGenerateLink = async (eventId: string,eventName:string) => {
    try {
const joinLink = `join-stream?channelName=container&token=${encodeURIComponent(token)}&eventName=${eventName}`;
      console.log("Join LInk", joinLink);
      const socketMessage = { link: joinLink, managerId: managerId, eventId: eventId }
      socket?.emit('post-videoCallLink', socketMessage, (response: any) => {
        console.log("Message sent Aknowledgement", response);

      })



      alert('Notification sent with join link!');
    } catch (error) {
      console.error('Failed to generate link or send notification', error);
      alert('Something went wrong.');
    }
  };

const heading=["EventName", "Images", "Title", "Location/Link", "Date", "Seat Information/Video Call", "Actions"]

  return (
   <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <NavBar />
        <div className="flex-1 p-5">
        
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-black font-semibold">All Events</h2>
              <Link to="/Manager/addNewEvent">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Add Event
                </button>
              </Link>
            </div>
            <div className="max-w-md mx-auto">
              <div className="relative flex items-center w-full h-12 bg-white rounded-lg focus-within:shadow-lg overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm  bg-white text-gray-700 pr-2"
                  type="text"
                  id="search"
                  onChange={handleSearchEvent}
                  placeholder="Search by Event Name..."
                />
              </div>
            </div>
            <br /><br />
     <ReusableTable
 headers={heading}
 data={currentEvents}
 renderRow={(event, index) => {
   if (currentEvents.length === 0) {
     return (
       <tr>
         <td colSpan={heading.length} className="text-center text-gray-500 py-6">
           No events found.
         </td>
       </tr>
     );
   }

   return (
     <tr
       key={event._id}
       className={`text-gray-800 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
     >
       <td className="border border-gray-300 px-4 py-3">{event.eventName}</td>
       <td className="border border-gray-300 px-4 py-3">
         {event.images?.length > 0 ? (
           <div className="flex flex-wrap gap-2">
             {event.images.map((img: string, idx: number) => (
               <img
                 key={idx}
                 src={img}
                 alt={`img-${idx}`}
                 className="w-16 h-16 object-cover rounded border border-gray-200"
               />
             ))}
           </div>
         ) : (
           "No images"
         )}
       </td>
       <td className="border border-gray-300 px-4 py-3">{event.title}</td>
       <td className="border border-gray-300 px-4 py-3">
         {event.title !== "Virtual" ? (
           event.destination
         ) : (
           <button
             onClick={() => handleGenerateLink(event._id, event.eventName)}
             className="text-blue-600 underline hover:text-blue-800 text-sm"
           >
             Generate a Link
           </button>
         )}
       </td>
       <td className="border border-gray-300 px-4 py-3">{formatDate(event.startDate)}</td>
       <td className="border border-gray-300 px-4 py-3">
         {event.title !== "Virtual" ? (
           <div className="flex flex-col space-y-2">
             {event.typesOfTickets.map((ticket: any, i: number) => (
               <div key={i} className="flex justify-between">
                 <span className="text-indigo-700 font-semibold">{ticket.type}</span>
                 <div className="flex items-center space-x-2">
                   <span className="text-green-600 font-medium">₹{ticket.Amount}</span>
                   <span className="text-gray-500 text-sm">({ticket.noOfSeats} seats)</span>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <button
             className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl"
             onClick={() => startVideoCall(event.eventName)}
           >
             Start Video Call
           </button>
         )}
       </td>
       <td className="border border-gray-300 px-4 py-3">
         <button
           onClick={() => handleEventEdit(event._id)}
           className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600"
         >
           Edit
         </button>
       </td>
     </tr>
   );
 }}
/>

               <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-blue-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Next
                  </button>
                </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerAllEvents;
