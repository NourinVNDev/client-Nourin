import { useEffect, useState } from "react";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import ManagerUserList from "../../components/userComponents/ManagerUserList";
import ChatWindow from "../../components/userComponents/ChatWindow";
import { getManagerNames, createConversationSchema } from "../../service/userServices/userProfile";
import useSocket from "../../utils/SocketContext";

const UserChat = () => {
  const userId = localStorage.getItem("userId");
  const { socket } = useSocket();

  const [allManagers, setAllManagers] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string>("");
  const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string ,senderId:string}[]>([]);
  const [senderId, setSenderId] = useState<string>("");

  // Fetch manager names
  useEffect(() => {
    const fetchManagerNames = async () => {
      if (!userId) return;
      try {
        const result = await getManagerNames(userId);

        if (result.success && Array.isArray(result.data)) {
          setAllManagers(result.data);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagerNames();
  }, [userId]);

  // Create conversation schema
  const createChatSchema = async (manager: string) => {
    console.log("confirm");
    if (!userId) return;
    console.log("confirm");

    
    try {
      const sender=userId;const receiver=manager;
      const result = await createConversationSchema(receiver, sender);
      console.log("Result:",result);
      
      if (result?.data?.data?.managerId) {
        setManagerId(result.data.data.managerId);
        setSenderId(result.data.data.conversation?.participants[0] || "");
        setSelectedManager(manager);
        setAllMessages(result.data.data.allMessages.map((msg: any) => ({
          message: msg.message,
          senderId:msg.senderId,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })) || []);
      } else {
        console.error("Manager ID not found in response", result);
      }
    } catch (error) {
      console.error("Error creating chat schema:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>
        <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
          <ManagerUserList managers={allManagers} onSelectManager={createChatSchema}   person='Event Manager'/>
          <ChatWindow
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            allMessages={allMessages}
            setAllMessages={setAllMessages}
            senderId={userId as string}
            managerId={managerId}
          
          />

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserChat;
