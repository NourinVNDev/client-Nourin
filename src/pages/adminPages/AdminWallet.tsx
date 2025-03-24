import { useEffect, useState } from "react";
import { fetchAdminWallet } from "../../service/adminServices/adminCategoryAndWallet";
import Footer from "../../components/adminComponents/Footer";
import Header from "../../components/adminComponents/Header";
import NavBar from "../../components/adminComponents/NavBar";

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
        }>,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Set the number of items per page

    useEffect(() => {
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
                            createdAt: new Date(tx.createdAt).toLocaleDateString() // Formatting date
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
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <div className="flex-1 p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Admin Wallet</h2>

                    {loading ? (
                        <p className="text-center text-lg text-gray-700">Loading wallet details...</p>
                    ) : error ? (
                        <p className="text-center text-red-600 font-semibold">{error}</p>
                    ) : (
                        <div className="bg-white shadow-lg rounded-xl p-6">
                           <div className="flex justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Wallet Balance</h3>
                                    <span className="text-xl font-bold text-green-600">₹{adminWallet.balance.toFixed()}</span>
                                </div>

                            {/* Transaction History */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
                            {currentTransactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                        <thead className="bg-gray-200 text-gray-700">
                                            <tr>
                                                <th className="py-3 px-4">Booked ID</th>
                                                <th className="py-3 px-4">Date</th>
                                                <th className="py-3 px-4">Event Name</th>
                                                <th className="py-3 px-4">Total Amount (₹)</th>
                                                <th className="py-3 px-4">Manager Amount (₹)</th>
                                                <th className="py-3 px-4">Type</th>
                                                <th className="py-3 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentTransactions.map((tx, index) => (
                                                <tr
                                                    key={tx.bookedId}
                                                    className={`text-gray-700 text-center border-b transition-all hover:bg-gray-100 ${
                                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                    }`}
                                                >
                                                    <td className="py-3 px-4">{tx.bookedId}</td>
                                                    <td className="py-3 px-4">{tx.createdAt}</td>
                                                    <td className="py-3 px-4">{tx.eventName}</td>
                                                    <td className="py-3 px-4 font-semibold text-green-600">₹{tx.totalAmount.toFixed(2)}</td>
                                                    <td className="py-3 px-4 font-semibold text-blue-600">₹{tx.managerAmount.toFixed(2)}</td>
                                                    <td
                                                        className={`py-3 px-4 font-medium ${
                                                            tx.type === "credit" ? "text-green-500" : "text-red-500"
                                                        }`}
                                                    >
                                                        {tx.type}
                                                    </td>
                                                    <td
                                                        className={`py-3 px-4 font-medium ${
                                                            tx.status === "completed" ? "text-green-600" : "text-yellow-600"
                                                        }`}
                                                    >
                                                        {tx.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center mt-4">No transactions available.</p>
                            )}
                            
                            {/* Pagination Controls */}
                            <div className="flex justify-center mt-6">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Prev
                                </button>
                                <span className="px-4 py-2 text-lg font-medium text-gray-800">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminWallet;
