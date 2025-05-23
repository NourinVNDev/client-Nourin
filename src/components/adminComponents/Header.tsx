import React from "react"
import { Link } from "react-router-dom";
const Header:React.FC=()=>{
    return(
        <div>
      
        {/* Header */}
        <header className="bg-gray-500 text-white flex items-center justify-between px-12 py-8 shadow-md w-full h-24 md:h-20 lg:h-25">
          <h1 className="text-2xl font-bold">MeetCraft</h1>
          <Link to='/adminLogout'><button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md text-sm shadow-md transition duration-200">
            Logout
          </button></Link>
        </header>
        </div>
       
    )
}
export default Header;