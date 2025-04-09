import React, { useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { Booking } from '../../pages/verifierPages/ListingBookedEvent';

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
  isOpen: boolean;
  onMarkAttendence: (index: number) => void;
}

const BookingModal: React.FC<BookingDetailsModalProps> = ({ booking, isOpen, onClose, onMarkAttendence }) => {
  if (!isOpen || !booking) return null;
    useEffect(()=>{
        console.log("Booking data in Modal:",booking);
        

    },[booking])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-black">Booking Details</h2>

        <div className="pb-4 mb-4 text-black border-b">
          <p className="mb-2"><span className="font-medium">Booking ID:</span> {booking.bookingId}</p>
          <p className="mb-2"><span className="font-medium">Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p className="mb-2"><span className="font-medium">Billing Name:</span> {booking.billingDetails.firstName} {booking.billingDetails.lastName}</p>
          <p className="mb-2"><span className="font-medium">No. of Persons:</span> {booking.NoOfPerson}</p>
          <p className="mb-2"><span className="font-medium">Phone:</span> {booking.billingDetails.phoneNo}</p>
          <p className="mb-2"><span className="font-medium">Total Amount:</span> ₹{booking.totalAmount}</p>
          <p className="mb-2"><span className="font-medium">Seat:</span> {booking.ticketDetails.type}</p>
        </div>

        <h3 className="mb-3 text-lg font-bold text-green-600">Participants</h3>

        {booking.bookedUser?.length ? (
          <ul className="space-y-3 mb-6">
            {booking.bookedUser.map((user, index) => (
              <li key={index} className="flex items-center justify-between pb-2 border-b text-black">
                <span>
                  {user.user} -&nbsp;
                  <span className={user.isParticipated ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {user.isParticipated ? "Present" : "Absent"}
                  </span>
                </span>
                <Button
                  size="sm"
                  className="bg-black text-white"
                  color={user.isParticipated ? "danger" : "success"}
                  onPress={() => onMarkAttendence(index)}
                >
                  {user.isParticipated ? "Mark Absent" : "Mark Present"}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-6 text-sm text-gray-500">No participants found</p>
        )}

        <div className="flex justify-end">
          <Button className="bg-red-500" onPress={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
