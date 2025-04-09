import { useEffect, useState } from "react";
import { fetchAllVerifiers } from "../../service/managerServices/handleVerifierService";
import Header from "../../components/managerComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { updateVerifierStatus } from "../../service/managerServices/handleVerifierService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { button } from "@nextui-org/react";
type VerifierType = {
    _id: string,
    verifierName: string,
    companyName: string,
    email: string,
    isActive:boolean


}
const ListVerifier = () => {
    const [verifiers, setVerifiers] = useState<VerifierType[]>([{
        _id: "",
        verifierName: "",
        companyName: "",
        email: "",
        isActive:false

    }]);
    const navigate=useNavigate();
    const [eventNames, setEventNames] = useState<{ [key: string]: string[] }>({});

    const managerName = localStorage.getItem('ManagerName');
    useEffect(() => {
        const fetchAllVerifier = async () => {
            if (managerName) {
                const result = await fetchAllVerifiers(managerName);
                console.log("Verifier", result.data);

                setVerifiers(result.data.result);

                const eventMap: { [key: string]: string[] } = {};

                result.data.result.forEach((verifier: any) => {
                    eventMap[verifier._id] = result.data.socialEvents.map((event: any) => event.eventName);
                });
    
                setEventNames(eventMap);
            }
        };

        fetchAllVerifier();
    }, []);


    useEffect(() => {
        console.log("EventNames:", eventNames);
    }, [eventNames]);

    const handleEditVerifier=(verifierId:string)=>{
        navigate(`/Manager/editVerifier/${verifierId}`)
    }

    const handleAcceptRequest = async (verifierId: string) => {
        try {

            const response = await updateVerifierStatus(verifierId);
            console.log("Response", response)

            if (response.success) {
                toast.success(response.message)
                setVerifiers((prevVerifiers) =>
                    prevVerifiers.map((verifier) =>
                        verifier._id === verifierId ? { ...verifier, isActive: !verifier.isActive } : verifier
                    )
                )

                navigate('/manager/verifier');

            }

        } catch (error) {
            console.error("Error updating verifier status", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <Toaster position="top-center" />

            <div className="flex flex-1">
                <NavBar />
                <div className="flex-1 p-5">
                    <br />
                    <div className="flex flex-col w-full px-8 py-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Verifiers List</h2>
                            <Link to="/Manager/addNewVerifier">
                                <button className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600">
                                    Add Verifier
                                </button>
                            </Link>
                        </div>
                        {verifiers && verifiers.length > 0 ? (
                            <>
       
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 text-black">
                                            <th className="border p-2">Name</th>
                                            <th className="border p-2">Company</th>
                                            <th className="border p-2">Email</th>
                                            <th className="border p-2">Events</th>
                                            <th className="border p-2">Status</th>
                                            <th className="border p-2"></th>
                                            <th className="border p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verifiers.map((verifier) => (
                                            <tr key={verifier._id} className="border text-center text-black">
                                                <td className="border p-2">{verifier.verifierName}</td>
                                                <td className="border p-2">{verifier.companyName}</td>
                                                <td className="border p-2">{verifier.email}</td>
                                                <td className="border p-2">
                                                    {eventNames[verifier._id] && eventNames[verifier._id].length > 0
                                                        ? eventNames[verifier._id].join(", ")
                                                        : "No Events"}
                                                </td>

                                                <td className="border p-2 text-green-800">{verifier.isActive?'Active':'InActive'}</td>
                                                <td className="border p-2">{verifier.isActive?<p className="bg-violet-500 text-white p-1" onClick={()=>{handleAcceptRequest(verifier._id)}}>InActive</p>:<button  className="bg-green-500 text-white p-2" onClick={()=>{handleAcceptRequest(verifier._id)}}>Active</button>}</td>
                                                <button className="border p-2 bg-blue-500 text-white px-6" onClick={()=>handleEditVerifier(verifier._id)}>Edit</button>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p className="text-center text-gray-500">No Verifier found for this account.</p>

                        )}


                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListVerifier;
