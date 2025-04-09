interface TicketType {
    type: string;
    noOfSeats: number;
    Amount: number;
    Included: string[];
    notIncluded: string[];
    _id: string;
    id: string;
}

interface TicketErrors {
    type?: string;
    noOfSeats?: string;
    Amount?: string;
    Included?: string;
    notIncluded?: string;
}

export const validateFields = (ticket: TicketType): TicketErrors => {
    let validationErrors: TicketErrors = {};

    if (!ticket.type.trim()) validationErrors.type = "Ticket type is required";
    if (ticket.noOfSeats <= 0) validationErrors.noOfSeats = "Seats must be greater than 0";
    if (ticket.Amount <= 0) validationErrors.Amount = "Amount must be greater than 0";
    if (!ticket.Included.some(item => item.trim() !== "")) {
        validationErrors.Included = "Please enter at least one included item";
    }
    if (!ticket.notIncluded.some(item => item.trim() !== "")) {
        validationErrors.notIncluded = "Please enter at least one non-included item";
    }

    return validationErrors;
};
