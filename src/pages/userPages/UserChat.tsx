import { useEffect, useState } from "react";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import ManagerUserList from "../../components/userComponents/ManagerUserList";
import ChatWindow from "../../components/userComponents/ChatWindow";
import { getManagerNames, createConversationSchema } from "../../service/userServices/userProfile";
import { useParams } from "react-router-dom";

export interface ManagerData {
  chatId: string;
  companyName: string;
  lastMessage: { message: string, time: string };
  unreadCount: number;
  events: string[]
}

const UserChat = () => {
  const userId = localStorage.getItem("userId");
  const { companyName, eventName } = useParams();
  console.log("Params:", companyName, eventName);

  const [allManagers, setAllManagers] = useState<ManagerData[]>([]);
  // const [allEvents, setAllEvents] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ message: string; time: string, readCount: number }[]>([]);
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [managerId, setManagerId] = useState<string>("");
  const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string, senderId: string }[]>([]);
  const [senderId, setSenderId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState('');

  const [messageCount, setMessageCount] = useState(0);
  const [chatIds, setAllChatIds] = useState<string[]>([])

  useEffect(() => {
    if (eventName && companyName) {
      console.log("Evenntsfd", eventName, companyName);

      createChatSchema(companyName)
      setSelectedEvent(eventName);
    }

  }, [eventName, companyName,])
  useEffect(() => {
    const fetchManagerNames = async () => {
      if (!userId) return;
      try {
        const result = await getManagerNames(userId);

        console.log("Result789:", result);
        if (result.success && Array.isArray(result.data)) {
          const updatedManagers = result.data.map((manager: any) => {
            const rawTime = manager?.lastMessage?.time;
            const date = new Date(rawTime);
            const time = !isNaN(date.getTime())
              ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Invalid time";

            return {
              ...manager,
              lastMessage: manager.lastMessage
                ? { ...manager.lastMessage, time }
                : null,
            };
          });

          setAllManagers(updatedManagers);
        }


        // setAllEvents(result.data.eventNames.map((event: string) => event));

        // const formattedMessages = result.data.lastMessages.map((msg: any) => {
        //   const rawTime = msg.time;
        //   const date = new Date(rawTime);
        //   const time = !isNaN(date.getTime())
        //     ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        //     : "Invalid time";

        //   return {
        //     message: msg.message || "No message",
        //     time,
        //     readCount:msg.count
        //   };
        // });

        // setMessages(formattedMessages);


        else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagerNames();
  }, [userId]);



  const createChatSchema = async (manager: string) => {
    console.log("confirm");
    if (!userId) return;
    console.log("confirm");



    try {
      const sender = userId; const receiver = manager;
      const result = await createConversationSchema(receiver, sender);
      console.log("Result:", result);

      if (result?.data?.data?.managerId) {
        setAllManagers(prev =>
          prev.map(manager =>
            manager.chatId === result.data.data.conversation._id
              ? { ...manager, unreadCount: 0 }
              : manager
          )
        );
        setManagerId(result.data.data.managerId);

        setSenderId(result.data.data.conversation?.participants[0] || "");
        setSelectedManager(manager);
        setAllMessages(result.data.data.allMessages.map((msg: any) => ({
          message: msg.message,
          senderId: msg.senderId,
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
      <div>
        <Header />

      </div>
      <div className="flex-1 flex">
        <aside className="bg-gray-800 mb-10">

          <ProfileNavbar />
        </aside>
        <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
          <ManagerUserList managers={allManagers} onSelectManager={createChatSchema} setSelectedEvent={setSelectedEvent} setMessages={setMessages} person='Event Manager' setAllManagers={setAllManagers} />
          <ChatWindow
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            allMessages={allMessages}
            setAllMessages={setAllMessages}
            senderId={userId as string}
            managerId={managerId}
            selectedEvent={selectedEvent}
            setMessages={setMessages}
            setAllManagers={setAllManagers}
          />

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserChat;
