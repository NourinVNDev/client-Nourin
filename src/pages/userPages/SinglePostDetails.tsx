import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/userComponents/Headers";
import SocialEvents1 from "../../assets/SocialEvents1.avif";
import Footer from "../../components/userComponents/Footer";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import { CheckOfferAvailable } from "../../service/userServices/userOffer";
import { OfferData } from "../../validations/userValid/TypeValid";
const SinglePostDetails = () => {
  const location = useLocation();
  const [offerData, setOfferData] = useState<OfferData|null>(null);
  // const searchParams = new URLSearchParams(location.search);
  // const data = searchParams.get("data");
  const data = JSON.stringify(location.state?.data);
  console.log("Data for checking",data)
  const parsedData = data ? JSON.parse(decodeURIComponent(data)) : null;
  console.log("ParsedData:",parsedData);

  const initialStartDate = parsedData?.data?.result.savedEvent.startDate
    ? new Date(parsedData.data?.result.savedEvent.startDate)
    : new Date();
  const initialEndDate = parsedData?.data?.result.savedEvent.endDate
    ? new Date(parsedData.data?.result.savedEvent.endDate)
    : new Date();
    const actualAmount = (
      Number(parsedData?.data?.result?.savedEvent?.Amount) - 
      (Number(parsedData?.data?.result?.savedEvent?.Amount) * Number(offerData?.discount_value)) / 100
    ).toFixed(2);
    
    useEffect(() => {
      const isOfferAvailable = async () => {
        try {
          const result = await CheckOfferAvailable(parsedData.data?.result.savedEvent.title);
            console.log("finding the result:",result);
            
          if (result?.success) { // Check if the request was successful
            setOfferData(result.data); // Store offer data in state
        console.log("Offer stored in state:", result.data);
          } else {
            console.log("No offers available.");
          }
          
        } catch (error) {
          console.error("Error checking offer availability:", error);
        }
      };
    
      isOfferAvailable();
    }, []); // Add parsedData as a dependency
    

  // State for the calendar date range
  const [dateRange, setDateRange] = useState<[Date, Date]>([initialStartDate, initialEndDate]);
  const [activeTab, setActiveTab] = useState("information");

  const isHighlightedDate = (date: Date) => {
    const [start, end] = dateRange;
    return date >= start && date <= end;
  };
  // type CalendarOnChange = (value: Date | [Date, Date] | null) => void;

  const handleDateChange:CalendarProps['onChange'] = (value) => {
    if (Array.isArray(value)) {
      setDateRange(value as [Date, Date]); // Ensure both dates are valid
    } else if (value instanceof Date) {
      setDateRange([value, value]); // Single date selection
    } else {
      setDateRange([new Date(), new Date()]); // Reset to default
    }
  };
  


  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative">
      {/* Header */}
      <Header />

      {/* Hero Image */}
      <img
        src={SocialEvents1}
        alt="Social Events"
        className="w-full h-[400px] object-cover"
      />

      <div className="min-h-screen flex-grow bg-gray-100 flex justify-center">
        {/* Main Wrapper */}
        <div className="w-full max-w-5xl">
          <div className="-mt-16 relative bg-white rounded-t-lg shadow-lg p-6 flex">
            {/* Main Content */}
            <div className="w-3/4 pr-6">
              {/* Tabs */}
              <div className="flex justify-around border-b border-gray-300 pb-2 mb-4">
                <button
                  className={`text-lg font-semibold px-4 py-2 rounded ${
                    activeTab === "information"
                      ? "bg-purple-700 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("information")}
                >
                  Information
                </button>
                <button
                  className={`text-lg font-semibold px-4 py-2 rounded ${
                    activeTab === "eventPlan"
                      ? "bg-purple-700 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("eventPlan")}
                >
                  Event Plans
                </button>
                <button
                  className={`text-lg font-semibold px-4 py-2 rounded ${
                    activeTab === "Offer-info"
                      ? "bg-purple-700 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("Offer-info")}
                >
                  Offer-Information
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === "information" && (
                  <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          {parsedData?.data?.result.savedEvent.eventName || "Event Name"}
                        </span>
                        <span className="text-lg text-violet-700 font-semibold">
        
                         
                          
                          {parsedData?.data?.result?.savedEvent?.Amount && offerData?.discount_value && actualAmount 
                            ? (
                              <>
                                <s>₹{parsedData?.data?.result?.savedEvent?.Amount || "0"}</s>
                                <span> → ₹{actualAmount}</span>
                              </>
                            ) 
                            :
                            <span> ₹{parsedData?.data?.result?.savedEvent?.Amount || "0"}</span>}
                            </span>







                        <span className="text-lg text-green-600 font-semibold">
                          {parsedData?.data?.result.savedEvent.companyName || "Company Name"}
                        </span>
                      </div>
                      {/* <div>
                        <span className="text-gray-600 text-sm">
                          Rating: {parsedData?.rating || "No rating available"}
                        </span>
                      </div> */}
                      <div>
                        <p className="text-gray-700">
                          {parsedData?.data?.result.savedEvent.content ||
                            "Details about the event description go here."}
                        </p>
                      </div>
                      <br />
                      <div>
                        <div className="flex justify-between items-center">
                          <h2 className="text-violet-700">Destination:</h2>
                          <p className="text-gray-700">
                            {parsedData?.data?.result.savedEvent.location.address+' , '+parsedData?.data?.result.savedEvent.location.city || "Address"}
                          </p>
                        </div>
                        <br />
                        <div className="flex justify-between items-center">
                          <h2 className="text-violet-700">Start Date:</h2>
                          <p className="text-gray-700">
                            {parsedData?.data.startDate 
                              ? new Date(parsedData.data.startDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long', // 'short' for abbreviated month names
                                  day: 'numeric',
                                }) 
                              : "Start Date"}
                          </p>
                        </div>
                        <br />
                        <div className="flex justify-between items-center">
                          <h2 className="text-violet-700">End Date:</h2>
                          <p className="text-gray-700">
                          {parsedData?.data.endDate 
                            ? new Date(parsedData.data.endDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long', // 'short' for abbreviated month names
                                day: 'numeric',
                              }) 
                            : "End Date"}
                        </p>
                        </div>
                        <br />
                        <div className="flex justify-between items-center">
                          <h2 className="text-violet-700">Included:</h2>
                          <p className="text-gray-700">
                            {parsedData?.data?.result.savedEvent.Included || "Included"}
                          </p>
                        </div>
                        <br />
                        <div className="flex justify-between items-center">
                          <h2 className="text-violet-700">Not Included:</h2>
                          <p className="text-gray-700">
                            {parsedData?.data?.result.savedEvent.notIncluded || "Not Included"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "eventPlan" && (
                  <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Event Plan</h2>
                    <p className="text-gray-600">
                  
                        "Details about the event plan go here."
                    </p>
                  </div>
                )}
                  {activeTab === "Offer-info" && (
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-black">Offer Information</h2>

              {offerData ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Offer Name:</span>
                    <span className="text-lg text-violet-700 font-semibold">{offerData.offerName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Discount On:</span>
                    <span className="text-lg text-violet-700 font-semibold">{offerData.discount_on}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Discount Value:</span>
                    <span className="text-lg text-violet-700 font-semibold">{offerData.discount_value}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Start Date:</span>
                    <span className="text-lg text-green-600 font-semibold">
                      {new Date(offerData.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">End Date:</span>
                    <span className="text-lg text-red-600 font-semibold">
                      {new Date(offerData.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Actual Amount:</span>
                    <span className="text-lg text-violet-700 font-semibold">₹{actualAmount}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No active offers available.</p>
              )}
            </div>
          )}


              </div>
            </div>
                
            {/* Calendar Section */}
          
            <div className="w-2/4 rounded-lg shadow-md p-4 mx-auto">
            <div className=" bg-gray-200">
              <br />
              <h1 className="text-xl font-bold mb-2 text-black text-center">
                Book This Event
              </h1>
              <p className="text-gray-600 text-center mb-2 text-sm leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
       cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.
     </p>
     <br />
     <div className="flex justify-center items-center">
  <input
    type="date"
    value={dateRange[0]?.toISOString().split("T")[0] || ""}
    onChange={(e) => handleDateChange}
    className="px-4 py-2 border rounded-lg text-gray-700 bg-white w-3/5 focus:outline-none focus:ring-2 focus:ring-purple-700 text-center"
  />
</div>


      <br /><br />
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
  <Calendar
    onChange={handleDateChange}
    value={dateRange}
    selectRange={true}
    className="w-full border border-gray-300 rounded-lg"
    tileClassName={({ date }) =>
      isHighlightedDate(date) ? "relative bg-purple-200 rounded-lg" : undefined
    }
    tileContent={({ date }) =>
      isHighlightedDate(date) ? (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
      ) : null
    }
    navigationLabel={({ date }) => (
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
        <span className="text-lg font-bold text-gray-700">
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
      </div>
    )}
    prevLabel={
      <span className="text-purple-700 hover:text-purple-500 transition duration-200">
        &larr;
      </span>
    }
    nextLabel={
      <span className="text-purple-700 hover:text-purple-500 transition duration-200">
        &rarr;
      </span>
    }
    // Add additional props for better styling if needed
  />
</div>
              <br />
              <div className="bg-gray-200 p-6 rounded-lg shadow-md items-center flex justify-center">
  <Link to={`/checkEventDetails/${parsedData.data?.result.savedEvent._id}`}>
  <button  className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition items-center">
    Book The Slots
  </button></Link>
</div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
  }

export default SinglePostDetails;