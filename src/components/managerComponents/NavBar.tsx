import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
const NavBar:React.FC=()=>{
  const managerDetails=useSelector((state:RootState)=>state.manager);
  const companyName=useSelector((state:RootState)=>state.manager.companyName);
    return(
    

       
    <aside className="bg-blue-100 w-1/5 p-4 space-y-6 h-full">
    <div className="font-bold text-lg text-black">{managerDetails.companyName}</div>
    <ul className="space-y-4">
      <Link to="/Manager/dashboard" className="block hover:bg-blue-200 rounded p-2 text-black">
        Dashboard
      </Link>
      <Link to={`/Manager/profile/${companyName}`} className="block hover:bg-blue-200 rounded p-2 text-black">
        Profile
      </Link>
      <Link to="/Manager/events" className="block hover:bg-blue-200 rounded p-2 text-black">
        Events
      </Link>
      <Link to="/manager/futureBooking" className="block hover:bg-blue-200 rounded p-2 text-black">
        Booking
      </Link>
      <Link to="/Manager/offer" className="block hover:bg-blue-200 rounded p-2 text-black">
        Offer
      </Link>
      <Link to="/manager/latestRequest" className="block hover:bg-blue-200 rounded p-2 text-black">
        Request
      </Link>
      <Link to="/chat" className="block hover:bg-blue-200 rounded p-2 text-black">
        Chat
      </Link>
    </ul>
    <Link to='/managerLogout'>
    <div className="mt-4 text-red-500 cursor-pointer">Logout</div>
    </Link>
  </aside>

  
       
    )


}
export default NavBar;