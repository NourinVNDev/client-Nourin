import { useEffect, useState } from 'react';
import { Button, Card } from "@nextui-org/react";
import { Calendar, Users } from "lucide-react";
import { format } from 'date-fns';
import { eventHistoryDetails } from "../../service/userServices/userProfile";
import ReviewModal from "../../components/userComponents/ReviewModal";
import Header from "../../components/userComponents/Headers";
import Footer from "../../components/userComponents/Footer";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import { getExistingReviewAndRating } from '../../service/userServices/userProfile';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/store';
import { animateScroll as scroll } from "react-scroll";
// Define an interface for the event object
interface EventDetails {
  eventName: string;
  companyName: string;
  title: string;
  noOfPerson: number;
  noOfDays: number;
  endDate: string;
  amount: number;
  userId: string;
  eventId: string;
  image: string;
}

const EventHistory = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReviewRating, setIsReviewRating] = useState({
    review: "",
    rating: 0
  });
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 3;

  const [eventDetails, setEventDetails] = useState<EventDetails[]>([]);
  const userId=useSelector((state:RootState)=>state.user._id);
  useEffect(() => {
    const fetchEventHistory = async () => {
      try {
        if(userId){
          const result = await eventHistoryDetails(userId);
          if (result.success && result.data.length > 0) {
            console.log("Black",result.data);
            const events = result.data.map((event: any) => ({
              eventName: event.eventId.eventName || "",
              companyName: event.eventId.companyName || "",
              title: event.eventId.title || "",
              noOfPerson: event.NoOfPerson || 0,
              noOfDays: event.eventId.noOfDays || 0,
              endDate: format(new Date(event.eventId.endDate), 'dd-MM-yyyy'),
              amount: event.totalAmount || 0,
              userId: event.userId || "",
              eventId: event.eventId._id || "",
              image: event.eventId.images[0] || ""
            }));
            setEventDetails(events);
          }

        }
     
      } catch (error) {
        console.error("Error fetching event history:", error);
      }
    };

    fetchEventHistory();
  }, []);
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = [...eventDetails].reverse().slice(indexOfFirstEvent, indexOfLastEvent);
  
    const totalPages = Math.ceil(eventDetails.length / eventsPerPage);
  
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      scroll.scrollToTop({ duration: 800, smooth: "easeInOutQuad" });
    };
  useEffect(() => {
    console.log("Modal state changed:", isModalOpen);
  }, [isModalOpen]);
  

  const getReviewAndRating = async (eventId: string, userId: string) => {
    console.log("Fetching review for:", { eventId, userId });

    if (!eventId || !userId) {
        console.error("Invalid eventId or userId", { eventId, userId });
        return;
    }

    try {
        const result = await getExistingReviewAndRating(eventId, userId);
        console.log("API Response:", result);

        setIsReviewRating({
            review: result.message === "No matching data found" ? "" : result.data.data.review,
            rating: result.message === "No matching data found" ? 0 : result.data.data.rating
        });

        setModalOpen(true);
    } catch (error) {
        console.error("Error fetching review and rating:", error);
    }
};


  return (
       <div className="min-h-screen flex flex-col w-full">
      <Header />
      <div className="flex-1 flex w-full">
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>

        <main className="flex-1 p-4 lg:p-8 bg-gray-50 w-full">
          
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Event History</h1>

            {currentEvents.length > 0 ? (
              <>
              {currentEvents.map((event, index) => (
                <Card key={index} className="bg-white shadow-md rounded-lg mb-4">
                  <div className="flex flex-col md:flex-row items-start gap-4 p-3 md:p-4 w-full">
           
                    <div className="w-full md:w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.eventName || "Event Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Container */}
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
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Users className="w-3 h-3" />
                          <span>{event.noOfPerson} Person</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100  py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          <span>{event.noOfDays} Days</span>
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded-full">
                          Date: <span className="text-gray-900 font-medium">{event.endDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pt-1">
                        <p className="text-xl font-bold text-orange-500">₹{event.amount.toLocaleString()}</p>
                     <Button
                          className="w-full sm:w-auto bg-green-500 text-white text-sm px-3 py-1 hover:bg-green-600"
                          onPress={() => {
                            if (!event.eventId || !event.userId) {
                              console.error("Invalid event data!", event);
                              return;
                            }
                            console.log("Hello",event.eventId)
                            getReviewAndRating(event.eventId, event.userId);
                          }}
                        >
                          Review & Rating
                        </Button>
                        


                        <ReviewModal
                          isOpen={isModalOpen}
                          onClose={() => setModalOpen(false)}
                          existingReview={isReviewRating}
                          eventId={event.eventId}
                          userId={event.userId}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
                {totalPages > 1 && (
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          disabled={currentPage === 1}
          onPress={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-gray-800 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onPress={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    )}
              
              </>
            ) : (
              <div className="text-center text-gray-600 col-span-full">No event History found.</div>
            )}
             

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default EventHistory;

