import { useEffect,useState } from "react";
import { BookingData } from "../../validations/managerValid/RegisterValid";
import { fetchTotalBooking } from "../../service/managerServices/userBookingService";
import Header from "../../components/managerComponents/Header";
import Footer from "../../components/managerComponents/Footer";
import NavBar from "../../components/managerComponents/NavBar";
import { Calendar, Users } from "lucide-react";
const TotalBooking=()=>{
        const [bookings, setBookings] = useState<BookingData[]>([]);
    useEffect(() => {
        const fetchTotalBookingDetails = async () => {
            const result = await fetchTotalBooking();
            
            if (result.message === "Bookings retrieved successfully") {
                setBookings(result.data);
                console.log("Safe", result.data);
            }
        };

        fetchTotalBookingDetails();
    }, []);
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header />
            <div className="flex flex-1 w-full">
                {/* Navigation Bar */}
                <NavBar />
                <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Total Bookings</h2>
                    {bookings.length > 0 ? (
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"> {/* Centered grid with max width */}
                                {bookings.map((booking, index) => (
                                    <div key={index} className="bg-white shadow-lg rounded-lg p-6 w-full md:w-80 lg:w-96"> {/* Set specific widths for different screen sizes */}
                                        <h3 className="text-xl font-semibold text-gray-700">
                                            {booking.billingDetails.firstName} {booking.billingDetails.lastName}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                                <Users className="w-4 h-4" />
                                                <span>{booking.NoOfPerson} Person</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mt-2">Email: {booking.billingDetails.email}</p>
                                        <p className="text-gray-600">Phone: {booking.billingDetails.phoneNo}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-lg font-bold text-green-600">₹{booking.totalAmount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                            <p className="text-gray-600">No bookings found.</p>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );

}
export  default TotalBooking;