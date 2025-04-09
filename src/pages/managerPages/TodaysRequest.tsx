import { Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTodaysBooking } from "../../service/managerServices/userBookingService";
import { BookingData } from "../../validations/managerValid/RegisterValid";
import Footer from "../../components/managerComponents/Footer";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";

const TodaysRequest = () => {
    const managerId=useSelector((state:RootState)=>state.manager._id);
    const [bookings, setBookings] = useState<BookingData[]>([]);

    useEffect(() => {
        const fetchTodaysBookingDetails = async () => {
            if(managerId){
            const result = await fetchTodaysBooking(managerId);
            
            if (result && result.message=="Manager's today's bookings retrieved successfully") {
                setBookings(result.data);
                console.log("Safe", result.data);
            }

        }
        };

        fetchTodaysBookingDetails();
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header />
            <div className="flex flex-1 w-full">
                {/* Navigation Bar */}
                <NavBar />
                <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Today's Bookings</h2>
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
                                                <span>
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mt-2">Email: {booking.billingDetails.email}</p>
                                        <p className="text-gray-600">Phone: {booking.billingDetails.phoneNo}</p>
                                        <p className="text-gray-600">Event Name: {booking.eventId.eventName}</p>
                                        <p className="text-gray-600">Event Name: {booking.paymentStatus==='Confirmed'?<span className="text-green-500">Confirmed</span>:<span className="text-red-500">Cancelled</span>}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-lg font-bold text-green-600">₹{booking.totalAmount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                            <p className="text-gray-600">No bookings found for today.</p>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default TodaysRequest;