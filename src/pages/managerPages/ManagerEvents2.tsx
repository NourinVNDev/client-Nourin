import { useState } from "react";
import Footer from "../../components/managerComponents/Footer";
import NavBar from "../../components/managerComponents/NavBar";
import Header from "../../components/managerComponents/Header";
import { Toaster } from "react-hot-toast";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { createEventSeatDetails } from "../../service/managerServices/handleEventService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { validateSeatDetails } from "../../validations/managerValid/validateSeatDetails";

export interface EventFormValues {
    Included: string[];
    notIncluded: string[];
    Amount: number;
    noOfSeats: number;
    typesOfTickets: string;
}
interface TicketErrors {
    typesOfTickets?: string;
    noOfSeats?: string;
    Amount?: string;
    Included?: string;
    notIncluded?: string;
}

const ManagerEvents2: React.FC = () => {
    const [ticketsList, setTicketsList] = useState<EventFormValues[]>([]);
    const [formValues, setFormValues] = useState<EventFormValues>({
        Included: [""],
        notIncluded: [""],
        Amount: 0,
        noOfSeats: 0,
        typesOfTickets: "",
    });
    const { eventId } = useParams();
    const navigate=useNavigate();
    const [error, setError] = useState<TicketErrors>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: name === "Included" || name === "notIncluded" ? value.split(",").map(item => item.trim()) : value,
        }));
    };

    const handleFormSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form submitted with values:", ticketsList);
        if(eventId){
            const result=await createEventSeatDetails(ticketsList,eventId);
            console.log("Yess Checking",result);
            if(result.message==='Event data saved successfully'){
                navigate('/Manager/events');
            }
        }


            
        setFormValues({ Included: [""], notIncluded: [""], Amount: 0, noOfSeats: 0, typesOfTickets: "" });
    };

    const handleAddTicket = async() => {
        console.log("Adding ticket with values:", formValues);
        const validationErrors = await validateSeatDetails(formValues);

    if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);  // No need to wrap in another object
        return;
    }

        setTicketsList([...ticketsList, formValues]);
        setFormValues({ Included: [""], notIncluded: [""], Amount: 0, noOfSeats: 0, typesOfTickets: "" });
    };

    const handleRemoveTicket = (index: number) => {
        const updatedList = ticketsList.filter((_, i) => i !== index);
        setTicketsList(updatedList);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

            <div className="flex flex-1">
                <NavBar />
                <main className="flex-1 p-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Event</h2>

                    {ticketsList.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-green-500">Added Tickets</h3>
                            <div className="mt-4 space-y-3">
                                {ticketsList.map((ticket, index) => (
                                    <div
                                        key={index}
                                        className="relative p-4 bg-white text-black shadow rounded-lg border border-gray-300 flex items-center justify-between"
                                    >
                                        <div>
                                            <strong>Type:</strong> {ticket.typesOfTickets} | <strong>Seats:</strong> {ticket.noOfSeats} |{" "}
                                            <strong>Amount:</strong> {ticket.Amount} | <strong>Included:</strong> {ticket.Included.join(", ")} |{" "}
                                            <strong>Not Included:</strong> {ticket.notIncluded.join(", ")}
                                        </div>
                                        <button onClick={() => handleRemoveTicket(index)} className="text-red-500 hover:text-red-700">
                                            <XCircleIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
    <label className="block text-sm font-medium text-gray-400">Types of Ticket</label>
    <input
        type="text"
        name="typesOfTickets"
        value={formValues.typesOfTickets}
        onChange={handleInputChange}
        className="w-full mt-1 p-2 border bg-white text-black rounded focus:outline-blue-400"
    />
    {error.typesOfTickets && <p className="text-red-500 text-sm">{error.typesOfTickets}</p>}
</div>


                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Included (comma-separated)</label>
                                <input
                                    type="text"
                                    name="Included"
                                    value={formValues.Included.join(", ")}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 border bg-white text-black rounded focus:outline-blue-400"
                                />
                                {error.Included && <p className="text-red-500 text-sm">{error.Included}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400">Not Included (comma-separated)</label>
                                <input
                                    type="text"
                                    name="notIncluded"
                                    value={formValues.notIncluded.join(", ")}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 bg-white text-black border rounded focus:outline-blue-400"
                                />
                                {error.notIncluded && <p className="text-red-500 text-sm">{error.notIncluded}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Amount</label>
                                <input
                                    type="number"
                                    name="Amount"
                                    value={formValues.Amount}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 bg-white text-black border rounded focus:outline-blue-400"
                                />
                                {error.Amount && <p className="text-red-500 text-sm">{error.Amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400">Number of Seats</label>
                                <input
                                    type="number"
                                    name="noOfSeats"
                                    value={formValues.noOfSeats}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 bg-white text-black border rounded focus:outline-blue-400"
                                />
                                {error.noOfSeats && <p className="text-red-500 text-sm">{error.noOfSeats}</p>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={handleAddTicket} className="px-4 py-2 bg-blue-500 text-white rounded">
                                Add Ticket
                            </button>
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ManagerEvents2;