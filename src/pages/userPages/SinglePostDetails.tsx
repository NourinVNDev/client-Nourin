import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/userComponents/Headers";
import SocialEvents1 from "../../assets/SocialEvents1.avif";
import Footer from "../../components/userComponents/Footer";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";


// import { CheckOfferAvailable } from "../../service/userServices/userOffer";
// import { OfferData } from "../../validations/userValid/TypeValid";
const SinglePostDetails = () => {
  const location = useLocation();
  const data = JSON.stringify(location.state?.data);
  console.log("Data for checking", data)
  const parsedData = data ? JSON.parse(decodeURIComponent(data)) : null;
  console.log("ParsedData:", parsedData);
  const generalTicketAmount =
    parsedData?.data?.result?.savedEvent?.typesOfTickets?.find(
      (ticket: any) => ticket.type === "general"
    )?.Amount || 0;

  type selectTicket = {
    type: string,
    noOfSeats: number,
    Included: [string],
    notIncluded: [string],
    Amount: number

  }

  console.log('Amount:', generalTicketAmount);
  const [selectedTicket, setSelectedTicket] = useState<selectTicket>();

  // const seatOrder = ["GENERAL", "VIP", "PREMIUM"];

  const tickets = (parsedData?.data?.result?.savedEvent?.typesOfTickets || [])
    .map((ticket: any) => ({
      ...ticket,
      type: ticket.type.toUpperCase(),
    }))
  //   .sort((a: any, b: any) => seatOrder.indexOf(a.type) - seatOrder.indexOf(b.type));



  const initialStartDate = parsedData?.data?.result.savedEvent.startDate
    ? new Date(parsedData.data?.result.savedEvent.startDate)
    : new Date();
  const initialEndDate = parsedData?.data?.result.savedEvent.endDate
    ? new Date(parsedData.data?.result.savedEvent.endDate)
    : new Date();



  // State for the calendar date range
  const [dateRange, setDateRange] = useState<[Date, Date]>([initialStartDate, initialEndDate]);
  const [activeTab, setActiveTab] = useState("information");

  const isHighlightedDate = (date: Date) => {
    const [start, end] = dateRange;
    return date >= start && date <= end;
  };


  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (Array.isArray(value)) {
      setDateRange(value as [Date, Date]);
    } else if (value instanceof Date) {
      setDateRange([value, value]);
    } else {
      setDateRange([new Date(), new Date()]);
    }
  };
  const generalTicket = parsedData?.data?.result?.savedEvent?.typesOfTickets[0]

  const amount = generalTicket?.Amount || "Not Available";
  const offerAmount = generalTicket?.offerDetails?.offerAmount || "Not Available";


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-x-hidden">
      <Header />
      <img
        src={SocialEvents1}
        alt="Social Events"
        className="w-full h-[400px] object-cover"
      />

      <div className="min-h-screen flex-grow bg-gray-100 flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <div className="-mt-16 relative bg-white rounded-t-lg shadow-lg p-6 flex flex-col md:flex-row">
            <div className="w-full md:w-3/4 md:pr-6">
              <div className="flex justify-around border-b border-gray-300 pb-2 mb-4">
                <button
                  className={`text-lg font-semibold px-4 py-2 rounded ${activeTab === "information"
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("information")}
                >
                  Information
                </button>
                <button
                  className={`text-lg font-semibold px-4 py-2 rounded ${activeTab === "seatPlan"
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("seatPlan")}
                >
                  Seat Plans
                </button>
                <button
                  className={`text-lg font-semibold px-4 py-2 rounded ${activeTab === "Offer-info"
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("Offer-info")}
                >
                  Offer-Information
                </button>
              </div>


              <div className="mt-4">
                {activeTab === "information" && (
                  <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b pb-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-gray-800">
                            {parsedData?.data?.result?.savedEvent?.eventName || "Event Name"}
                          </span>
                          <span className="text-lg text-green-600 font-semibold">
                            {parsedData?.data?.result?.savedEvent?.companyName || "Company Name"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-700 text-base">
                          {parsedData?.data?.result?.savedEvent?.content ||
                            "Details about the event description go here."}
                        </p>
                      </div>

                      <div className="space-y-4">

                        <div className="flex  items-center">
                          <h2 className="text-violet-700 font-semibold">Destination:</h2>
                          <p className="text-yellow-700 pl-2 ">
                            {parsedData?.data?.result?.savedEvent?.address
                              ? `${parsedData.data.result.savedEvent.address.split(' ').slice(0, 3).join(' ').replace(/,\s*$/, '')}`
                              : "Address"}
                          </p>
                        </div>

                        {/* Start Date */}
                        <div className="flex items-center">
                          <h2 className="text-violet-700 font-semibold">Start Date:</h2>
                          <p className="text-yellow-700 p;-2">
                            {parsedData?.data?.result?.savedEvent?.startDate
                              ? new Date(parsedData.data?.result?.savedEvent?.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                              : "Start Date"}
                          </p>
                        </div>

                        {/* End Date */}
                        <div className="flex  items-center">
                          <h2 className="text-violet-700 font-semibold">End Date:</h2>
                          <p className="text-yellow-700 pl-2">
                            {parsedData?.data?.result?.savedEvent?.endDate
                              ? new Date(parsedData.data?.result?.savedEvent?.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                              : "End Date"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {activeTab === "seatPlan" && (
                  <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-black">Select any of the Seat Type</h2>
                    {tickets.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {tickets.map((ticket: any) => (
                          <button
                            key={ticket.type.toUpperCase()}
                            onClick={() => setSelectedTicket(ticket)}
                            disabled={ticket.noOfSeats <= 0}
                            className={`w-full min-w-[150px] p-4 border rounded-lg transition-all duration-300 
      ${selectedTicket?.type === ticket.type
                                ? "bg-violet-700 text-white shadow-lg"
                                : ticket.noOfSeats <= 0
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-white text-gray-800 hover:bg-violet-100"
                              }`}
                          >
                            <span className="text-lg font-semibold">{ticket.type}</span>
                            <div className="text-md font-medium">₹{ticket.Amount}</div>
                            {ticket.noOfSeats <= 0 && <div className="text-red-500 text-sm">Seat Unavailable</div>}
                          </button>
                        ))}

                      </div>
                    ) : (
                      <p className="text-gray-600">No Type of seat available.</p>
                    )}

                    {/* Show Included & Not Included Features */}
                    {selectedTicket && (
                      <>
                        {console.log("Selected Ticket:", selectedTicket)}

                        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold text-black mb-2">
                            Details for {selectedTicket.type}
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Included Features */}
                            <div>
                              <h4 className="text-md font-bold text-green-600">Included</h4>
                              <ul className="list-disc pl-5 text-gray-700">
                                {selectedTicket.Included?.length > 0 ? (
                                  selectedTicket.Included.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>

                                  ))
                                ) : (
                                  <li>No inclusions available</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-md font-bold text-red-600">Not Included</h4>
                              <ul className="list-disc pl-5 text-gray-700">
                                {selectedTicket.notIncluded?.length > 0 ? (
                                  selectedTicket.notIncluded.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                  ))
                                ) : (
                                  <li>No exclusions available</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                )}
                {activeTab === "Offer-info" && (
                  <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Offer Information</h2>

                    {parsedData?.data?.result?.savedEvent?.offer ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                          <div>
                            <span className="block text-lg font-semibold text-gray-700">Offer Name:</span>
                            <span className="block text-xl text-indigo-600 font-bold">{parsedData?.data?.result?.savedEvent?.offer.offerName}</span>
                          </div>

                          <div>
                            <span className="block text-lg font-semibold text-gray-700">Discount On:</span>
                            <span className="block text-lg text-indigo-600 font-medium">{parsedData?.data?.result?.savedEvent?.offer.discount_on}</span>
                          </div>

                          <div>
                            <span className="block text-lg font-semibold text-gray-700">Discount Value:</span>
                            <span className="block text-lg text-red-600 font-medium">{parsedData?.data?.result?.savedEvent?.offer.discount_value}%</span>
                          </div>

                          <div>
                            <span className="block text-lg font-semibold text-gray-700">Start Date:</span>
                            <span className="block text-lg text-green-600 font-medium">
                              {new Date(parsedData?.data?.result?.savedEvent?.offer.startDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div>
                            <span className="block text-lg font-semibold text-gray-700">End Date:</span>
                            <span className="block text-lg text-red-600 font-medium">
                              {new Date(parsedData?.data?.result?.savedEvent?.offer.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>


                        </div>

                        <h3 className="text-xl font-bold text-gray-800">Available Ticket Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {parsedData?.data?.result?.savedEvent?.typesOfTickets?.map((ticket: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
                              <h4 className="text-lg font-semibold text-indigo-700">{ticket.type.toUpperCase()}</h4>
                              <p className="text-gray-600">Price: ₹{ticket.offerDetails.offerAmount}</p>
                              <p className="text-gray-600">Available Seat: {ticket.noOfSeats}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-lg">No active offers available.</p>
                    )}
                  </div>
                )}



              </div>
            </div>
            <div className="w-full md:w-2/4 rounded-lg shadow-md p-4 mt-4 md:mt-0">
              <div className="bg-gray-200">
                <br />
                <h1 className="text-xl font-bold mb-2 text-black text-center">
                  Book This Event
                </h1>
                <p className="text-gray-600 text-center mb-2 text-sm leading-relaxed px-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.
                </p>
                <br />
                <div className="flex justify-center items-center">
                  <input
                    type="date"
                    value={dateRange[0] ? dateRange[0].toLocaleDateString('en-CA') : ""
                    }
                    onChange={() => handleDateChange}
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
                    isHighlightedDate(date) ? "relative" : undefined
                  }
                  tileContent={({ date }) => {
                   
                    if (isHighlightedDate(date)) {
                      return (
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                      );
                    }
                    // For non-highlighted dates, just return the date number
                    // return <span className="text-black">{date.getDate()}</span>;
                  }}
                  navigationLabel={({ date }) => (
                    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg shadow-md">
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
                />
              </div>

              <br />
              <div className="bg-gray-200 p-6 rounded-lg shadow-md items-center flex justify-center">
                {selectedTicket ? (
                  <Link to={`/checkEventDetails/${parsedData.data?.result.savedEvent._id}/${selectedTicket.type.toLowerCase()}`}>
                    <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition items-center">
                      Book The Slots
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    Select a Ticket First
                  </button>
                )}
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