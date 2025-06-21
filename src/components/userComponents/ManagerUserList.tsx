
import useSocket from "../../utils/SocketContext";
import { ManagerData } from "../../pages/userPages/UserChat";
import { useEffect } from "react";





interface ManagerListProps {
  managers: ManagerData[];
  onSelectManager: (manager: string) => void;
  person: string;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<React.SetStateAction<{ message: string; time: string; readCount: number }[]>>;
    setAllManagers: React.Dispatch<React.SetStateAction<ManagerData[]>>;

}

const ManagerUserList = ({ managers, onSelectManager, person, setMessages, setSelectedEvent,setAllManagers }: ManagerListProps) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
  
    const handleNewBadge = (chatData: string) => {
      console.log("Calm", chatData);
  
      if (localStorage.getItem('chatId') !== chatData) {
        console.log("saaam");
        
        setAllManagers(prev =>
          prev.map(manager => {
            console.log("earn",manager.chatId);
            return manager.chatId === chatData
              ? { ...manager, unreadCount: (manager.unreadCount || 0) + 1 }
              : manager;
          })
        );
      }
    };
  
    socket.on('new-badge', handleNewBadge);
  
    // Clean up the socket listener on unmount
    return () => {
      socket.off('new-badge', handleNewBadge);
    };
  }, [socket]);


  



  return (
    <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
      <h2 className="text-xl font-bold mb-4">{person}</h2>
      <ul className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-2 px-4 py-2">
        {managers.length > 0 ? (
          managers.map((chat,_) => (
            <li
              key={chat.chatId}
              className="border border-gray-200 p-4 cursor-pointer transition-all duration-200"
              onClick={() => {
                localStorage.setItem("chatId", chat.chatId);
                const selectedEvent = chat.events?.[0] || chat.companyName;
                setSelectedEvent(selectedEvent);
                onSelectManager(chat.companyName);

                setMessages(prevMessages =>
                  prevMessages.map(msg => ({
                    ...msg,
                    readCount: 0,
                  }))
                );
              }}
            >
              <div className="text-gray-700 font-medium">
                {chat.events?.[0] || chat.companyName}
              </div>
              <div className="mt-1 flex justify-between text-[15px] text-gray-500 italic truncate items-center">
                <span className="truncate">{chat?.lastMessage?.message || "No message"}</span>
                <div className="flex items-center gap-2">
                  <span>{chat?.lastMessage?.time || ""}</span>

                  {chat?.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No managers or events found.</p>
        )}
      </ul>

    </div>
  );
};

export default ManagerUserList;
