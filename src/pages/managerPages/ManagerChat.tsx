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

const ManagerChat = () => {
    const [allUsers, setAllUsers] = useState<string[]>([]);
    const managerName = localStorage.getItem("ManagerName");
    const managerId = useSelector((state: RootState) => state.manager._id) || "";
    const [selectedManager, setSelectedManager] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string,senderId:string }[]>([]);
    const [senderId, setSenderId] = useState<string>("");

    // Fetch User Names for the Manager
    useEffect(() => {
        const fetchUserNames = async () => {
            if (!managerName) return;
            try {
                const result = await getUserNames(managerName);
                if (result.success && Array.isArray(result.data)) {
                    console.log("Result:", result.data.map((user: any) => user.firstName));
                
                    setAllUsers(result.data.map((user: any) => user.firstName));
                }
                else {
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

    // Create Chat Schema when selecting a user
    // const createChatSchema = async (user: string) => {
    //     console.log("Hai",user,managerId);
    //     setSelectedManager(user);
        
    //     if (!managerId) {
    //         console.error("Manager ID is missing");
    //         return;
    //     }

    //     try {
    //         const sender=managerId;
    //         const receiver=user;
    //         const result = await createConversationSchemaOfManager(sender, receiver);
    //         console.log("Fan",result.data.data.userId);
            
    //         if (result?.data?.data?.userId) {
    //             setUserId(result.data.data.userId);
    //             setSenderId(result.data.data.conversation?.participants[0] || "");
    //             console.log("Thaayii", result.data.data.allMessages);
                
    //             setAllMessages(
    //                 result.data.data.allMessages.map((msg: any) => ({
                    
                        
    //                     message: msg.message,
    //                     timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
    //                         hour: "2-digit",
    //                         minute: "2-digit",
    //                     }),
            
    //                 })) || []
    //             );
    //         } else {
    //             console.error("Manager ID not found in response", result);
    //         }
    //     } catch (error) {
    //         console.error("Error creating chat schema:", error);
    //     }
    // };

    const createChatSchema = async (user: string) => {
        setSelectedManager(user);
      
        if (!managerId) {
          console.error("Manager ID is missing");
          return;
        }
      
        try {
          const result = await createConversationSchemaOfManager(managerId, user);
          console.log("Result of Manager:",result.data.data.allMessages[0].senderId);
          
          if (result?.data?.data?.userId) {
            setUserId(result.data.data.userId);
            setSenderId(managerId); // The manager is always the sender
            setAllMessages(result.data.data.allMessages.map((msg: any) => ({
              message: msg.message,
              senderId: msg.senderId,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            })));
          } else {
            console.error("Manager ID not found in response", result);
          }
        } catch (error) {
          console.error("Error creating chat schema:", error);
        }
      };
      

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
          <div className="flex-1 flex">
      

            <NavBar/>
            
            <div className="flex flex-1 border rounded-lg shadow-md overflow-hidden">
                <ManagerUserList managers={allUsers} onSelectManager={createChatSchema}  person='User'/>
                <ChatWindow
                    selectedManager={selectedManager}
                    setSelectedManager={setSelectedManager}
                    allMessages={allMessages}
                    setAllMessages={setAllMessages}
                    senderId={senderId}
                    managerId={userId}
                   
                />  
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default ManagerChat;
