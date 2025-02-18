import { useEffect } from "react";
import { clearUserDetails } from "../../../Features/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout=()=>{
    const  dispatch=useDispatch()
    const navigate=useNavigate();
    useEffect(()=>{
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        dispatch(clearUserDetails());
        localStorage.removeItem('userAuth');
        localStorage.removeItem('userId');
        navigate('/');



    },[navigate]);
    return(
        <div>

        </div>
    )

}
export default Logout;