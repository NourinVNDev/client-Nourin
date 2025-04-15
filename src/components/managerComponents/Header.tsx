import React,{useState,useEffect} from "react"
import { Link } from "react-router-dom";
import { FaBell } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import useSocket from "../../utils/SocketContext";

const Header:React.FC=()=>{
    const {socket}=useSocket();
    const navigate=useNavigate();
      const [notificationCount, setNotificationCount] = useState(0);
      const  handleNotification=()=>{
        navigate('/Manager/notification')
    
      }
      useEffect(() => {

        if (!socket) return;
        const messageData = ({ senderId, message }: { senderId: string; message: string; }) => {
            console.log("Hellom");
            
          setNotificationCount(prevCount => prevCount + 1);

          console.log("black", senderId, message);
    
        };
    
        socket.on("receive-notification-message", messageData);
    
        return () => {
          socket.off("receive-notification-message", messageData);
        };
      }, [socket])
      return (
        <div>
          {/* Header */}
          <header className="bg-blue-500 text-white flex items-center justify-between px-12 py-8 shadow-md w-full h-24 md:h-28 lg:h-32">
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