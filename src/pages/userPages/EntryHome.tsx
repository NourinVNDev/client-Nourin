import  { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import Header1 from "../../components/userComponents/Header1";
import Footer from "../../components/userComponents/Footer";
import { fetchSocialEventDetails } from "../../service/userServices/register";
import { EventData } from "../../validations/userValid/TypeValid";

export default function EntryHome() {
  const [eventData, setEventData] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const result = await fetchSocialEventDetails();
        if (result && result.data) {
          setEventData(result.data);
          console.log("EventData", result.data); // Check the event data in the console
        } else {
          console.log("No event data found.");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header1 />

      <section className="relative h-screen flex flex-col justify-center items-center text-center text-white">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover text-black"
          autoPlay
          loop
          muted
        >
          <source
            src="https://eventconcept.com/wp-content/uploads/2024/03/EC_SplashPage_FD_1920x1080_v009-1.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Content on top of video */}
        <div className="relative z-10 max-w-3xl px-6 -mt-8">
          <h2 className="text-5xl font-semibold mb-4">Welcome to MeetCraft</h2>
        </div>

      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Discover <span className="text-blue-600">MeetCraft</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            MeetCraft is your gateway to the world of innovation and
            collaboration. Join dynamic hackathons where developers, designers,
            and creative thinkers unite to turn ideas into reality. Connect,
            build, and innovate with a like-minded community that pushes the
            boundaries of technology.
          </p>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            Whether you're a beginner looking to learn or a pro aiming to
            showcase your expertise, MeetCraft provides the perfect platform
            to challenge yourself, collaborate with the best minds, and bring
            groundbreaking projects to life.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventData.length > 0 ? (
              eventData.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="space-y-2 mb-4">
                    {event.images && event.images.map((image, index) => (
                      <img
                        key={index}
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    ))}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{event.eventName}</h3>
                    <p className="text-gray-600 mb-4">{event.title}</p>

                    <p className="text-gray-500 text-sm mb-4">
                      {event.address || 'Remote'}
                    </p>

                  </div>
                </div>
              ))
            ) : (
              <p>No events available</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Have questions or need support? We're here to help. Reach out to us,
            and we'll get back to you as soon as possible.
          </p>

          <div className="flex justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-lg transition duration-300">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
