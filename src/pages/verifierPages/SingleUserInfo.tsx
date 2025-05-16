import { fetchSingleUserData, markUserEntry } from "../../service/verifierServices/verifierLogin";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../../components/verifierComponents/Footer";
import Header from "../../components/verifierComponents/Header";
import BookingModal from "../../components/verifierComponents/BookingModal";
import { Button } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";

export interface Booking {
    bookingId: string;
    bookingDate: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    noOfPerson: number;
    totalAmount: number
    user: string;
    isParticipated: boolean;
    _id?: string;
    eventId?: string;
    ticketDetails?: any;
}

const SingleUserInfo = () => {
    const { eventId, bookedId, userName } = useParams();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const email=useSelector((state:RootState)=>state.verifier.email);

    useEffect(() => {
        const fetchBookedUserDetails = async () => {
            if (bookedId && userName) {
                const result = await fetchSingleUserData(bookedId, userName);
                setBooking(result.data);
            }
        };
        fetchBookedUserDetails();
    }, [bookedId, userName]);

 const handleMarkAttendance = async () => {
    if (!booking) return;

    const updatedStatus = !booking.isParticipated;

    setBooking({
        ...booking,
        isParticipated: updatedStatus
    });

    try {
        console.log("Cant",booking.bookingId);
        
                const result = await markUserEntry(booking.bookingId, booking.user);
                console.log("");
                
        if (!result.success) {
            toast.error(result.message || "Failed to update attendance.");
            setBooking({
                ...booking,
                isParticipated: !updatedStatus // revert change
            });
        } else {
            toast.success(`Attendance updated for ${booking.firstName}.`);
           setBooking({
            ...booking,
            isParticipated:updatedStatus
           })
           navigate(`/verifier/listAllEvents/${email}`)
        }

        
    
    } catch (error) {
        console.error("Error updating attendance:", error);
        toast.error("Something went wrong while updating attendance.");
    }
};


    const handleShowModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBooking(null);
        navigate(`/verifier/bookedEventDetails/${eventId}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 w-full">
            <Header />
            <Toaster />
            <div className="w-full p-6">
                <h2 className="text-center text-xl text-gray-700 mb-4 font-bold">
                    User Booking Information
                </h2>

                {booking ? (
                    <div className="w-full overflow-hidden text-black">
                        <table className="w-full min-w-max table-auto border border-gray-300 shadow-lg bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-6 py-3 text-left">Booking ID</th>
                                    <th className="border px-6 py-3 text-left">Booking Date</th>
                                    <th className="border px-6 py-3 text-left">Name</th>
                                    <th className="border px-6 py-3 text-left">No. of Person</th>
                                    <th className="border px-6 py-3 text-left">Phone</th>
                                    <th className="border px-6 py-3">Total Amount</th>
                                    <th className="border px-6 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b text-gray-800 hover:bg-gray-50">
                                    <td className="border px-6 py-4 font-bold">{booking.bookingId}</td>
                                    <td className="border px-6 py-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    <td className="border px-6 py-4">
                                        {booking.firstName} {booking.lastName}
                                    </td>
                                    <td className="border px-6 py-4">{booking.noOfPerson}</td>
                                    <td className="border px-6 py-4">{booking.phoneNo}</td>
                                    <td className="border px-6 py-4">₹{booking.totalAmount}</td>
                                    <td className="border px-6 py-4 text-center bg-white">
                                        <Button
                                            onPress={handleShowModal}
                                            className="bg-gradient-to-r from-indigo-500 to-purple-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                                            size="sm"
                                            radius="lg"
                                        >
                                            Show More
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-gray-500 text-lg">Loading booking details...</div>
                )}
            </div>
            <BookingModal
                booking={booking}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onMarkAttendence={handleMarkAttendance}
            />
            <Footer />
        </div>
    );
};

export default SingleUserInfo;
