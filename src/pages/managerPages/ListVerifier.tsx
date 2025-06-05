import { useEffect, useState } from "react";
import { fetchAllVerifiers } from "../../service/managerServices/handleVerifierService";
import Header from "../../components/managerComponents/Header";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { updateVerifierStatus } from "../../service/managerServices/handleVerifierService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../components/managerComponents/ReusableTable";
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
      const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
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
      const totalPages = Math.ceil(verifiers.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentVerifiers = verifiers.slice(startIndex, startIndex + eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const heading=['Name','Company','Email','Events','Status','','Action'];
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
           
                     <ReusableTable
  headers={heading}
  data={currentVerifiers}
  renderRow={(verifier, index) => (
    <tr key={verifier._id} className="border text-center text-black">
      <td className="border p-2">{verifier.verifierName}</td>
      <td className="border p-2">{verifier.companyName}</td>
      <td className="border p-2">{verifier.email}</td>
      <td className="border p-2">
        {eventNames[verifier._id] && eventNames[verifier._id].length > 0
          ? eventNames[verifier._id].join(", ")
          : "No Events"}
      </td>
      <td className="border p-2 text-green-800">
        {verifier.isActive ? "Active" : "InActive"}
      </td>
      <td className="border p-2">
        {verifier.isActive ? (
          <p
            className="bg-violet-500 text-white p-1 cursor-pointer"
            onClick={() => handleAcceptRequest(verifier._id)}
          >
            InActive
          </p>
        ) : (
          <button
            className="bg-green-500 text-white p-2"
            onClick={() => handleAcceptRequest(verifier._id)}
          >
            Active
          </button>
        )}
      </td>
      <td className="border p-2">
        <button
          className="bg-blue-500 text-white px-6 py-1"
          onClick={() => handleEditVerifier(verifier._id)}
        >
          Edit
        </button>
      </td>
    </tr>
  )}
/>

                            <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-blue-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Next
                  </button>
                </div>


                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListVerifier;
