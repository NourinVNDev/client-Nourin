import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { FaStar } from "react-icons/fa";
import { useState,useEffect } from "react";
import { EventReviewAndRating } from "../../service/userServices/userProfile";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingReview: {
    review: string;
    rating: number;
  };
  eventId: string;
  userId: string;
}

const ReviewModal = ({
  isOpen,
  onClose,
  existingReview,
  eventId,
  userId,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(existingReview.rating);
  const [review, setReview] = useState(existingReview.review);

  useEffect(() => {
    setRating(existingReview.rating);
    setReview(existingReview.review);
  }, [existingReview]);

  const handleReviewRating = () => {
    console.log("Submitting Review & Rating...");
    const result = EventReviewAndRating(rating, review, eventId, userId);
    // Optionally handle the result here
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="bg-gray-800 p-4 rounded-lg">
        <ModalHeader className="text-xl font-semibold text-white">Rate & Review</ModalHeader>
        <ModalBody>
          <p className="text-gray-400">Share your experience about this event.</p>

          {/* Star Rating */}
          <div className="flex space-x-2 justify-center my-2">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <FaStar
                  key={index}
                  size={24}
                  className="cursor-pointer transition-colors"
                  color={currentRating <= rating ? "#FFD700" : "#D1D5DB"}
                  onClick={() => setRating(currentRating)} // Only updates rating on click
                />
              );
            })}
          </div>

          {/* Review Textarea */}
          <textarea
            className="w-full p-2 border rounded-md bg-white text-black"
            rows={4}
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="success" onClick={handleReviewRating}>
            Submit Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;


