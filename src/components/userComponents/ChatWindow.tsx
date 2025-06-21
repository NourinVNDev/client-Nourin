import React, { useEffect, useState, useRef } from "react";
import useSocket from "../../utils/SocketContext";
import MessageBubble from "../userComponents/MessageBubble";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { ManagerData } from "../../pages/userPages/UserChat";


interface ChatWindowProps {
  selectedManager: string | null;
  setSelectedManager: React.Dispatch<React.SetStateAction<string>>;
  allMessages: { message: string; timestamp: string, senderId: string }[];
  setAllMessages: React.Dispatch<React.SetStateAction<{ message: string; timestamp: string, senderId: string }[]>>;
  senderId: string;
  managerId: string;
  selectedEvent?: string;
  setMessages:React.Dispatch<React.SetStateAction<{ message: string; time: string; readCount:number}[]>>
  setAllManagers: React.Dispatch<React.SetStateAction<ManagerData[]>>;
}
const ChatWindow = ({
  selectedManager,
  setSelectedManager,
  allMessages,
  setAllMessages,
  senderId,
  managerId,
  selectedEvent,
  setMessages,
  setAllManagers
}: ChatWindowProps) => {

  const user = useSelector((state: RootState) => state.user);
  const manager = useSelector((state: RootState) => state.manager);
  const userId = user._id? user:manager;
  console.log("Role finding",userId);
  const { socket } = useSocket();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  // }, [allMessages]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    // Check if user is near the bottom (within 100px)
    const isNearBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + 100;

    // Auto-scroll only if near bottom or user sent the message
    const lastMessage = allMessages[allMessages.length - 1];
    const isUserMessage = lastMessage?.senderId === userId._id;

    if (isNearBottom || isUserMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, userId._id]);

  
  useEffect(() => {
    if (!socket) return;
  
    const messageListener = ({ senderId, message, timestamp,totalMessage ,chatId,receiverId,unreadCount}: { senderId: string; message: string; timestamp: string ,totalMessage:number,chatId:string,receiverId:string,unreadCount:number}) => {
      const date = new Date(timestamp);
      console.log("UnreadCount:",unreadCount);
      if (!isNaN(date.getTime())) {
        const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    if (localStorage.getItem("chatId") === chatId) {
          setAllMessages((prev) => [
            ...prev,
            { message, timestamp: formattedTime, senderId },
          ]);
        }

    
        if (localStorage.getItem('chatId') === chatId) {
          setMessages(prev => [...prev, { message, time: formattedTime, readCount: 0 }]);
        } else {
          setMessages(prev =>
            prev.map(msg =>
              msg.message === message && msg.time === formattedTime
                ? { ...msg, readCount: totalMessage }
                : msg
            )
          );
        }
        setAllManagers(prevManagers =>
          prevManagers.map(chat =>
            chat.chatId === chatId
              ? {
                  ...chat,
                  lastMessage: {
                    message,
                    time: formattedTime,
                   
                  },
               unreadCount: chat.chatId === localStorage.getItem("chatId") ? 0 : unreadCount
                }
              :chat
              
          )
        );
        

      } else {
        console.warn("Invalid date received:", timestamp);
      }
    };
  
    socket.on("receive-message", messageListener);
    return () => {
      socket.off("receive-message", messageListener);
    };
  }, [socket]);
  


  const postNewMessage = async (message: string) => {
    if (!socket || !managerId || !message.trim()) return;
  
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = { message, timestamp: currentTime, senderId };
    let socketMessage;
    if(userId.role=='user'){
      socketMessage = { message, sender: senderId, receiver: managerId,senderModel:'User',receiverModel:'Manager'};
    }else{
      socketMessage = { message, sender: senderId, receiver: managerId,senderModel:'Manager',receiverModel:'User'}
    }
    socket.emit("post-new-message", socketMessage, (response: any) => {
      console.log("Message sent acknowledgment:", response);
      
      const rawTime = response.data.createdAt;
      const msg = response.data.content;
      const totalCount=response.data.totalMessage;
  
      if (rawTime) {
        const date = new Date(rawTime);
        if (!isNaN(date.getTime())) {
          const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
          
  
          setMessages(prev => [...prev, { message: msg, time: formattedTime ,readCount:totalCount}]);

          setAllManagers(prevManagers =>
            prevManagers.map((chat:any) =>
              chat.chatId === localStorage.getItem("chatId")
                ? {
                    ...chat,
                    lastMessage: {
                      message: msg,
                      time: formattedTime,
                    },
                  }
                : chat
            )
          );
        } else {
          console.warn("Invalid date format in ack:", rawTime);
          
        }
      }
    });
    setAllMessages(prev => [...prev, newMessage]);
    setMessage("");
  };
  
const maxMessages = 15;
  const displayedMessages = allMessages.slice(-maxMessages);
  return (
    <div className={`w-full min-h-screen p-4 transition-all ${selectedManager ? "block" : "hidden md:block"}`}>
      {managerId || selectedManager ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          {selectedEvent &&selectedManager?(
             <div className="p-4 bg-purple-500 text-white flex justify-between items-start">
             <div>
               <h2 className="text-lg font-bold">{selectedEvent}</h2>
               <h4 className="font-semibold">{selectedManager}</h4>
             </div>
           </div>

          ):(
            <div className="p-4 bg-purple-500 text-white flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">{selectedManager}</h2>
            </div>

          </div>
          )}
         


          {/* Messages Container with Scrolling */}
    <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto max-h-[600px] p-4 bg-gray-100 rounded-b-lg"
          >
            {displayedMessages.length > 0 ? (
              displayedMessages.map((msgObj, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msgObj.senderId === userId._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <MessageBubble
                    message={msgObj.message}
                    timestamp={msgObj.timestamp}
                    senderId={msgObj.senderId}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">Start the conversation...</p>
            )}
            <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
          </div>


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
