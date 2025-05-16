import React, { useEffect } from 'react';
import { Button } from "@nextui-org/react";

export interface Booking {
    bookingId: string;
    bookingDate: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    noOfPerson: number;
    totalAmount: number;
    user: string;
    isParticipated: boolean;
    _id?: string;
    eventId?: string;
    ticketDetails?: any;
}

interface BookingDetailsModalProps {
    booking: Booking | null;
    onClose: () => void;
    isOpen: boolean;
    onMarkAttendence: () => void;
}

const BookingModal: React.FC<BookingDetailsModalProps> = ({ booking, isOpen, onClose, onMarkAttendence }) => {
    if (!isOpen || !booking) return null;

    useEffect(() => {
        console.log("Booking data in Modal:", booking);
    }, [booking]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-black">Booking Details</h2>

                <div className="pb-4 mb-4 text-black border-b">
                    <p className="mb-2"><span className="font-medium">Booking ID:</span> {booking.bookingId}</p>
                    <p className="mb-2"><span className="font-medium">Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p className="mb-2"><span className="font-medium">Billing Name:</span> {booking.firstName} {booking.lastName}</p>
                    <p className="mb-2"><span className="font-medium">No. of Persons:</span> {booking.noOfPerson}</p>
                    <p className="mb-2"><span className="font-medium">Phone:</span> {booking.phoneNo}</p>
                    <p className="mb-2"><span className="font-medium">Total Amount:</span> ₹{booking.totalAmount}</p>
                    <p className="mb-2"><span className="font-medium">Seat:</span> {booking.ticketDetails?.type}</p>
                </div>

                <h3 className="mb-3 text-lg font-bold text-green-600">Participant</h3>

                <div className="flex items-center justify-between mb-6 text-black border-b pb-2">
                    <span>
                        {booking.user} -&nbsp;
                        <span className={booking.isParticipated ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {booking.isParticipated ? "Present" : "Absent"}
                        </span>
                    </span>
                    <Button
                        size="sm"
                        className="bg-black text-white"
                        color={booking.isParticipated ? "danger" : "success"}
                        onPress={onMarkAttendence}
                    >
                        {booking.isParticipated ? "Mark Absent" : "Mark Present"}
                    </Button>
                </div>

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
