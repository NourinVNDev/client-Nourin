import { Link } from "react-router-dom";
import person from '../../assets/person.png';
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootState } from "../../../App/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaBell } from 'react-icons/fa'
import useSocket from "../../utils/SocketContext";
import { useNavigate } from "react-router-dom";
import { fetchNotificationCount } from "../../service/userServices/userProfile";



export default function Header() {
  const [searchParams] = useSearchParams();
  const navigate=useNavigate();
  const location = useLocation();
  const categories = searchParams.get('categories')?.split(',') || [];
  console.log(categories);
  const user = useSelector((state: RootState) => state.user);
  const { profilePhoto = "" } = user;
  const { profileData = {} } = location.state || {}; // Default profile data
  const [selectedImage, setSelectedImage] = useState<string>(profilePhoto || profileData.profilePicture || "");
  const [notificationCount, setNotificationCount] = useState(0);

  const { socket } = useSocket();



  useEffect(()=>{
    const fetchNotificationData=async()=>{
      if(user._id){
      const result=await fetchNotificationCount(user._id);
      console.log("Result:",result);
      setNotificationCount(result.data)
      
      }

    }
    fetchNotificationData();
  },[])

  useEffect(() => {
    if (profilePhoto) {
      setSelectedImage(profilePhoto);
    }

  }, [profilePhoto])


  const  handleNotification=()=>{
    navigate('/notifications')

  }


  useEffect(()=>{
    if(!socket)return;
    const messageListener = ({heading,message,count}: { heading: string; message: string; count:number}) => {
      console.log("Hai");
      
      console.log("Count",heading,message,count);
      
      setNotificationCount(count);
    }
 
   
    
      socket.on('new-notification',messageListener);
    

  },[socket])
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/home" className="text-3xl font-extrabold text-white tracking-wide hover:text-blue-300 transition-all duration-300">
          MeetCraft
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link to="/getAllEvents" className="text-white text-lg font-medium hover:text-yellow-400 transition-all duration-300">
                Events
              </Link>
            </li>
            <li>
              <Link to="/home" className="text-white text-lg font-medium hover:text-yellow-400 transition-all duration-300">
                Home
              </Link>
            </li>

            <li>
              <Link to="/logout" className="text-white text-lg font-medium hover:text-yellow-400 transition-all duration-300">
                Logout
              </Link>
            </li>
            <li>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <FaBell size={24}  onClick={handleNotification}/>
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
            </li>
            <li>
              {/* Profile Image */}
              <Link to='/profile'>
                {selectedImage ? (
                  <img
                    src={selectedImage} // Replace with your profile image path
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white hover:border-yellow-400 transition-all duration-300"
                  />) : (<img
                    src={person} // Replace with your profile image path
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white hover:border-yellow-400 transition-all duration-300"
                  />)}</Link>


            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}



