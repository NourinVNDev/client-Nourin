import { useEffect, useState, useMemo } from "react";
import { fetchAllBooking, markUserEntry } from "../../service/verifierServices/verifierLogin";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../../components/verifierComponents/Footer";
import Header from "../../components/verifierComponents/Header";

interface Booking {
    bookingId: string;
    bookingDate: string;
    billingDetails: {
        firstName: string;
        lastName: string;
        phoneNo: string;
    };
    NoOfPerson: number;
    totalAmount: number;
    isParticipated: boolean;
}

const ListingBookedEvent = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchingEventBooking = async () => {
            try {
                if (eventId) {
                    const result = await fetchAllBooking(eventId);
                    console.log("Fetched bookings:", result); // Debugging
                    if (result.success && Array.isArray(result.data)) {
                        setBookings(result.data);
                    } else {
                        toast.error("No bookings available for this event.");
                    }
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast.error("Failed to fetch bookings. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchingEventBooking();
    }, [eventId]);
    

    const filteredBookings = useMemo(() => {
        if (!searchQuery) return bookings;
        return bookings.filter(booking => booking.bookingId.endsWith(searchQuery));
    }, [bookings, searchQuery]);
    

    const handleCheckboxChange = async (bookingId: string) => {
        setBookings(prevBookings =>
            prevBookings.map(booking =>
                booking.bookingId === bookingId
                    ? { ...booking, isParticipated: !booking.isParticipated }
                    : booking
            )
        );
    
        try {
            const result = await markUserEntry(bookingId);
            if (!result.success) {
                toast.error(result.message || "Failed to update participation.");
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.bookingId === bookingId
                            ? { ...booking, isParticipated: !booking.isParticipated } // Revert change
                            : booking
                    )
                );
            } else {
                toast.success(
                    result.data.isParticipated
                        ? `User ${bookingId} has entered the auditorium.`
                        : `User ${bookingId} was removed from the auditorium.`
                );
            }
        } catch (error) {
            console.error("Error updating entry:", error);
            toast.error("Something went wrong!");
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.bookingId === bookingId
                        ? { ...booking, isParticipated: !booking.isParticipated } // Revert change
                        : booking
                )
            );
        }
    };
    

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 w-full">
            <Header />
            <Toaster />
            <div className="w-full p-6">
                <h2 className="text-center text-xl text-gray-700 mb-4 font-bold">
                    Booked Event List
                </h2>
                <div className="relative w-full max-w-sm mx-auto mb-4">
                <input
                    type="text"
                    placeholder=" Search by last 3 digits of Booking ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border bg-white border-gray-300 p-3 rounded-lg pl-10 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <span className="absolute left-3 top-3 text-gray-500">
                    🔍
                </span>
            </div>


                {loading ? (
                    <div className="text-gray-500 text-lg">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg">
                        <p>No bookings available</p>
                    </div>
                ) : (
                    <div className="w-full overflow-hidden text-black">
                        <div className="overflow-auto max-h-96 scroll-smooth">
                            <table className="w-full min-w-max table-auto border border-gray-300 shadow-lg bg-white">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border px-6 py-3 text-left">Booking ID</th>
                                        <th className="border px-6 py-3 text-left">Booking Date</th>
                                        <th className="border px-6 py-3 text-left">Name</th>
                                        <th className="border px-6 py-3 text-left">No. of Person</th>
                                        <th className="border px-6 py-3 text-left">Phone</th>
                                        <th className="border px-6 py-3">Total Amount</th>
                                        <th className="border px-6 py-3">Mark Entry</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.bookingId} className="border-b text-gray-800 hover:bg-gray-50">
                                            <td className="border px-6 py-4 font-bold">{booking.bookingId}</td>
                                            <td className="border px-6 py-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                            <td className="border px-6 py-4">
                                                {booking.billingDetails?.firstName} {booking.billingDetails?.lastName}
                                            </td>
                                            <td className="border px-6 py-4">{booking.NoOfPerson}</td>
                                            <td className="border px-6 py-4">{booking.billingDetails?.phoneNo}</td>
                                            <td className="border px-6 py-4">₹{booking.totalAmount}</td>
                                            <td className="border px-6 py-4 text-center bg-white">
                                            <input
                                            type="checkbox"
                                            checked={booking.isParticipated}
                                            onChange={() => handleCheckboxChange(booking.bookingId)}
                                       
                                            className="w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                        />

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ListingBookedEvent;