import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/userComponents/Headers";
import SocialEvents1 from "../../assets/SocialEvents1.avif";
import Footer from "../../components/userComponents/Footer";
import { DayPicker,DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Link } from "react-router-dom";
import { format } from 'date-fns';

const SinglePostDetails = () => {
  const location = useLocation();
  const data = location.state?.data;
  console.log("Data for checking react", data)
  if (!data) {
  return <div>Loading event details...</div>;
}
const parsedData = data;
console.log("ParsedData:", parsedData);
  const generalTicketAmount =
    parsedData?.data?.result?.singleEvent?.typesOfTickets?.find(
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
  console.log("Date:",parsedData?.data?.result?.singleEvent);
  
  const [selectedTicket, setSelectedTicket] = useState<selectTicket>();

  

  const tickets = (parsedData?.data?.result?.singleEvent?.typesOfTickets || [])
    .map((ticket: any) => ({
      ...ticket,
      type: ticket.type.toUpperCase(),
    }))


  const initialStartDate = parsedData?.data?.result?.singleEvent?.startDate
    ? new Date(parsedData.data?.result?.singleEvent?.startDate)
    : new Date();
  const initialEndDate = parsedData?.data?.result?.savedEvent?.endDate
    ? new Date(parsedData.data?.result?.savedEvent?.endDate)
    : new Date();
const [dateRange, setDateRange] = useState<DateRange>({
  from: initialStartDate,
  to: initialEndDate
});
  const [activeTab, setActiveTab] = useState("information");

const customStyles = `
  /* Base calendar styles */
  .rdp {
    --rdp-cell-size: 42px;
    --rdp-accent-color: #8b5cf6;
    --rdp-background-color: #ede9fe;
    --rdp-outside-color: #6b7280;  /* Changed to darker gray */
    --rdp-disabled-color: #e2e8f0;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }

  /* Day cells - ALL dates black by default */
  .rdp-day {
    border-radius: 8px;
    transition: all 0.2s ease;
    font-weight: 500;
    color: #000000 !important;  /* Force black text for all dates */
  }


  .rdp-day_selected:not(.rdp-day_disabled):not(.rdp-day_outside) {
    background-color: var(--rdp-accent-color);
    color: white !important;  /* White text for selected dates */
    font-weight: 600;
  }

  /* First and last day of range */
  .rdp-day_range_start:not(.rdp-day_outside),
  .rdp-day_range_end:not(.rdp-day_outside) {
    background-color: var(--rdp-accent-color);
    color: white !important;
  }

  /* Days in between selected range */
  .rdp-day_range_middle {
    background-color: var(--rdp-background-color);
    color: var(--rdp-accent-color) !important;
  }

  /* Today's date */
  .rdp-day_today {
    font-weight: 700;
    color: var(--rdp-accent-color) !important;
  }

  .rdp-day_today:not(.rdp-day_selected)::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--rdp-accent-color);
  }

  /* Days from other months - now visible in dark gray */
  .rdp-day_outside {
    color: var(--rdp-outside-color) !important;
    opacity: 1;  /* Make fully visible */
  }

  /* Disabled dates */
  .rdp-day_disabled {
    color: var(--rdp-disabled-color) !important;
  }

  /* Hover effects - subtle change */
  .rdp-day:not(.rdp-day_disabled):not(.rdp-day_selected):hover {
   background-color: #f3f4f6;
  }

  /* Rest of your styles remain the same */
  .rdp-caption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px 12px;
  }
  .rdp-caption_label {
    font-weight: 600;
    color: #1e293b;
    font-size: 1.1rem;
  }

  .rdp-nav {
    display: flex;
    gap: 8px;
  }

  .rdp-nav_button {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .rdp-nav_button:hover {
    background-color: #f1f5f9;
  }

  .rdp-head_cell {
    font-weight: 600;
    color: #64748b;
    font-size: 0.9rem;
    text-transform: uppercase;
    padding-bottom: 8px;
  }
  .rdp-day {
    color: #000 !important;
    pointer-events: none !important;
    cursor: default !important;
  }`;

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
                {parsedData.data.result.savedEvent.title!='Virtual' &&<button
                  className={`text-lg font-semibold px-4 py-2 rounded ${activeTab === "seatPlan"
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("seatPlan")}
                >
                  Seat Plans
                </button>}
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
                          <div className="flex items-center justify-between  gap-44 flex-nowrap w-full">
                            <span className="text-2xl font-bold text-gray-800">
                              {parsedData?.data?.result?.savedEvent?.eventName || "Event Name"}
                            </span>
                            <Link
                              to={`/user/chat/${parsedData?.data?.result?.savedEvent?.companyName}/${parsedData?.data?.result?.savedEvent.eventName}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Chat with us
                            </Link>
                          </div>
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
                              : "Virtual"}
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

    {(parsedData?.data?.result?.savedEvent?.managerOffer || parsedData?.data?.result?.savedEvent?.adminOffer) ? (
      <div className="space-y-6">

        {/* Manager Offer */}
        {parsedData?.data?.result?.savedEvent?.managerOffer && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
            <h3 className="col-span-2 text-xl font-semibold text-purple-700">Manager Offer</h3>
            <div>
              <span className="block font-semibold text-gray-700">Offer Name:</span>
              <span className="block text-indigo-600 font-bold">{parsedData.data.result.savedEvent.managerOffer.offerName}</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">Discount On:</span>
              <span className="block text-indigo-600">{parsedData.data.result.savedEvent.managerOffer.discount_on}</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">Discount Value:</span>
              <span className="block text-red-600">{parsedData.data.result.savedEvent.managerOffer.discount_value}%</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">Start Date:</span>
              <span className="block text-green-600">
                {new Date(parsedData.data.result.savedEvent.managerOffer.startDate).toLocaleDateString("en-US")}
              </span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">End Date:</span>
              <span className="block text-red-600">
                {new Date(parsedData.data.result.savedEvent.managerOffer.endDate).toLocaleDateString("en-US")}
              </span>
            </div>
          </div>
        )}

        {/* Admin Offer */}
        {parsedData?.data?.result?.savedEvent?.adminOffer && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
            <h3 className="col-span-2 text-xl font-semibold text-red-700">Admin Offer</h3>
            <div>
              <span className="block font-semibold text-gray-700">Offer Name:</span>
              <span className="block text-indigo-600 font-bold">{parsedData.data.result.savedEvent.adminOffer.offerName}</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">Discount On:</span>
              <span className="block text-indigo-600">{parsedData.data.result.savedEvent.adminOffer.discount_on}</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">Discount Value:</span>
              <span className="block text-red-600">{parsedData.data.result.savedEvent.adminOffer.discount_value}%</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">Start Date:</span>
              <span className="block text-green-600">
                {new Date(parsedData.data.result.savedEvent.adminOffer.startDate).toLocaleDateString("en-US")}
              </span>
            </div>
            <div>
              <span className="block font-semibold text-gray-700">End Date:</span>
              <span className="block text-red-600">
                {new Date(parsedData.data.result.savedEvent.adminOffer.endDate).toLocaleDateString("en-US")}
              </span>
            </div>
          </div>
        )}

        {/* Ticket Types */}
        <h3 className="text-xl font-bold text-gray-800">Available Ticket Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {parsedData?.data?.result?.savedEvent?.typesOfTickets?.map((ticket: any, index: number) => {
  const managerDiscount = Number(parsedData?.data?.result?.savedEvent?.managerOffer?.discount_value || 0);
  const adminDiscount = Number(parsedData?.data?.result?.savedEvent?.adminOffer?.discount_value || 0);
 

  const totalDiscount = Math.min(managerDiscount + adminDiscount, 100); // cap at 100%
  const discountedPrice = Math.floor(ticket.Amount * (1 - totalDiscount / 100));

  return (
    <div key={index} className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold text-indigo-700">{ticket.type.toUpperCase()}</h4>
      <p className="text-gray-600">
        Original Price: <span className="line-through text-red-500">₹{ticket.Amount}</span><br />
        Discounted Price: <span className="text-green-600 font-semibold">
          {discountedPrice === 0 ? "Free Ticket" : `₹${discountedPrice}`}
        </span>
      </p>
      <p className="text-gray-600">Available Seat: {ticket.noOfSeats}</p>
    </div>
  );
})}

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
  type="text"
  value={`${dateRange.from ? format(dateRange.from, 'MM/dd/yyyy') : ''} ${
    dateRange.to ? `- ${format(dateRange.to, 'MM/dd/yyyy')}` : ''}`}
  readOnly
  className="px-4 py-2 border rounded-lg text-gray-700 bg-white w-3/5 focus:outline-none focus:ring-2 focus:ring-purple-700 text-center"
/>
                </div>
                <br /><br />
              </div>



<div className="p-6 bg-white rounded-lg shadow-md">
  <style>{customStyles}</style>
  <DayPicker
    mode="range"
    selected={dateRange}
    onSelect={(range) => setDateRange(range || { from: new Date(), to: new Date() })}
    modifiers={{
      selected: dateRange,
      today: new Date()
    }}
    modifiersClassNames={{
      selected: 'my-selected',
      today: 'my-today'
    }}
    showOutsideDays  // This shows days from previous/next months
    fixedWeeks       // Always shows 6 weeks (42 days)
    numberOfMonths={1}
    captionLayout="dropdown"
    fromYear={new Date().getFullYear()}
    toYear={new Date().getFullYear() + 2}
    classNames={{
      months: 'w-full',
      month: 'w-full',
      table: 'w-full',
      head_row: 'w-full',
      head_cell: 'w-10 h-10',
      row: 'w-full',
      cell: 'w-10 h-10',
    }}
  />
</div>


              <br />
              <div className="bg-gray-200 p-6 rounded-lg shadow-md flex justify-center items-center">
                {selectedTicket || (parsedData.data?.result?.savedEvent?.title == 'Virtual' && selectedTicket !== null) ? (
                  <Link
                    to={`/checkEventDetails/${parsedData.data?.result?.savedEvent?._id}/${selectedTicket?.type?.toLowerCase()}`}
                    className="w-full" // Make link take full width
                  >
                    <button className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 w-full">
                      Book The Slots
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed w-full"
                  >
                    {parsedData.data?.result?.savedEvent?.title === 'Virtual' ?
                      "Select a Ticket First" :
                      "Select a Ticket Type First"}
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