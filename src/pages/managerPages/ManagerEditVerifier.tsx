import Header from "../../components/managerComponents/Header";
import { Toaster } from "react-hot-toast";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSeletedVerifierData } from "../../service/managerServices/handleVerifierService";
import { VerifierData } from "../../validations/verifierValid/verifierTypeValid";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { validateFields, VerifierErrors } from "../../validations/managerValid/verifierValidSchema";
import { updateVerifierData } from "../../service/managerServices/handleVerifierService";
import { useNavigate } from "react-router-dom";
import { getAllEventData } from "../../service/managerServices/handleEventService";

const ManagerEditVerifier = () => {
    const { verifierId } = useParams();
    const companyName = useSelector((state: RootState) => state.manager.companyName);
    const [formInput, setFormInput] = useState<VerifierData>({
        verifierName: "",
        email: "",
        Events: [],
        _id: ''
    });
    const [errors, setErrors] = useState<VerifierErrors>({});
    const [eventNames, setEventNames] = useState<string[]>([]);
    const navigate = useNavigate();
    const managerId = useSelector((state: RootState) => state.manager._id);

    // Fetch verifier data when component mounts
    useEffect(() => {
        const fetchVerifier = async () => {
            if (verifierId) {
                const result = await fetchSeletedVerifierData(verifierId);
                console.log("Result of Fetching Verifier", result.data.data);
                if (result.data.data) {
                    setFormInput({
                        verifierName: result.data.data.verifierName,
                        email: result.data.data.email,
                        Events: result.data.eventNames.map((event: string) => event),
                        _id: result.data.data._id
                    });
                }
            }
        }
        fetchVerifier();
    }, [verifierId]);


    useEffect(() => {
        const fetchEventName = async () => {
            if (managerId) {
                const response = await getAllEventData(managerId);
                console.log("Response:", response);
                const futureEvents = response.filter((event: any) => 
                    new Date(event.endDate) > new Date()
                );
                const eventNamesList = futureEvents.map((event: any) => event.eventName);
                console.log("Future event names:", eventNamesList);
                
                setEventNames(eventNamesList);
            }
        }
        fetchEventName();
    }, [managerId]);


    const handleCheckboxChange = (event: string) => {
        setFormInput((prev) => {
            const updatedEvents = prev.Events.includes(event)
                ? prev.Events.filter((e) => e !== event)
                : [...prev.Events, event];
            
            return {
                ...prev,
                Events: updatedEvents,
            };
        });
    };

    // Handle add event from the right side list
    const handleAddEvent = (event: string) => {
        if (!formInput.Events.includes(event)) {
            setFormInput(prev => ({
                ...prev,
                Events: [...prev.Events, event]
            }));
        }
    };

    // Form submission handler
    const handleVerifierForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName) {
            const validationErrors = validateFields(formInput);
            console.log("Validation:", validationErrors);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            console.log("Form Data", formInput);
            const result = await updateVerifierData(formInput, companyName);
            console.log("Result of Update Verifier", result);
            if (result.message === 'Verifier data saved successfully') {
                navigate('/manager/verifier');
            }
        }
    }

    // Input field change handler
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
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Verifier</h2>
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Left side - Selected Events */}
                            <div>
                                <label className="block text-gray-600 font-semibold mb-1">Selected Events</label>
                                <div className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
                                    <div className="max-h-40 overflow-y-auto">
                                        {formInput.Events.length === 0 ? (
                                            <p className="text-gray-500 italic">No events selected</p>
                                        ) : (
                                            formInput.Events.map((event, index) => (
                                                <div key={index} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`event-${index}`}
                                                        checked={true}
                                                        onChange={() => handleCheckboxChange(event)}
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
                                    </div>
                                    {errors.Events && <p className="text-red-500 text-sm">{errors.Events}</p>}
                                </div>
                            </div>
                            
                            {/* Right side - Available Events */}
                            <div>
                                <label className="block text-gray-600 font-semibold mb-1">Available Events</label>
                                <div className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
                                    <div className="max-h-40 overflow-y-auto">
                                        {eventNames.length === 0 ? (
                                            <p className="text-gray-500 italic">No events available</p>
                                        ) : (
                                            eventNames
                                                .filter(event => !formInput.Events.includes(event))
                                                .map((event, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center mb-2 cursor-pointer hover:bg-green-100 px-2 py-1 rounded"
                                                        onClick={() => handleAddEvent(event)}
                                                    >
                                                        <span className="text-gray-700">{event}</span>
                                                        <span className="text-green-500 text-sm">Add</span>
                                                    </div>
                                                ))
                                        )}
                                    </div>
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
}

export default ManagerEditVerifier;