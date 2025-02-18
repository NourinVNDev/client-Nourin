import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useEffect } from "react";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, bookingId }) => {
    useEffect(() => {
        console.log("Data", bookingId);
    }, [bookingId]);

    if (!isOpen) return null; // Early return if the modal is not open

    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent className="bg-gray-800 p-4 rounded-lg">
            <ModalHeader className="text-xl font-semibold text-white">Order Details</ModalHeader>
            <ModalBody>
                <p className="text-gray-400">Here are the details for your order.</p>
                <p className="text-white mt-2">Booking ID: <span className="font-bold">{bookingId}</span></p>
                {/* You can add more details about the order here */}
            </ModalBody>
            <ModalFooter>
                <Button variant="light" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    );
};

export default OrderDetailsModal;