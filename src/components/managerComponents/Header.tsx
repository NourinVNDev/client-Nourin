import React,{useState,useEffect} from "react"
import { FaBell } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import useSocket from "../../utils/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { fetchManagerNotificationCount } from "../../service/managerServices/handleNotification";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

type HeaderProps = {
  setIsFetch?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({ setIsFetch }) => {
    const {socket}=useSocket();
    const navigate=useNavigate();
    const manager=useSelector((state:RootState)=>state.manager._id);
      const [notificationCount, setNotificationCount] = useState(0);
      const location=useLocation();
      const  handleNotification=()=>{
        navigate('/Manager/notification')
    
      }
      useEffect(() => {

        if (!socket) return;
        const messageData = ({ senderId, message,count }: { senderId: string; message: string; count:number}) => {
            console.log("Hellom",count);
          setIsFetch && setIsFetch(prev => !prev);
          if(location.pathname!='/Manager/notification'){
               setNotificationCount(count);
          }
            
       

          console.log("black", senderId, message);
    
        };
        const messageData1=({count}:{count:number})=>{
          console.log("Count caluation",count);
             setIsFetch && setIsFetch(prev => !prev);
          if(location.pathname!='/Manager/notification'){
          setNotificationCount(count);
        }
        }
    
        socket.on("new-notification", messageData);
        socket.on('new-notification1',messageData1)
    
        return () => {
          socket.off("new-notification", messageData);
          socket.off('new-notification1',messageData1);
        };
      }, [socket,notificationCount])
      useEffect(()=>{
        const fetchNotificationData=async()=>{
          if(manager){
          const result=await fetchManagerNotificationCount(manager);
          console.log("Result of Manager:",result);
          setNotificationCount(result.data);
 
          
          }
    
        }
        fetchNotificationData();
      },[notificationCount])
      return (
        <div>
          {/* Header */}
          <header className="bg-blue-500 text-white flex items-center justify-between px-12 py-8 shadow-md w-full h-10 md:h-20 lg:h-30">
            <h1 className="text-2xl font-bold">MeetCraft</h1>
            
            <div className="flex items-center space-x-8">
              <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                <FaBell size={24} onClick={handleNotification} />
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      background: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px',
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </div>
      
              <Link to='/managerLogout'>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md text-sm shadow-md transition duration-200">
                  Logout
                </button>
              </Link>
            </div>
          </header>
        </div>
      );
      
}
export default Header;