import { useEffect, useState } from "react";
import { getAllOffers } from "../../service/adminServices/adminOffer";
import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";
import Footer from "../../components/adminComponents/Footer";
import { Link, useNavigate } from "react-router-dom";
import ReusableTable from "../../components/adminComponents/ReusableTable";


export type Offer = {
  discount_on: string;
  discount_value: number;
  endDate: Date;
  startDate: Date;
  offerName: string;
  item_description: string;
  _id: string;
};

const AdminOffers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 5;
  const navigate = useNavigate();


  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
  const startIndex = (currentPage - 1) * offersPerPage;
  const currentOffers = filteredOffers.slice(startIndex, startIndex + offersPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fetching all offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {

        const response = await getAllOffers();
        console.log("Response123", response);

        if (response.data && Array.isArray(response.data)) {
          console.log("Main Data", response.data);
          setOffers(response.data);
          setFilteredOffers(response.data);
        } else {
          setError("Unexpected response format.");
        }



      } catch (err) {
        console.error("Failed to fetch offers:", err);
        setError("Failed to load offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);


  useEffect(() => {
    let results = offers;

    if (searchTerm) {
      results = results.filter((offer) =>
        offer.offerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDiscount) {
      results = results.filter((offer) => offer.discount_on === selectedDiscount);
    }

    setFilteredOffers(results);
  }, [searchTerm, selectedDiscount, offers]);

  const handleEditFeature = (offerId: string) => {
    navigate(`/editAdminOfferDetails/${offerId}`);
  };

  const handleSearchOffer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDiscount(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">{error}</div>;
  }
  const heading = ['Offer Name', 'Description', 'discount_value', 'discount_on', 'startDate', 'endDate', 'Actions'];

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 w-full">
        <NavBar />
        <div className="flex-1 p-5">
          <br />
          <div className="max-w-md mx-auto">

            <div className="relative flex items-center w-full h-12 bg-white rounded-lg focus-within:shadow-lg overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm  bg-white text-gray-700 pr-2"
                type="text"
                id="search"
                onChange={handleSearchOffer}
                placeholder="Search by Offer Name..."
              />
            </div>


            <select
              name="discount_on"
              id="discount_on"
              onChange={handleDiscountChange}
              className="mt-2 w-full p-2 border border-gray-300 bg-white text-black rounded-lg"
            >
              <option value="">Select Discount</option>
              {[...new Set(offers.map((offer) => offer.discount_on))].map(
                (discount) => (
                  <option key={discount} value={discount}>
                    {discount}
                  </option>
                )
              )}
            </select>
          </div>


          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">
              Offer Module
            </h2>
            <Link to="/admin/addOffer">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                ADD OFFER
              </button>
            </Link>
          </div>
           <ReusableTable
            headers={heading}
            data={currentOffers}
            renderRow={(offer) => (
              <tr key={offer._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{offer.offerName}</td>
                <td className="border border-gray-300 px-4 py-2">{offer.item_description}</td>
                <td className="border border-gray-300 px-4 py-2">{offer.discount_value}%</td>
                <td className="border border-gray-300 px-4 py-2">{offer.discount_on}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(offer.startDate))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(offer.endDate))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEditFeature(offer._id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )}
          />




             <div className="flex justify-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-2 text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminOffers;
