import { useEffect, useState } from "react";
import { getAllEventData } from "../../service/managerServices/handleEventService";
import { Link } from "react-router-dom";
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import NavBar from "../../components/managerComponents/NavBar";

import { useNavigate } from "react-router-dom";
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
  destination: string
}

const ManagerAllEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const navigate = useNavigate();


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`; // Return formatted date
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response: EventData[] = await getAllEventData();
        setEvents(response);


      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchAllEvents();
  }, []);


  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleEventEdit = async (id: string) => {
    console.log("EventId", id);
    navigate(`/editEventDetails/${id}`);




  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      <Header />
      <div className="flex flex-1">
        <NavBar />
        <div className="flex-1 p-5">
          <br />
          <div className="flex flex-col w-full px-8 py-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
              <Link to="/Manager/addNewEvent">
                <button className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600">
                  Add Event
                </button>
              </Link>
            </div>
            <div className="overflow-x-auto bg-white shadow-md rounded">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {["EventName", "Images", "Title", "Location", "Date", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.map((event, index) => (
                    <tr
                      key={index}
                      className={`text-gray-800 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="border border-gray-300 px-4 py-3">
                        {event.eventName}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {event.images && event.images.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {event.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={`Event image ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border border-gray-200"
                              />
                            ))}
                          </div>
                        ) : (
                          "No images"
                        )}
                      </td>


                      <td className="border border-gray-300 px-4 py-3">
                        {event.title}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {event.destination}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {formatDate(event.startDate)}
                      </td>

                      <td>
                        <button onClick={() => { handleEventEdit(event._id) }} className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 hover:bg-blue-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerAllEvents;
