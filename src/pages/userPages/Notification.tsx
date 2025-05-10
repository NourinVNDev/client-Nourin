import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { useEffect, useState } from "react";
import { fetchUserNotificaiton } from "../../service/userServices/videoNotification";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import Footer from "../../components/userComponents/Footer";

type NotificationType = {
  heading: string;
  message: string;
};

const Notification = () => {
  const userId = useSelector((state: RootState) => state.user._id);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchNotification = async () => {
      if (userId) {
        const result = await fetchUserNotificaiton(userId);
        console.log("Result123:", result);

        if (result.message =="Notifications retrieved and marked as read") {
          console.log("Gang");
          
            console.log("Same:",result.data); 
          setNotifications(result.data);
        }
      }
    };
    fetchNotification();
  }, [userId]);
  useEffect(()=>{
console.log("SetNotification",notifications);

  },[notifications])

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <div className="flex-1 flex w-full">
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>
        <main className="flex-1 p-4 lg:p-8 bg-gray-50 w-full">
          <div className="max-w-5xl mx-auto w-full text-black">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Notification</h1>
            
            {notifications.length === 0 ? (
              <p className="text-gray-600">No notifications available.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((note, index) => (
                  <li key={index} className="bg-white p-4 rounded shadow border">
                    <h2 className="font-semibold text-lg text-black">{note.heading}</h2>
                    <p
                      className="text-gray-700 mt-1"
                      dangerouslySetInnerHTML={{ __html: note.message }}
                    ></p>
                  </li>
                ))}
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
