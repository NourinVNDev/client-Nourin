import { Toaster } from "react-hot-toast";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { fetchManagerNotification } from "../../service/managerServices/handleNotification";

const ITEMS_PER_PAGE = 5;

const ManagerNotification = () => {
  const managerId = useSelector((state: RootState) => state.manager._id);
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const ManagerNotification = async () => {
      if (managerId) {
        const result = await fetchManagerNotification(managerId);
        console.log("Result:", result);

        if (result.message === "notification retrieve successfully") {
          const sortedData = result.data.user.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setNotificationData(sortedData);
        }
      }
    };
    ManagerNotification();
  }, [managerId]);

  // Pagination Logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = notificationData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(notificationData.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-center" />
      <div className="flex flex-1">
        <NavBar />
        <div className="flex-1 p-5">
          <h1 className="text-black text-xl font-semibold">Notifications</h1>
          <br />
          {paginatedData.length > 0 &&
            paginatedData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-3 p-2"
              >
                <img
                  src={item.senderImage}
                  alt="sender"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    {item.senderName}
                  </span>
                  <span className="text-base font-semibold text-gray-800">
                    {item.heading}
                  </span>
                  <span className="text-sm text-gray-600">{item.message}</span>
                  <span className="text-sm text-gray-600">
  {new Date(item.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // set to false if you want 24-hour format
  })}
</span>

                </div>
              </div>
            ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className="px-3 py-1 bg-gray-300 rounded text-sm disabled:opacity-50"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-300 rounded text-sm disabled:opacity-50"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerNotification;
