import { useEffect, useState } from "react";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import { getUserNames } from "../../service/userServices/userProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import ManagerUserList from "../../components/userComponents/ManagerUserList";
import ChatWindow from "../../components/userComponents/ChatWindow";
import { createConversationSchemaOfManager } from "../../service/managerServices/userBookingService";
import Footer from "../../components/managerComponents/Footer";
export interface ManagerData{
  chatId:string;
  companyName:string;
  lastMessage:{message:string,time:string};
  unreadCount:number;
  events:string[]
}
const ManagerChat = () => {
    const [allUsers, setAllUsers] = useState<ManagerData[]>([]);
    const managerName = localStorage.getItem("ManagerName");
    const managerId = useSelector((state: RootState) => state.manager._id) || "";
    const [selectedManager, setSelectedManager] = useState<string>('');
    const [messages, setMessages] = useState<{ message: string; time: string ,readCount:number}[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string,senderId:string }[]>([]);
    const [senderId, setSenderId] = useState<string>("");

   
  

    // Fetch User Names for the Manager
useEffect(() => {
    const fetchUserNames = async () => {
        if (!managerName) return;
        try {
          console.log(messages);
          
            const result = await getUserNames(managerName);
            console.log("Reee",result.data);
            if (Array.isArray(result.data)) {
                const updatedUsers = result.data.map((user: any) => {
                    const rawTime = user?.lastMessage?.time;
                    const date = new Date(rawTime);
                    const time = !isNaN(date.getTime())
                        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "Invalid time";
                    
                    return {
                        ...user,
                        lastMessage: user.lastMessage
                            ? { ...user.lastMessage, time }
                            : null
                    };
                });

                // Sort users by updatedAt in descending order (latest first)
                const sortedUsers = updatedUsers.sort((a: any, b: any) => {
                    const dateA = new Date(a.updatedAt);
                    const dateB = new Date(b.updatedAt);
                    return dateB.getTime() - dateA.getTime();
                });

                setAllUsers(sortedUsers);
            } else {
                console.error("Unexpected response format:", result);
            }
        } catch (error) {
            console.error("Error fetching Users:", error);
        }
    };

    fetchUserNames();
}, [managerName]);


    // Logging allUsers when updated
    useEffect(() => {
        console.log("User List Updated:",selectedManager,allMessages);
    }, [selectedManager]);


    const createChatSchema = async (user: string) => {
        setSelectedManager(user);
      
        if (!managerId) {
          console.error("Manager ID is missing");
          return;
        }
      
        try {
          const result = await createConversationSchemaOfManager(managerId, user);

          
          if (result?.data?.data?.userId) {
            setUserId(result.data.data.userId);
            setSenderId(managerId); 
            console.log("Caant",result.data.data.allMessages);
            
            setAllMessages(result.data.data.allMessages.map((msg: any) => ({
              message: msg.message,
              senderId: msg.senderId,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            })));

            if (result?.data?.data?.userId) {
              setAllUsers(prev =>
                prev.map(user =>
                  user.chatId === result.data.data.conversation._id
                    ? { ...user, unreadCount: 0 }
                    : user
                )
              );
            }
          } else {
            console.error("Manager ID not found in response", result);
          }
        } catch (error) {
          console.error("Error creating chat schema:", error);
        }
      };
      

    return (
      <div className="max-h-screen flex flex-col">
        <div>
            <Header />
            </div>
          <div className="flex-1 flex">
          <aside className="bg-blue-100 p-4">
            <NavBar/>
            </aside>

            
            <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
                <ManagerUserList managers={allUsers}  onSelectManager={createChatSchema} setMessages={setMessages} setSelectedEvent={setSelectedManager}  person='User' setAllManagers={setAllUsers}/>
                <ChatWindow
                    selectedManager={selectedManager}
                    allMessages={allMessages}
                    setAllMessages={setAllMessages}
                    senderId={senderId}
                    managerId={userId}
                    setMessages={setMessages}
                    setAllManagers={setAllUsers}
                  
 
                   
                />  
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default ManagerChat;
