import { useEffect, useState } from "react";
import { fetchAdminWallet } from "../../service/adminServices/adminCategoryAndWallet";
import Footer from "../../components/adminComponents/Footer";
import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";
import ReusableTable from "../../components/adminComponents/ReusableTable";

const AdminWallet = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [adminWallet, setAdminWallet] = useState({
        adminId: "",
        balance: 0,
        currency: "USD",
        transactions: [] as Array<{
            bookedId: string;
            userId: string;
            totalAmount: number;
            managerAmount: number;
            type: string;
            status: string;
            eventName: string;
            createdAt: string;
            companyName: string
        }>,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Set the number of items per page

    useEffect(() => {
        console.log(error);
        
        const getAdminWallet = async () => {
            try {
                const result = await fetchAdminWallet();
                console.log("Result of Wallet:", result);

                if (result) {
                    setAdminWallet({
                        adminId: result.adminId,
                        balance: result.balance,
                        currency: result.currency || "USD",
                        transactions: result.transactions.map((tx: any) => ({
                            bookedId: tx.bookedId,
                            userId: tx.userId,
                            totalAmount: tx.totalAmount,
                            managerAmount: tx.managerAmount,
                            type: tx.type,
                            status: tx.status,
                            eventName: tx.eventName,
                            createdAt: new Date(tx.createdAt).toLocaleDateString(),
                            companyName: tx.companyName
                        })),
                    });
                } else {
                    setError("Failed to fetch wallet data.");
                }
            } catch (err) {
                setError("An error occurred while fetching wallet data.");
            } finally {
                setLoading(false);
            }
        };

        getAdminWallet();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(adminWallet.transactions.length / itemsPerPage);
    const currentTransactions = adminWallet.transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle page change
    // const handlePageChange = (page: number) => {
    //     setCurrentPage(page);
    // };
    const heading = ['Booked ID', 'Date', 'Event Name', 'Company Name', 'Total Amount', 'Manager Amount', 'Type', 'Status'];

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex flex-1 w-full">
                <NavBar />
                <div className="flex-1 p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Admin Wallet</h2>

                    {loading ? (
                        <p className="text-center text-lg text-gray-700">Loading wallet details...</p>
                    ) : adminWallet ? (
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Wallet Balance</h3>
                                <span className="text-xl font-bold text-green-600">₹{adminWallet.balance.toFixed()}</span>
                            </div>


                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>

                            <ReusableTable
                                headers={heading}
                                data={currentTransactions}
                                renderRow={(tx, index) => (
                                    <tr
                                        key={tx.bookedId}
                                        className={`text-gray-700 text-center border-b transition-all hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                    >
                                        <td className="py-3 px-4">{tx.bookedId}</td>
                                        <td className="py-3 px-4">{tx.createdAt}</td>
                                        <td className="py-3 px-4">{tx.eventName}</td>
                                        <td className="py-3 px-4">{tx.companyName}</td>
                                        <td className="py-3 px-4 font-semibold text-green-600">₹{tx.totalAmount.toFixed(2)}</td>
                                        <td className="py-3 px-4 font-semibold text-blue-600">₹{tx.managerAmount.toFixed(2)}</td>
                                        <td
                                            className={`py-3 px-4 font-medium ${tx.type === "credit" ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {tx.type}
                                        </td>
                                        <td
                                            className={`py-3 px-4 font-medium ${tx.status === "completed" ? "text-green-600" : "text-yellow-600"
                                                }`}
                                        >
                                            {tx.status}
                                        </td>
                                    </tr>
                                )}
                            />


                            <div className="flex justify-center mt-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${currentPage === 1 && "opacity-50 cursor-not-allowed"
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
                                    className={`px-4 py-2 mx-2 bg-blue-500 text-white rounded ${currentPage === totalPages && "opacity-50 cursor-not-allowed"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <p className="text-lg text-gray-500">No Money in the Wallet.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminWallet;
