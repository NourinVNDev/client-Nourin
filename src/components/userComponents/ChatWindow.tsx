import { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import useSocket from "../../utils/SocketContext";
import MessageBubble from "../userComponents/MessageBubble";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";

interface ChatWindowProps {
  selectedManager: string | null;
  setSelectedManager: React.Dispatch<React.SetStateAction<string | null>>;
  allMessages: { message: string; timestamp: string, senderId: string }[];
  setAllMessages: React.Dispatch<React.SetStateAction<{ message: string; timestamp: string, senderId: string }[]>>;
  senderId: string;
  managerId: string;
}

const ChatWindow = ({
  selectedManager,
  setSelectedManager,
  allMessages,
  setAllMessages,
  senderId,
  managerId,
}: ChatWindowProps) => {
  const user = useSelector((state: RootState) => state.user._id);
  const manager = useSelector((state: RootState) => state.manager._id);
  const userId = user || manager;

  const { socket } = useSocket();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const messageListener = ({ senderId, message, timestamp }: { senderId: string; message: string; timestamp: string }) => {
      setAllMessages((prevMessages) => [...prevMessages, { message, timestamp, senderId }]);
    };

    socket.on("receive-message", messageListener);
    return () => {
      socket.off("receive-message", messageListener);
    };
  }, [socket]);

  // Send a new message
  const postNewMessage = async (message: string) => {
    if (!socket || !managerId || !message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = { message, timestamp: currentTime, senderId };

    const socketMessage = { message, sender: senderId, receiver: managerId };

    socket.emit("post-new-message", socketMessage, (response: any) => {
      console.log("Message sent acknowledgment:", response);
    });

    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  return (
    <div className={`w-2/3 min-h-screen p-4 transition-all ${selectedManager ? "block" : "hidden md:block"}`}>
      {selectedManager ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 bg-purple-500 text-white rounded-t-lg">
            <h2 className="text-lg font-bold">{selectedManager}</h2>
            <Button onClick={() => setSelectedManager(null)}>Close</Button>
          </div>

          {/* Messages Container with Scrolling */}
          <div className="flex-1 overflow-y-auto max-h-[600px] p-4 bg-gray-100 rounded-b-lg">
            {allMessages.length > 0 ? (
              allMessages.map((msgObj, index) => (
                <div
                  key={index}
                  className={`flex ${msgObj.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <MessageBubble
                    message={msgObj.message}
                    timestamp={msgObj.timestamp}
                    senderId={msgObj.senderId}
                    userId={userId || ""}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Start the conversation...</p>
            )}
            <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
          </div>

          {/* Input Section */}
          <div className="flex items-center p-3 border-t bg-white rounded-b-lg">
            <input
              className="bg-white text-black rounded-lg px-4 py-2 flex-1"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  postNewMessage(message);
                }
              }}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-5">Select a manager to start a chat</p>
      )}
    </div>
  );
};

export default ChatWindow;
