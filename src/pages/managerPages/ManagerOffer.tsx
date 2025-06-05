import Footer from "../../components/managerComponents/Footer";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import { useState, useEffect } from "react";
import { Offer } from "../adminPages/AdminOffer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchManagerOffer } from "../../service/managerServices/handleOfferService";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import ReusableTable from "../../components/managerComponents/ReusableTable";
const ManagerOffer = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [selectedDiscount, setSelectedDiscount] = useState<string>("");
    const [offers, setOffers] = useState<Offer[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 5;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const managerId = useSelector((state: RootState) => state.manager._id);
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                if (managerId) {
                    const response = await fetchManagerOffer(managerId);
                    console.log("Response123", response);

                    if (response.data && Array.isArray(response.data)) {
                        console.log("Main Data", response.data);
                        setOffers(response.data);
                        setFilteredOffers(response.data);
                    } else {
                        setError("Unexpected response format.");
                    }

                }
            } catch (err) {
                console.error("Failed to fetch offers:", err);
                setError("Failed to load offers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [managerId]);

    useEffect(() => {
        let results = [...offers];

        if (searchTerm) {
            results = results.filter((offer) =>
                offer.offerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedDiscount) {
            results = results.filter((offer) => offer.discount_on === selectedDiscount);
        }

        setFilteredOffers(results);
    }, [searchTerm, selectedDiscount]);

    if (loading) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 font-semibold">{error}</div>;
    }

    const handleSearchOffer = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const handleDiscountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDiscount(e.target.value);
    };
    const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
    const startIndex = (currentPage - 1) * offersPerPage;
    const currentOffers = filteredOffers.slice(startIndex, startIndex + offersPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const handleEditFeature = (offerId: string) => {
        navigate(`/editOfferDetails/${offerId}`);
    };
    const heading=["Offer Name", "Description", "Discount Value", "Discount On", "Start Date", "End Date", "Actions"];
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex flex-1">
                <NavBar />

                <div className="flex-1 p-6 overflow-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 my-6 mx-4">
                      
                        <div className="relative w-full md:w-1/2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
                                type="text"
                                id="search"
                                onChange={handleSearchOffer}
                                placeholder="Search by Offer Name..."
                            />
                        </div>

                     
                        <div className="w-full md:w-1/3">
                            <select
                                name="discount_on"
                                id="discount_on"
                                onChange={handleDiscountChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black"
                            >
                                <option value="">Filter by Discount On</option>
                                {[...new Set(currentOffers.map((offer) => offer.discount_on))].map((discount) => (
                                    <option key={discount} value={discount}>{discount}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl text-black font-semibold">Offer Module</h2>
                        <Link to="/manager/addOffer">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                ADD OFFER
                            </button>
                        </Link>
                    </div>
            

                    <ReusableTable
                    headers={heading}
                    data={currentOffers}
                  renderRow={(offer, index) => (
    <tr key={offer._id} className="hover:bg-gray-50">
      <td className="px-4 py-3">{offer.offerName}</td>
      <td className="px-4 py-3">{offer.item_description}</td>
      <td className="px-4 py-3">{offer.discount_value}%</td>
      <td className="px-4 py-3">{offer.discount_on}</td>
      <td className="px-4 py-3">
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(offer.startDate))}
      </td>
      <td className="px-4 py-3">
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(offer.endDate))}
        {new Date(offer.endDate) < new Date() && (
          <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
            Expired
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          onClick={() => handleEditFeature(offer._id)}
        >
          Edit
        </button>
      </td>
    </tr>
  )}
                    />


                    <div className="flex justify-center items-center mt-6 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg transition ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-2 rounded-lg text-sm ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg transition ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
            <Footer />



        </div>
    )
}
export default ManagerOffer;