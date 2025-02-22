import React from 'react';
import { useEffect,useState } from 'react';
import { getManagerNames } from '../../service/userServices/userProfile';
import { createConversationSchema } from '../../service/userServices/userProfile';
interface ManagerListProps {
  allManagers: string[];

}


const ManagerList: React.FC = () => {
  const [managerId, setManagerId] = useState<string>("");
  const [senderId,setSenderId]=useState('');
  const [allManagers, setAllManagers] = useState<string[]>([]);

  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<{ message: string; timestamp: string }[]>([]);
    const userId=localStorage.getItem('userId');
    useEffect(() => {
        const fetchManagerNames = async () => {
          if (!userId) return;
          try {
            const result = await getManagerNames(userId);
            console.log("Fetched manager names:", result); // Debugging log
      
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
          console.log("Chat Schema Response:", result.data.data);
      
          if (result?.data?.data?.managerId) {
            setManagerId(result.data?.data?.managerId);
            setSenderId(result?.data?.data.conversation?.participants[0])
            setSelectedManager(manager);
            setAllMessages(
              result.data.data.allMessages.map((msg: any) => ({
                message: msg.message,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              })) || []
            );
            
            
          } else {
            console.error("Manager ID not found in response", result);
          }
        } catch (error) {
          console.error("Error creating chat schema:", error);
        }
      };
  return (
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
  );
};

export default ManagerList;
