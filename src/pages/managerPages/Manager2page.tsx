import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSocialEventDetails } from "../../service/managerServices/handleEventService";
import Header from "../../components/managerComponents/Header";
import { Toaster, toast } from "react-hot-toast";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { updateTicketService } from "../../service/managerServices/handleEventService";
import { validateFields } from "../../validations/managerValid/seatValidSchema";
import { useNavigate } from "react-router-dom";
interface TicketType {
    type: string;
    noOfSeats: number;
    Amount: number;
    Included: string[];
    notIncluded: string[];
    _id: string
    id: string
}
interface TicketErrors {
    type?: string;
    noOfSeats?: string;
    Amount?: string;
    Included?: string;
    notIncluded?: string;
}

const Manager2Page = () => {
    const [ticketDetails, setTicketDetails] = useState<TicketType[]>([]);
    const [editedTickets, setEditedTickets] = useState<TicketType[]>([]);
    const [errors, setErrors] = useState<Record<string, TicketErrors>>({});
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (id) {
                try {
                    const result = await fetchSocialEventDetails(id);
                    if (Array.isArray(result.data) && result.data.length > 0) {
                        setTicketDetails(result.data);

                        setEditedTickets(result.data.map((ticket: any) => ({ ...ticket })));
                    } else {
                        toast.error("No ticket details found");
                    }
                } catch (error) {
                    toast.error("Error fetching event details");
                    console.error("Error fetching event details:", error);
                }
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleEventUpdate = (index: number, field: keyof TicketType, value: string | number) => {
        const updatedTickets = [...editedTickets];

        if (field === 'Included' || field === 'notIncluded') {
            // For array fields, split the input string into an array
            updatedTickets[index] = {
                ...updatedTickets[index],
                [field]: (value as string).split(',').map(item => item.trim())
            };
        } else {
            updatedTickets[index] = {
                ...updatedTickets[index],
                [field]: value
            };
        }

        setEditedTickets(updatedTickets);
    };

    const updateTicketDetails = async (ticketId: string) => {

        let ticketToUpdate = editedTickets.find(ticket => ticket._id === ticketId);
        if (!ticketToUpdate) {
            toast.error("Ticket not found");
            return;
        }
        console.log("Updated ticket:", ticketToUpdate);

        const validationErrors = validateFields(ticketToUpdate);
        console.log("Validation", validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [ticketId]: validationErrors
            }));
            return;
        }
        if (id) {
            ticketToUpdate = { ...ticketToUpdate, id };
        }
        try {

            const response = await updateTicketService(ticketToUpdate);
            if (response.message === 'Event Seat Updated SuccessFully') {
                toast.success("Ticket updated successfully");

                setErrors({});
                navigate('/Manager/events');

            }

            setTicketDetails(prevTickets =>
                prevTickets.map(ticket =>
                    ticket._id === ticketId ? ticketToUpdate : ticket
                )
            );
        } catch (error) {
            toast.error("Failed to update ticket");
            console.error("Update error:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

            <div className="flex flex-1">
                <NavBar />
                <div className="p-6 flex-grow">
                    <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Manage Tickets</h2>

                    {editedTickets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {editedTickets.map((ticket, index) => (
                                <div key={ticket._id} className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Ticket {index + 1}</h3>

                                    <label className="block mb-2 text-gray-600 font-medium">Ticket Type:</label>
                                    <input
                                        type="text"
                                        value={ticket.type}
                                        onChange={(e) => handleEventUpdate(index, 'type', e.target.value)}
                                        className="w-full px-4 py-2 border bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {errors[ticket._id]?.type && <p className="text-red-500 text-sm">{errors[ticket._id]?.type}</p>}

                                    <label className="block mt-4 mb-2 text-gray-600 font-medium">Seats:</label>
                                    <input
                                        type="number"
                                        value={ticket.noOfSeats}
                                        onChange={(e) => handleEventUpdate(index, 'noOfSeats', Number(e.target.value))}
                                        className="w-full px-4 py-2 border bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {errors[ticket._id]?.noOfSeats && <p className="text-red-500 text-sm">{errors[ticket._id]?.noOfSeats}</p>}

                                    <label className="block mt-4 mb-2 text-gray-600 font-medium">Amount:</label>
                                    <input
                                        type="number"
                                        value={ticket.Amount}
                                        onChange={(e) => handleEventUpdate(index, 'Amount', Number(e.target.value))}
                                        className="w-full px-4 py-2 border bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {errors[ticket._id]?.Amount && <p className="text-red-500 text-sm">{errors[ticket._id]?.Amount}</p>}

                                    <label className="block mt-4 mb-2 text-gray-600 font-medium">Included:</label>
                                    <textarea
                                        value={ticket.Included ? ticket.Included.join(", ") : ""}
                                        onChange={(e) => handleEventUpdate(index, 'Included', e.target.value)}
                                        className="w-full px-4 py-2 border bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                                        placeholder="Enter included items separated by comma"
                                    />
                                    {errors[ticket._id]?.Included && <p className="text-red-500 text-sm">{errors[ticket._id]?.Included}</p>}

                                    <label className="block mb-2 text-gray-600 font-medium">Not Included:</label>
                                    <textarea
                                        value={ticket.notIncluded ? ticket.notIncluded.join(", ") : ""}
                                        onChange={(e) => handleEventUpdate(index, 'notIncluded', e.target.value)}
                                        className="w-full px-4 py-2 border bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Enter non-included items separated by comma"
                                    />
                                    {errors[ticket._id]?.notIncluded && <p className="text-red-500 text-sm">{errors[ticket._id]?.notIncluded}</p>}

                                    <button
                                        className="mt-4 w-full px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                                        onClick={() => updateTicketDetails(ticket._id)}
                                    >
                                        Update Ticket
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">Loading ticket details...</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Manager2Page;