// import { useEffect, useState } from "react";
// import Footer from "../../components/userComponents/Footer";
// import Header from "../../components/userComponents/Headers";
// import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
// import { getManagerNames, createConversationSchema } from "../../service/userServices/userProfile";
// import { Input, Button } from "@nextui-org/react";
// import useSocket from "../../utils/SocketContext";
// import { timeStamp } from "console";

// const UserChat = () => {
//   const userId = localStorage.getItem("userId");
//   const { socket } = useSocket();
  
//   const [allManagers, setAllManagers] = useState<string[]>([]);
//   const [selectedManager, setSelectedManager] = useState<string | null>(null);
//   const [managerId, setManagerId] = useState<string>("");
//   const [message, setMessage] = useState("");
//   const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string }[]>([]);
//   const [senderId,setSenderId]=useState('');

//   useEffect(() => {
//     const fetchManagerNames = async () => {
//       if (!userId) return;
//       try {
//         const result = await getManagerNames(userId);
//         console.log("Fetched manager names:", result); // Debugging log
  
//         if (result.success && Array.isArray(result.data)) {
//           setAllManagers(result.data);
//         } else {
//           console.error("Unexpected response format:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching managers:", error);
//       }
//     };
  
//     fetchManagerNames();
//   }, [userId]);
  
//   const createChatSchema = async (manager: string) => {
//     if (!userId) return;
  
//     try {
//       const result = await createConversationSchema(manager, userId);
//       console.log("Chat Schema Response:", result.data.data);
  
//       if (result?.data?.data?.managerId) {
//         setManagerId(result.data?.data?.managerId);
//         setSenderId(result?.data?.data.conversation?.participants[0])
//         setSelectedManager(manager);
//         setAllMessages(result.data.data.allMessages.map((msg:any)=>msg.message)|| []);
//       } else {
//         console.error("Manager ID not found in response", result);
//       }
//     } catch (error) {
//       console.error("Error creating chat schema:", error);
//     }
//   };
//   const postNewMessage = async (message: string) => {
//     if (!socket) {
//       console.error("Socket is not connected!");
//       return;
//     }
//     if (!userId || !managerId || !message.trim()) return;
  
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // Capture current time
  
//     const newMessage = { userId, managerId, message, timestamp: currentTime };  // Add timestamp here
  
//     socket.emit("post-new-message", newMessage, (response: any) => {
//       console.log("Message sent acknowledgment:", response);
//     });
  
//     // Append the new message with its timestamp to the message list
//     setAllMessages((prevMessages) => [
//       ...prevMessages,
//       { message, timestamp: currentTime }  // Store both message and timestamp
//     ]);
  
//     setMessage(""); // Clear input after sending
//   };
  
//   useEffect(() => {
//     if (!socket) return;
//     console.log("Black");
    

//     const messageListener = ({ senderId, message,timestamp }: { senderId: string; message: string,timestamp:string }) => {
//       console.log("Received message:", senderId, message,timeStamp);
//       setAllMessages((prevMessages) => [...prevMessages, {message:message,timestamp:timestamp}]);
//     };

//     socket.on("receive-message", messageListener);

//     return () => {
//       socket.off("receive-message", messageListener);
//     };
//   }, [socket]);

  

  

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <div className="flex-1 flex">
//         {/* Sidebar */}
//         <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
//           <ProfileNavbar />
//         </aside>

//         {/* Main Chat Layout */}
//         <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
//           {/* Manager List */}
//           <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
//           <h2 className="text-xl font-bold mb-4">Managers</h2>
//           <ul>
//             {allManagers.length > 0 ? (
//               allManagers.map((manager, index) => (
//                 <li
//                   key={index}
//                   className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg"
//                   onClick={() => createChatSchema(manager)}
//                 >
//                   {manager}
//                 </li>
//               ))
//             ) : (
//               <p className="text-gray-500">No managers found.</p>
//             )}
//           </ul>


//           </div>

//           {/* Chat UI (Only shown when a manager is selected) */}
//           <div className={`w-2/3 min-h-screen p-4 transition-all ${selectedManager ? "block" : "hidden md:block"}`}>
//             {selectedManager ? (
//               <div className="flex flex-col h-full">
//                 {/* Chat Header */}
//                 <div className="flex items-center justify-between p-3 bg-purple-500 text-white rounded-t-lg">
//                   <h2 className="text-lg font-bold">{selectedManager}</h2>
//                   <Button onClick={() => setSelectedManager(null)}>Close</Button>
//                 </div>

