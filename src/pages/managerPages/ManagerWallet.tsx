import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { fetchManagerWallet } from "../../service/managerServices/handleOfferService";
import Footer from "../../components/managerComponents/Footer";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import ReusableTable from "../../components/managerComponents/ReusableTable";

const ManagerWallet = () => {
    const managerId = useSelector((state: RootState) => state.manager._id);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [managerWalletData, setManagerWalletData] = useState({
        balance: 0,
  
        transactionHistory: [] as Array<{
            id: string;
            amount: number;
            eventName: string;
            status: string;
            type: string;
            noOfPerson:number;
        }>,
    });

   
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [transactionsPerPage] = useState<number>(5); // Set the number of transactions per page

    useEffect(() => {
        const getManagerWallet = async () => {
            if (managerId) {
                try {
                    console.log(error);
                    
                    const result = await fetchManagerWallet(managerId);
                    console.log("Result of Wallet:", result.data);
                    if (result.success) {
                        setManagerWalletData({
                        
                            
                            balance: result.data.balance,
                         
                            transactionHistory: result.data.transactions.map(
                                (tx: { bookedId: string; managerAmount: number; eventName: string; status: string; type: string ,noOfPerson:number}) => ({
                                    id: tx.bookedId,
                                    amount: tx.managerAmount,
                                    eventName: tx.eventName,
                                    status: tx.status,
                                    type: tx.type,
                                    noOfPerson:tx.noOfPerson
                                })
                            ),
                        });
                    } else {
                        setError("Failed to fetch wallet data.");
                    }
                } catch (err) {
                    setError("An error occurred while fetching wallet data.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        getManagerWallet();
    }, [managerId]);

    // Pagination logic
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = managerWalletData.transactionHistory.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    );

    const totalPages = Math.ceil(managerWalletData.transactionHistory.length / transactionsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const heading=['Event Name','NoOfPerson','Amount','Type','Status'];
    

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <div className="flex-1 p-6">
                    <h2 className="text-3xl font-bold mb-6 text-center text-black">Manager Wallet</h2>
    
                    {loading ? (
                        <p className="text-center text-lg text-gray-700">Loading wallet details...</p>
                    ) : managerWalletData?(
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Wallet Balance</h3>
                                <span className="text-xl font-bold text-green-600">₹{managerWalletData.balance.toFixed(2)}</span>
                            </div>
    
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
                        {managerWalletData.transactionHistory.length > 0 ? (
  <div className="overflow-x-auto">
    <ReusableTable
      headers={heading}
      data={currentTransactions}
      renderRow={(tx, _) => (
        <tr key={tx.id} className="text-gray-700 text-center border-b">
          <td className="py-2 px-4">{tx.eventName}</td>
          <td className="py-2 px-4">{tx.noOfPerson} person</td>
          <td className="py-2 px-4 font-semibold">₹{tx.amount.toFixed(2)}</td>
          <td className={`py-2 px-4 ${tx.type === "credit" ? "text-green-500" : "text-red-500"}`}>
            {tx.type}
          </td>
          <td className={`py-2 px-4 font-medium ${tx.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
            {tx.status}
          </td>
        </tr>
      )}
    />
  
  </div>
) : (
  <div className="flex justify-center items-center min-h-[60vh]">
    <p className="text-lg text-gray-500">No transactions found.</p>
  </div>
)}

                        </div>
                    ):(
                        <div className="flex justify-center items-center min-h-[60vh]">
                        <p className="text-lg text-gray-500">No Money in the Wallet.</p>
                    </div> 
                    )}
        
                        <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                                        >
                                            Prev
                                        </button>
                                        <span className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2"
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

export default ManagerWallet;
