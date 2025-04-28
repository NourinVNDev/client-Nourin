import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { EventDetails } from "../../validations/userValid/TypeValid";
import { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails | null;
  onCancelEvent: (eventId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, event, onCancelEvent }) => {

  if (!event || !isOpen) return null;

  useEffect(() => {
    if (event) {
      console.log("Modal event data:", event);
      console.log("Modal open state:", isOpen);
    }
  }, [event, isOpen]);

  const handleCancelClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6B46C1", 
      cancelButtonColor: "#9F7AEA",
      confirmButtonText: "Yes, Cancel It!",
    }).then((result) => {
      if (result.isConfirmed) {
        onCancelEvent(event.bookingId);
        Swal.fire("Cancelled!", "Your event has been cancelled.", "success");
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
    
    >
      <ModalContent className="bg-white fixed inset p-6 rounded-xl shadow-lg border border-purple-300">
        {() => (
          <>
            <ModalHeader className="text-2xl font-bold text-gray-800 flex items-center justify-between">
              <span>Order Details</span>
              <button 
                onClick={onClose} 
                aria-label="Close modal" 
                className="text-gray-600 hover:text-purple-500 transition"
              >
                ✖
              </button>
            </ModalHeader>

            <ModalBody className="space-y-4">
              <p className="text-gray-600 text-sm">Here are the details for your order.</p>

              <div className="grid grid-cols-2 gap-4 text-gray-800">
                <p><span className="font-semibold">Booking ID:</span> {event.bookingId}</p>
                <p><span className="font-semibold">Event Name:</span> {event.eventName}</p>
                <p><span className="font-semibold">Company:</span> {event.companyName}</p>
                <p><span className="font-semibold">Package:</span> {event.title}</p>
                <p><span className="font-semibold">Persons:</span> {event.bookedUser.map((per:any)=>per.user+" ,")}</p>
                {event.title!='Virtual' && (
            <p><span className="font-semibold">Ticket Type:</span> {event.type}</p>
                )}
    
              </div>
          {event.title!='Virtual' && (
               <div className="p-3 bg-purple-100 rounded-lg shadow-md">
               <p className="text-purple-600 font-semibold flex items-center gap-2">
                 <CheckCircleIcon className="w-5 h-5 text-purple-500" />
                 Included: <span className="text-gray-800">{event.Included?.join(", ") || "N/A"}</span>
               </p>
               <p className="text-red-400 font-semibold flex items-center gap-2">
                 <XCircleIcon className="w-5 h-5 text-red-500" />
                 Not Included: <span className="text-gray-800">{event.notIncluded?.join(", ") || "N/A"}</span>
               </p>
             </div>

          )}
           

              <p className="text-xl font-bold text-purple-600 text-center">
                Total Amount: ₹{event.amount.toLocaleString()}
              </p>
            </ModalBody>

            <ModalFooter>
              <Button 
                variant="light" 
                className="w-1/2 bg-purple-500 hover:bg-purple-600 text-white" 
                onPress={onClose}
              >
                Close
              </Button>

         {event.paymentStatus.toLowerCase() !== "cancelled" && new Date(event.startDate) > new Date() && (
  <Button 
    className="w-1/2 bg-red-500 hover:bg-red-600 text-white" 
    onPress={handleCancelClick}
  >
    Cancel Event
  </Button>
)}

            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailsModal;