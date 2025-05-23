import { useEffect, useState } from "react";
import Header from "../../components/verifierComponents/Header";
import { fetchAllCompanyEvents } from "../../service/verifierServices/verifierLogin";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../../components/verifierComponents/Footer";
import { useNavigate, useParams } from "react-router-dom";

interface EventData {
    _id: string;
    eventName: string;
    companyName: string;
  address:string;
    startDate: string;
    endDate: string;
    typesOfTickets: any[];
    images?: string[];
}

const ListAllEvents = () => {

    const [events, setEvents] = useState<EventData[]>([]);
    const navigate = useNavigate();
    const {email}=useParams<{email:string}>()
    useEffect(() => {
        const fetchAllEvents = async () => {


            console.log("Why",email);
            
            if ( email) {
                const result = await fetchAllCompanyEvents(email);
                if (result.message === "No Events hosted in this company") {
                    toast.error(result.message);
                } else {
                    console.log("cannn",result.data);
            
                    const today = new Date();
                    const upcomingEvents = result.data.filter((event: EventData) => {
                        const startDate = new Date(event.startDate);
                        return startDate >= today;
                    });
                    console.log("Upcomming Events",upcomingEvents);
                    
                    setEvents(upcomingEvents);
                }
            }
        };
    
        fetchAllEvents();
    }, [email]);

    const handleParticularEvent = (eventId: string) => {
        navigate(`/verifier/bookedEventDetails/${eventId}`)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <Toaster position="top-center" />

            <div className="w-full px-6 py-8">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">All Events</h2>

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden p-5 transition-transform transform hover:scale-105">
                                {event.images?.[0] && (
                                    <img
                                        src={event.images[0]}
                                        alt={event.eventName}
                                        className="w-full h-52 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold text-gray-900">{event.eventName}</h3>
                                <p className="text-gray-600"><strong>Company:</strong> {event.companyName}</p>
                                <p className="text-gray-600"><strong>Location:</strong> {event.address}</p>
                                <p className="text-gray-600"><strong>Start Date:</strong> {new Date(event.startDate).toDateString()}</p>
                                <p className="text-gray-600"><strong>End Date:</strong> {new Date(event.endDate).toDateString()}</p>
                                <p className="text-gray-600"><strong>Tickets:</strong> {event.typesOfTickets.length} types</p>

                                <div className="mt-4">
                                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={() => {handleParticularEvent(event._id)}}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No events available</p>
                )}
            </div>
            <Footer/>
      
        </div>
    );
};

export default ListAllEvents;