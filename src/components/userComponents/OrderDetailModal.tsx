import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { EventDetails } from "../../validations/userValid/TypeValid";
import { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import Swal from "sweetalert2";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails | null;
  onCancelEvent: (eventId: string) => void; // Function to handle event cancellation
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, event, onCancelEvent }) => {
  if (!isOpen || !event) return null;

  useEffect(() => {
    console.log("yes", event.notIncluded);
  }, [event]);

  const handleCancelClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you Want to Cancel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancell It!",
    }).then((result) => {
      if (result.isConfirmed) {
        onCancelEvent(event.bookingId); // Call the cancellation function
        Swal.fire("Cancelled!", "Your event seat has been cancelled.", "success");
      }
    });
  };

  return (
    <div>
   
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
        <ModalHeader className="text-2xl font-bold text-white flex items-center justify-between">
          <span>Order Details</span>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            ✖
          </button>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <p className="text-gray-400 text-sm">Here are the details for your order.</p>

          <div className="grid grid-cols-2 gap-4 text-white">
            <p>
              <span className="font-semibold">Booking ID:</span> {event.bookingId}
            </p>
            <p>
              <span className="font-semibold">Event Name:</span> {event.eventName}
            </p>
            <p>
              <span className="font-semibold">Company:</span> {event.companyName}
            </p>
            <p>
              <span className="font-semibold">Package:</span> {event.title}
            </p>
            <p>
              <span className="font-semibold">Persons:</span> {event.noOfPerson}
            </p>
            <p>
              <span className="font-semibold">Ticket Type:</span> {event.type}
            </p>
          </div>

          <div className="p-3 bg-gray-800 rounded-lg shadow-md">
            <p className="text-green-400 font-semibold flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              Included: <span className="text-white">{event.Included.join(", ")}</span>
            </p>
            <p className="text-red-400 font-semibold flex items-center gap-2">
              <XCircleIcon className="w-5 h-5 text-red-500" />
              Not Included: <span className="text-white">{event.notIncluded.join(", ")}</span>
            </p>
          </div>

          <p className="text-xl font-bold text-orange-400 text-center">
            Total Amount: ₹{event.amount.toLocaleString()}
          </p>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <Button variant="light" className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white" onClick={onClose}>
            Close
          </Button>
          <Button variant="light" className="w-1/2 bg-red-600 hover:bg-red-700 text-white" onClick={handleCancelClick}>
            Cancel Event 
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </div>
  );
};

export default OrderDetailsModal;