//                 {/* Chat Messages Area */}
//                 <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-b-lg">
//   {allMessages.length > 0 ? (
//     allMessages.map((msgObj, index) => (
//       <div
//         key={index}
//         className={`flex ${senderId === userId ? "justify-end" : "justify-start"} mb-2`}
//       >
//         <div>
//           <p
//             className={`px-3 py-2 rounded-lg max-w-fit ${
//               senderId === userId ? "bg-blue-200 text-black" : "bg-gray-200 text-black"
//             }`}
//           >
//             {msgObj.message}
//           </p>
//           <span className="text-xs text-gray-500 mt-1">
//           {msgObj.timestamp}
//           </span>
//         </div>
//       </div>
//     ))
//   ) : (
//     <p className="text-gray-500">Start the conversation...</p>
//   )}
// </div>




//                 {/* Message Input */}
//                 <div className="flex items-center p-3 border-t bg-white rounded-b-lg">
//                   <input
//                     className="bg-white text-black rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-purple-500"
//                     placeholder="Type a message..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && message.trim()) postNewMessage(message);
//                     }}
//                   />
//                   <Button
//                     className="ml-3 px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition"
//                     onClick={() => postNewMessage(message)}
//                     disabled={!message.trim()} // Disable button if message is empty
//                   >
//                     Send
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 Select a manager to start a chat
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default UserChat;
import { useEffect, useState } from "react";
import Footer from "../../components/userComponents/Footer";
import Header from "../../components/userComponents/Headers";
import ProfileNavbar from "../../components/userComponents/ProfileNavbar";
import { getManagerNames, createConversationSchema } from "../../service/userServices/userProfile";
import { Button } from "@nextui-org/react";
import useSocket from "../../utils/SocketContext";

const UserChat = () => {
  const userId = localStorage.getItem("userId");
  const { socket } = useSocket();
  
  const [allManagers, setAllManagers] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string }[]>([]);
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


const createChatSchema = async (manager: string) => {
  if (!userId) return;
  try {
    const result = await createConversationSchema(manager, userId);
    if (result?.data?.data?.managerId) {
      setManagerId(result.data.data.managerId);
      setSenderId(result.data.data.conversation?.participants[0] || "");
      setSelectedManager(manager);

      setAllMessages(result.data.data.allMessages.map((msg: any) => {
        const timestamp = msg.createdAt;
        console.log("Raw timestamp:", timestamp); // Log the raw timestamp

    const formattedTime=new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          message: msg.message,
          timestamp: formattedTime
        };
      }) || []);
    } else {
      console.error("Manager ID not found in response", result);
    }
  } catch (error) {
    console.error("Error creating chat schema:", error);
  }
};

// Send a new message
const postNewMessage = async (message: string) => {
  if (!socket || !userId || !managerId || !message.trim()) return;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newMessage = { message, timestamp: currentTime };
  
  socket.emit("post-new-message", newMessage, (response: any) => {
    console.log("Message sent acknowledgment:", response);
  });
  
  setAllMessages(prevMessages => [...prevMessages, newMessage]);
  setMessage(""); // Clear input after sending
};

  

  // Listen for incoming messages from the socket
  useEffect(() => {
    if (!socket) return;
    const messageListener = ({ senderId, message, timestamp }: { senderId: string; message: string; timestamp: string }) => {
      setAllMessages(prevMessages => [...prevMessages, { message, timestamp }]);
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
        <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-lg">
          <ProfileNavbar />
        </aside>
        <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
          <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
            <h2 className="text-xl font-bold mb-4">Managers</h2>
            <ul>
              {allManagers.length > 0 ? (
                allManagers.map((manager, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-300 rounded-lg"
                    onClick={() => createChatSchema(manager)}
                  >
                    {manager}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No managers found.</p>
              )}
            </ul>
          </div>
          <div className={`w-2/3 min-h-screen p-4 transition-all ${selectedManager ? "block" : "hidden md:block"}`}>
            {selectedManager ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-3 bg-purple-500 text-white rounded-t-lg">
                  <h2 className="text-lg font-bold">{selectedManager}</h2>
                  <Button onClick={() => setSelectedManager(null)}>Close</Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-b-lg">
                  {allMessages.length > 0 ? (
                    allMessages.map((msgObj, index) => (
                      <div
                        key={index}
                        className={`flex ${senderId === userId ? "justify-end" : "justify-start"} mb-2`}
                      >
                        <div>
                          <p
                            className={`px-3 py-2 rounded-lg max-w-fit ${
                              senderId === userId ? "bg-blue-200 text-black" : "bg-gray-200 text-black"
                            }`}
                          >
                            {msgObj.message}
                          </p>
                          <span className="text-xs text-gray-500 mt-1">{msgObj.timestamp}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Start the conversation...</p>
                  )}
                </div>
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
