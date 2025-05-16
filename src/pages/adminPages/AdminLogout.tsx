import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { clearAdminDetails } from "../../../Features/adminSlice";
import { persistor } from "../../../App/store";

const AdminLogout=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.removeItem('adminAuth');
        dispatch(clearAdminDetails());
        persistor.purge();
        navigate('/adminlogin');

    },[navigate])
    return(
        <div>

        </div>
    )
}
export default AdminLogout;