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

  const [eventDetails, setEventDetails] = useState<EventDetails[]>([]);

  useEffect(() => {
    const fetchEventHistory = async () => {
      try {
        const result = await eventHistoryDetails();
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
      } catch (error) {
        console.error("Error fetching event history:", error);
      }
    };

    fetchEventHistory();
  }, []);

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>

        <main className="flex-1 p-4 lg:p-8 bg-gray-50">
          
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Event History</h1>

            {eventDetails.length > 0 ? (
              eventDetails.map((event, index) => (
                <Card key={index} className="bg-white shadow-md rounded-lg mb-6">
                  <div className="flex flex-col md:flex-row items-start gap-6 p-4 md:p-6">
                    {/* Image Container */}
                    <div className="w-full md:w-40 h-40 rounded-full overflow-hidden mx-auto md:mx-0 flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.eventName || "Event Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{event.eventName}</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600">
                          <p className="text-sm">
                            Agency: <span className="text-green-700 font-medium">{event.companyName}</span>
                          </p>
                          <p className="text-sm">
                            Package: <span className="text-gray-900 font-medium">{event.title}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                          <Users className="w-4 h-4" />
                          <span>{event.noOfPerson} Person</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                          <Calendar className="w-4 h-4" />
                          <span>{event.noOfDays} Days</span>
                        </div>
                        <div className="bg-gray-100 px-3 py-1.5 rounded-full">
                          Date: <span className="text-gray-900 font-medium">{event.endDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                        <p className="text-2xl font-bold text-orange-500">₹{event.amount.toLocaleString()}</p>
                     <Button
                          className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600"
                          onClick={() => {
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
              ))
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

