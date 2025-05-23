import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { useEffect, useState } from "react";
import { fetchUserNotificaiton } from "../../service/userServices/videoNotification";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import Footer from "../../components/userComponents/Footer";
import person from '../../assets/person.png';
import useSocket from "../../utils/SocketContext";


type NotificationType = {
  heading: string;
  message: string;
  createdAt: string;

};

const Notification = () => {
  const userId = useSelector((state: RootState) => state.user._id);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { socket } = useSocket();
  const [isFetch, setIsFetch] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const currentNotifications = notifications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(notifications.length / limit);

  useEffect(() => {
    if (!socket && !userId) return;
    const socketData = { senderId: userId, role: 'bookedUser' };
    socket?.emit('change-isRead', socketData, (response: any) => {
      console.log("Message send acknowledgement", response);

    })

  }, [socket])

  useEffect(() => {
    const fetchNotification = async () => {
      if (userId) {
        const result = await fetchUserNotificaiton(userId);
        console.log("Result123:", result);

        if (result.message == "Notifications and messages retrieved and marked as read") {
          console.log("Gang");

          console.log("Same:", result.data);
              const sortedData = result.data.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setNotifications(sortedData);
        }
      }
    };
    fetchNotification();
  }, [userId, isFetch]);


  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header setIsFetch={setIsFetch} />
      <div className="flex-1 flex w-full">
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>
        <main className="flex-1  lg:p-6 bg-gray-50 w-full">
          <div className="w-full text-black px-4 md:px-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Notifications</h1>

            {currentNotifications.length === 0 ? (
              <p className="text-gray-600 text-center text-base">No notifications available.</p>
            ) : (
              <ul className="space-y-4">
                {currentNotifications.map((note, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <img
                      src={person}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="flex-1 border-b border-gray-200 pb-3">
                      <h2 className="font-medium text-base text-gray-900">{note.heading}</h2>
                      <p
                        className="text-gray-700 mt-1 text-sm"
                        dangerouslySetInnerHTML={{ __html: note.message }}
                      ></p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(note.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </li>
                ))}
                <div className="flex justify-center items-center mt-6 gap-4">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 text-sm rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-300 text-sm rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

              </ul>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>



  );
};

export default Notification;
