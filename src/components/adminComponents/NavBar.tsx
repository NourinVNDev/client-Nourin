import React from "react";
import { Link } from "react-router-dom";

const NavBar:React.FC=()=>{

    return(
    <aside className="bg-blue-100 w-1/5 p-4 space-y-6 h-full">
    <div className="font-bold text-lg text-black">Admin   Dashboard</div>
    <ul className="space-y-4">
      <Link  to="/admin/dashboard" className="block hover:bg-blue-200 rounded p-2 text-black">
        Dashboard
      </Link>
      <Link to='/admin/users' className="block hover:bg-blue-200 rounded p-2 text-black">
       Users
      </Link>
      <Link to="/admin/managers" className="block hover:bg-blue-200 rounded p-2 text-black">
     Managers
      </Link>
      <Link to="/admin/category" className="block hover:bg-blue-200 rounded p-2 text-black">
      Categories
      </Link>
      <Link to="/admin/offer" className="block hover:bg-blue-200 rounded p-2 text-black">
      Offers
      </Link>
   
      {/* <Link to="/request" className="block hover:bg-blue-200 rounded p-2 text-black">
        Request
      </Link> */}
      <Link to="/admin/wallet" className="block hover:bg-blue-200 rounded p-2 text-black">
        Wallet
      </Link>
    </ul>
    <Link to='/adminLogout'>
    <div className="mt-4 text-red-500 cursor-pointer">Logout</div>
    </Link>
  </aside>

  
       
    )


}
export default NavBar;