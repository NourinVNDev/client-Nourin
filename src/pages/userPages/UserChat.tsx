import { useEffect, useState } from "react";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import { getManagerNames, createConversationSchema } from "../../service/userServices/userProfile";
import { Input, Button } from "@nextui-org/react";
import useSocket from "../../utils/SocketContext";

const UserChat = () => {
  const userId = localStorage.getItem("userId");
  const { socket } = useSocket();
  
  const [allManagers, setAllManagers] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchManagerNames = async () => {
      if (!userId) return;
      try {
        const result = await getManagerNames(userId);
        if (result.success && Array.isArray(result.data)) {
          setAllManagers(result.data);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagerNames();
  }, [userId]);

  const createChatSchema = async (manager: string) => {
    if (!userId) return;
    
    try {
      const result = await createConversationSchema(manager, userId);
      
      if (result?.data?.data?.managerId) {
        setManagerId(result.data.data.managerId);
        setSelectedManager(manager);
      }
    } catch (error) {
      console.error("Error creating chat schema:", error);
    }
  };

  const postNewMessage = async (message: string) => {
    if (!socket) {
      console.error("Socket is not connected!");
      return;
    }
    if (!userId || !managerId || !message.trim()) return;

    const newMessage = {
      userId,
      managerId,
      message
    };

    socket.emit("post-new-message", newMessage, (response: any) => {
      console.log("Message sent acknowledgment:", response);
    });

    setMessage(""); // Clear input after sending
  };

  useEffect(() => {
    if (!socket) return;
    console.log("Black");
    

    const messageListener = ({ senderId, message }: { senderId: string; message: string }) => {
      console.log("Received message:", senderId, message);
      setAllMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receive-message", messageListener);

    return () => {
      socket.off("receive-message", messageListener);
    };
  }, [socket]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>

        {/* Main Chat Layout */}
        <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
          {/* Manager List */}
          <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
            <h2 className="text-xl font-bold mb-4">Managers</h2>
            {allManagers.length > 0 ? (
              <ul className="space-y-3">
                {allManagers.map((manager, index) => (
                  <li
                    key={index}
                    onClick={() => createChatSchema(manager)}
                    className={`cursor-pointer p-3 rounded-lg shadow-md transition ${
                      selectedManager === manager ? "bg-purple-500 text-white" : "bg-white hover:bg-gray-300"
                    }`}
                  >
                    {manager}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No managers found.</p>
            )}
          </div>

          {/* Chat UI (Only shown when a manager is selected) */}
          <div className={`w-2/3 min-h-screen p-4 transition-all ${selectedManager ? "block" : "hidden md:block"}`}>
            {selectedManager ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 bg-purple-500 text-white rounded-t-lg">
                  <h3 className="text-lg font-bold">{selectedManager}</h3>
                  <Button onClick={() => setSelectedManager(null)}>Close</Button>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-b-lg">
                  {allMessages.length > 0 ? (
                    allMessages.map((msg, index) => (
                      <p key={index} className="bg-white p-2 rounded-lg shadow mb-2">
                        {msg}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">Start the conversation...</p>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex items-center p-3 border-t bg-white rounded-b-lg">
                  <input
                    className="bg-white text-black rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-purple-500"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) postNewMessage(message);
                    }}
                  />
                  <Button
                    className="ml-3 px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition"
                    onClick={() => postNewMessage(message)}
                    disabled={!message.trim()} // Disable button if message is empty
                  >
                    Send
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a manager to start a chat
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserChat;
