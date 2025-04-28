
import useSocket from "../../utils/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";

import { ManagerData } from "../../pages/userPages/UserChat";





interface ManagerListProps {
  managers: ManagerData[];
  onSelectManager: (manager: string) => void;
  person: string;
  setSelectedEvent: React.Dispatch<React.SetStateAction<string>>;
  // messages: { message: string; time: string; readCount: number }[];
  setMessages: React.Dispatch<React.SetStateAction<{ message: string; time: string; readCount: number }[]>>;
  
}

const ManagerUserList = ({ managers, onSelectManager, person, setMessages,setSelectedEvent}: ManagerListProps) => {
  const { socket } = useSocket();
  const userId = useSelector((state: RootState) => state.user._id);
  const managerId = useSelector((state: RootState) => state.manager._id);
  const senderId = userId || managerId;

  // const [count, messageCount] = useState(0);
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit('new-badge', senderId, (response: any) => {
  //     console.log("Data", response);
  //   })

  // }, [socket])



  return (
    <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
      <h2 className="text-xl font-bold mb-4">{person}</h2>
      <ul className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-2 px-4 py-2">
  {managers.length > 0 ? (
    managers.map((chat, index) => (
      <li
        key={chat.chatId}
        className="border border-gray-200 p-4 cursor-pointer transition-all duration-200"
        onClick={() => {
          localStorage.setItem("chatId", chat.chatId);
          // Use first event if available, or fallback to companyName (or chatId)
          const selectedEvent = chat.events?.[0]||chat.companyName;
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
        <div className="mt-1 flex justify-between text-[15px] text-gray-500 italic truncate">
          <span>{chat?.lastMessage?.message || "No message"}</span>
          <span className="ml-2">
            {chat?.lastMessage?.time?chat?.lastMessage.time:""}
          </span>
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
