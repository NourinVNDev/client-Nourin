import { useEffect, useState } from "react";
import { BookingData } from "../../validations/managerValid/RegisterValid";
import { fetchTotalBooking } from "../../service/managerServices/userBookingService";
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import NavBar from "../../components/managerComponents/NavBar";
import { Calendar, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
const TotalBooking = () => {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const managerId = useSelector((state: RootState) => state.manager._id);
        const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    useEffect(() => {
        const fetchTotalBookingDetails = async () => {
            if (managerId) {
                const result = await fetchTotalBooking(managerId);

                if (result.message === "Manager's bookings retrieved successfully") {
                    
                    console.log("Safe", result.data);
                    const sortedData=result.data.sort((a:any,b:any)=>{
                        const dateA=new Date(a.updatedAt);
                        const dateB=new Date(b.updatedAt);
                        return dateB.getTime()-dateA.getTime();
                    })
                    setBookings(sortedData);

                }

            }

        };

        fetchTotalBookingDetails();
    }, []);
        const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = bookings.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPages = bookings ? Math.ceil(bookings.length / itemsPerPage) : 1;

    
    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
        <Header />
        <div className="flex flex-1 w-full">
            <NavBar />
            <main className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-4xl font-bold mb-8 text-blue-800">Total Bookings</h2>

                {currentTransactions.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {currentTransactions.map((booking, index) => (
                                <div key={index} className="bg-white border border-gray-200 hover:shadow-2xl transition-shadow duration-300 rounded-xl p-6 w-full">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                        {booking.billingDetails.firstName} {booking.billingDetails.lastName}
                                    </h3>

                                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                            <Users className="w-4 h-4" />
                                            <span>{booking.NoOfPerson} Person</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(booking.bookingDate).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-1 text-gray-700 text-sm">
                                        <p><span className="font-semibold">Email:</span> {booking.billingDetails.email}</p>
                                        <p><span className="font-semibold">Phone:</span> {booking.billingDetails.phoneNo}</p>
                                        <p><span className="font-semibold">Event:</span> {booking.eventId.eventName}</p>
                                        <p>
                                            <span className="font-semibold">Status:</span>{" "}
                                            {booking.paymentStatus === "Completed" ? (
                                                <span className="inline-block bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold">Confirmed</span>
                                            ) : (
                                                <span className="inline-block bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold">Cancelled</span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-5">
                                        <span className="text-xl font-bold text-blue-600">₹{booking.totalAmount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-10 space-x-6">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold disabled:opacity-50 transition"
                            >
                                Prev
                            </button>
                            <span className="text-gray-800 font-medium self-center">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold disabled:opacity-50 transition"
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-lg mx-auto">
                        <p className="text-gray-600 text-lg">No bookings found.</p>
                    </div>
                )}
            </main>
        </div>
        <Footer />
    </div>
);


}
export default TotalBooking;