import { useEffect, useState } from "react";
import { fetchAllVerifiers } from "../../service/managerServices/handleVerifierService";
import Header from "../../components/managerComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { updateVerifierStatus } from "../../service/managerServices/handleVerifierService";
type VerifierType={
    _id:string,
    verifierName:string,
    companyName:string,
    email:string,
    status:string

}
const ListVerifier = () => {
    const [verifiers, setVerifiers] = useState<VerifierType[]>([{
        _id:"",
        verifierName:"",
        companyName:"",
        email:"",
        status:""
    }]);

    useEffect(() => {
        const fetchAllVerifier = async () => {
            const result = await fetchAllVerifiers();
            console.log("Verifier", result.data.result);
            setVerifiers(result.data.result);  // Store data in state
        };

        fetchAllVerifier();
    }, []);

    const handleAcceptRequest = async (verifierId:string) => {
        try {
            // Make an API call to update the status (Assume updateVerifierStatus function exists)
            const response = await updateVerifierStatus(verifierId);
            console.log("Response",response)

            if (response.success) {
                toast.success(response.message)
                setVerifiers((prevVerifiers) =>
                    prevVerifiers.map((verifier) =>
                      verifier._id === verifierId ? { ...verifier, status: "confirmed" } : verifier
                    )
                )

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
                <div className="p-4 w-full">
                    <h2 className="text-xl font-semibold mb-4 text-black">Verifiers List</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Company</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifiers.map((verifier) => (
                                <tr key={verifier._id} className="border text-center text-black">
                                    <td className="border p-2">{verifier.verifierName}</td>
                                    <td className="border p-2">{verifier.companyName}</td>
                                    <td className="border p-2">{verifier.email}</td>
                                    <td className="border p-2">{verifier.status}</td>
                                    <td className="border p-2">
                                        {verifier.status === "confirmed" ? (
                                            <span className="text-green-600 font-bold">OK</span>
                                        ) : (
                                            <button 
                                                className="bg-blue-500 text-white px-3 py-1 rounded" 
                                                onClick={() => handleAcceptRequest(verifier._id)}
                                            >
                                                Accept
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListVerifier;
