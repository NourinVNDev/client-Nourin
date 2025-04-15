import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { useEffect } from "react";
import { fetchUserNotificaiton } from "../../service/userServices/videoNotification";
const Notification=()=>{
    const userId=useSelector((state:RootState)=>state.user._id);
    useEffect(()=>{
        const fetchNotification=async()=>{
            if(userId){
                const result=await fetchUserNotificaiton(userId);
                console.log("Result:",result);
                
    
            }

        }
     
      
        fetchNotification()
    },[userId]);
    return(
        <div>


        </div>
    )
}
export default Notification;