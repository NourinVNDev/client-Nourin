
import QRScanner from "../../components/verifierComponents/QRCode";

export interface Booking {
    bookingId: string;
    bookingDate: string;
    billingDetails: {
        firstName: string;
        lastName: string;
        phoneNo: string;
    };
    NoOfPerson: number;
    totalAmount: number;
    bookedUser: {
        user: string;
        isParticipated: boolean;
    }[];
    _id?: string;
    eventId?: string;
    ticketDetails?: any;
}

const ListingBookedEvent = () => {
 
// const bookingsPerPage = 5;

//     useEffect(() => {
//         const fetchingEventBooking = async () => {
//             try {
//                 if (eventId) {
//                     const result = await fetchAllBooking(eventId);
//                     if (result.success && Array.isArray(result.data)) {
//                         setBookings(result.data);
//                     } else {
//                         toast.error("No bookings available for this event.");
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//                 toast.error("Failed to fetch bookings. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchingEventBooking();
//     }, [eventId]);
//     useEffect(() => {
//         console.log("Booked Data:", bookings);


//     }, [bookings])

//     const filteredBookings = useMemo(() => {
//         if (!searchQuery) return bookings;
//         return bookings.filter(booking => booking.bookingId.endsWith(searchQuery));
//     }, [bookings, searchQuery]);
//     const indexOfLastBooking = currentPage * bookingsPerPage;
// const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
// const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
// const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
// const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//         setCurrentPage(page);
//     }
// };

//     const handleMarkAttendance = async (index: number) => {
//         if (!selectedBooking) return;

//         const updatedUser = {
//             user: selectedBooking.bookedUser[index].user,
//             isParticipated: !selectedBooking.bookedUser[index].isParticipated
//         };

//         const updatedBookedUsers = [...selectedBooking.bookedUser];
//         updatedBookedUsers[index] = updatedUser;

//         setSelectedBooking({
//             ...selectedBooking,
//             bookedUser: updatedBookedUsers
//         });

//         try {
//             const result = await markUserEntry(selectedBooking.bookingId,selectedBooking.bookedUser[index].user);
//             if (!result.success) {
//                 toast.error(result.message || "Failed to update attendance.");
//                 updatedBookedUsers[index].isParticipated = !updatedBookedUsers[index].isParticipated;
//                 setSelectedBooking({
//                     ...selectedBooking,
//                     bookedUser: updatedBookedUsers
//                 });
//             } else {
//                 toast.success(`Attendance updated for ${updatedUser.user}.`);
//                 navigate(`/verifier/bookedEventDetails/${eventId}`)
//             }
//         } catch (error) {
//             console.error("Error updating attendance:", error);
//             toast.error("Something went wrong while updating attendance.");
//             updatedBookedUsers[index].isParticipated = !updatedBookedUsers[index].isParticipated;
//             setSelectedBooking({
//                 ...selectedBooking,
//                 bookedUser: updatedBookedUsers
//             });
//         }
//     };

//     const handleShowModal = (booking: Booking) => {
//         setSelectedBooking(booking);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         navigate(`/verifier/bookedEventDetails/${eventId}`)
//         setIsModalOpen(false);
//         setSelectedBooking(null);
      
//     };

//     useEffect(() => {
//         setCurrentPage(1);
//       }, [searchQuery]);
//     return (
//         <div className="min-h-screen flex flex-col bg-gray-100 w-full">
//             <Header />
//             <Toaster />
//             <div className="w-full p-6">
//                 <h2 className="text-center text-xl text-gray-700 mb-4 font-bold">
//                     Booked User List
//                 </h2>
//                 <div className="relative w-full max-w-sm mx-auto mb-4">
//                     <input
//                         type="text"
//                         placeholder="Search by last 3 digits of Booking ID"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full border bg-white border-gray-300 p-3 rounded-lg pl-10 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     />
//                     <span className="absolute left-3 top-3 text-gray-500">
//                         🔍
//                     </span>
//                 </div>

//                 {loading ? (
//                     <div className="text-gray-500 text-lg">Loading bookings...</div>
//                 ) : currentBookings.length === 0 ? (
//                     <div className="text-center text-gray-500 text-lg">
//                         <p>No bookings available</p>
//                     </div>
//                 ) : (
//                     <div className="w-full overflow-hidden text-black">
//                         <div className="overflow-auto max-h-96 scroll-smooth">
//                             <table className="w-full min-w-max table-auto border border-gray-300 shadow-lg bg-white">
//                                 <thead className="bg-gray-200">
//                                     <tr>
//                                         <th className="border px-6 py-3 text-left">Booking ID</th>
//                                         <th className="border px-6 py-3 text-left">Booking Date</th>
//                                         <th className="border px-6 py-3 text-left">Name</th>
//                                         <th className="border px-6 py-3 text-left">No. of Person</th>
//                                         <th className="border px-6 py-3 text-left">Phone</th>
//                                         <th className="border px-6 py-3">Total Amount</th>
//                                         <th className="border px-6 py-3"></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {currentBookings.map((booking) => (
//                                         <tr key={booking.bookingId} className="border-b text-gray-800 hover:bg-gray-50">
//                                             <td className="border px-6 py-4 font-bold">{booking.bookingId}</td>
//                                             <td className="border px-6 py-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
//                                             <td className="border px-6 py-4">
//                                                 {booking.billingDetails?.firstName} {booking.billingDetails?.lastName}
//                                             </td>
//                                             <td className="border px-6 py-4">{booking.NoOfPerson}</td>
//                                             <td className="border px-6 py-4">{booking.billingDetails?.phoneNo}</td>
//                                             <td className="border px-6 py-4">₹{booking.totalAmount}</td>
//                                             <td className="border px-6 py-4 text-center bg-white">
//                                                 <Button
//                                                     onPress={() => handleShowModal(booking)}
//                                                     className="bg-gradient-to-r from-indigo-500 to-purple-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
//                                                     size="sm"
//                                                     radius="lg"
//                                                 >
//                                                     Show More
//                                                 </Button>
//                                             </td>

//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="flex justify-center mt-4">
//                                         <button
//                                             onClick={() => handlePageChange(currentPage - 1)}
//                                             disabled={currentPage === 1}
//                                             className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
//                                         >
//                                             Prev
//                                         </button>
//                                         <span className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
//                                             Page {currentPage} of {totalPages}
//                                         </span>
//                                         <button
//                                             onClick={() => handlePageChange(currentPage + 1)}
//                                             disabled={currentPage === totalPages}
//                                             className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2"
//                                         >
//                                             Next
//                                         </button>
//                                     </div>

//                         </div>
//                     </div>
//                 )}
//             </div>
//             <BookingModal
//                 booking={selectedBooking}
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 onMarkAttendence={handleMarkAttendance}
//             />
//             <Footer />
//         </div>
//     );
return(
    <QRScanner/>
)
};




export default ListingBookedEvent;