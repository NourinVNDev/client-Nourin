import { useState, useEffect } from "react";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { fetchAllCompanyEvents, postNewVerifier } from "../../service/managerServices/handleVerifierService";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { validateFields } from "../../validations/managerValid/verifierValidSchema";
import { VerifierErrors } from "../../validations/managerValid/verifierValidSchema";
const AddNewVerifier = () => {
    const [formInput, setFormInput] = useState<VerifierData>({
        verifierName: "",
        email: "",
        Events: [],
    });

    const navigate = useNavigate();
    const [eventName, setEventName] = useState<string[]>([]);
    const companyName = useSelector((state: RootState) => state.manager.companyName);
    const [errors, setErrors] = useState<VerifierErrors>({});

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (companyName) {
                const result = await fetchAllCompanyEvents(companyName);
                console.log('Result of Events:', result);

                if (result.message === "No Events hosted in this company") {
                    toast.error(result.message);
                } else {


                    setEventName(result.data.map((name: string) => name));
                }
            }
        };

        fetchAllEvents();
    }, [companyName]);
    useEffect(() => {
        console.log("Event:", eventName);

    }, [eventName])
    const handleVerifierForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName) {
            const validationErrors = validateFields(formInput);
            console.log("Validation:", validationErrors);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }







            const result = await postNewVerifier(formInput, companyName);
            console.log("Welcome", result);

            if (result?.message === "Verifier data saved successfully") {
                navigate("/manager/verifier");
            } else {
                toast.error(result?.message || "Unknown error");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    };



    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

            <div className="flex flex-1">
                <NavBar />
                <main className="flex-1 p-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Verifier</h2>

                    <form onSubmit={handleVerifierForm}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="verifierName"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-500"
                                    value={formInput.verifierName}
                                    onChange={handleChange}
                                />
                                {errors.verifierName && <p className="text-red-500 text-sm">{errors.verifierName}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 font-semibold mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-500"
                                    value={formInput.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-semibold mb-1">Select Events</label>
                            <div className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
                                <div className="max-h-40 overflow-y-auto">
                                    {eventName.length === 0 ? (
                                        <p className="text-gray-500 italic">No events available</p>
                                    ) : (
                                        eventName.map((event, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id={`event-${index}`}
                                                    name="Events"
                                                    value={event}
                                                    checked={formInput.Events.includes(event)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setFormInput(prevState => ({
                                                            ...prevState,
                                                            Events: isChecked
                                                                ? [...prevState.Events, event]
                                                                : prevState.Events.filter(selectedEvent => selectedEvent !== event)
                                                        }));
                                                    }}
                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label
                                                    htmlFor={`event-${index}`}
                                                    className="text-gray-700"
                                                >
                                                    {event}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                    {errors.Events && <p className="text-red-500 text-sm">{errors.Events}</p>}
                                </div>
                            </div>

                        </div>
                        <button
                            type="submit"
                            className="w-1/6 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md"
                        >
                           Submit
                        </button>
                    </form>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AddNewVerifier;
