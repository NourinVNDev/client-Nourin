import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AdminLogout=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        Cookies.remove('adminToken');
        Cookies.remove('adminRefreshToken');
        localStorage.removeItem('adminAuth');
        navigate('/adminlogin');

    },[navigate])
    return(
        <div>

        </div>
    )
}
export default AdminLogout;