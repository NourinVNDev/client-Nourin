import { useEffect, useState } from "react";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { fetchUserWallet } from "../../service/userServices/userOfferAndWallet";

type userWallet = {
    balance: number;
    transactionHistory: {
        transaction: string;
        amount: number;
    }[];
};

const UserWallet = () => {
    const userId = useSelector((state: RootState) => state.user._id);
    const [userWalletData, setUserWalletData] = useState<userWallet | null>(null);

    useEffect(() => {
        const getUserWallet = async () => {
            if (userId) {
                const result = await fetchUserWallet(userId);
                if (result.success) {
                    setUserWalletData({
                        balance: result.data.balance,
                        transactionHistory: result.data.transactionHistory.map(
                            (tx: { transaction: string; amount: number }) => ({
                                transaction: tx.transaction,
                                amount: tx.amount,
                            })
                        ),
                    });
                }
            }
        };

        getUserWallet();
    }, [userId]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex-1 flex">
                <aside className="hidden md:block w-64 bg-gray-900 text-white min-h-[calc(100vh-4rem)] shadow-lg p-4">
                    <ProfileNavbar />
                </aside>
                <main className="flex-1 p-6">
                    {userWalletData ? (
                        <div className="max-w-3xl mx-auto">
                            {/* Wallet Balance Card */}
                            <div className="bg-white shadow-md rounded-xl p-6 mb-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-800">Wallet Balance</h2>
                                <p className="text-3xl font-semibold text-blue-600 mt-2">₹{userWalletData.balance}</p>
                            </div>

                            {/* Transaction History */}
                            <div className="bg-white shadow-md rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                                    Transaction History
                                </h3>
                                {userWalletData.transactionHistory.length > 0 ? (
                                    <ul className="space-y-3">
                                        {userWalletData.transactionHistory.map((tx, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition"
                                            >
                                                <span className="text-gray-700">{tx.transaction}</span>
                                                <span className="font-semibold text-green-600">₹{tx.amount}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No transactions found.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <p className="text-lg text-gray-500 animate-pulse">Loading wallet data...</p>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default UserWallet;
