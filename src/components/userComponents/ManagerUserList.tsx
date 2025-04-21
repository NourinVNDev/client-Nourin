import { useEffect, useState } from "react";
import useSocket from "../../utils/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { time } from "console";


interface ManagerListProps {
  managers: string[];
  events: string[];
  onSelectManager: (manager: string,event:string) => void;
  person: string;
  messages: { message: string; time: string ,readCount:number}[];
  setMessages:React.Dispatch<React.SetStateAction<{ message: string; time: string; readCount:number}[]>>
  chatIds:string[]


}

const ManagerUserList = ({ managers, events, onSelectManager,messages, person ,chatIds,setMessages}: ManagerListProps) => {
  const {socket}=useSocket();
  const  userId=useSelector((state:RootState)=>state.user._id);
  const managerId=useSelector((state:RootState)=>state.manager._id);
  const senderId=userId||managerId;

  const [count,messageCount]=useState(0);
useEffect(()=>{
  if(!socket)return;
  socket.emit('new-badge',senderId,(response:any)=>{
    console.log("Data",response);
  })

},[socket])

  return (
    <div className="w-1/3 bg-gray-200 text-black min-h-screen p-4 border-r">
      <h2 className="text-xl font-bold mb-4">{person}</h2>
      <ul className=" overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-2 px-4 py-2">
      {managers.length > 0 && events.length > 0 && chatIds.length > 0 ? (
  chatIds.map((chatId, index) => (
    <li
      key={chatId}
      className="border border-gray-200 cursor-pointer transition-all duration-200"
      onClick={() => {
        localStorage.setItem("chatId", chatId);
        onSelectManager(managers[index], events[index]);
        setMessages(prevMessages =>
          prevMessages.map(msg => ({
            ...msg,
            readCount: 0,
          }))
        );
        
      }}
    >
      <div className="text-gray-700 font-medium">
        {events[index]||managers[index]}
      </div>
      <div className="mt-1 flex justify-between text-[15px] text-gray-500 italic truncate">
        <span>{messages[index]?.message || ""}</span>
        <span>{messages[index]?.readCount}</span>
        <span className="ml-2">{messages[index]?.time || ""}</span>
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
