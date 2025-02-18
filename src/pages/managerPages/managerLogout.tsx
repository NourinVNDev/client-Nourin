import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearManagerDetails } from "../../../Features/managerSlice";
import { useDispatch} from "react-redux";

const ManagerLogout=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
        Cookies.remove('managerToken');
        Cookies.remove('managerRefreshToken');
        localStorage.removeItem('managerAuth');
        navigate('/mLogin');
        dispatch(clearManagerDetails());

    },[navigate])
    return(
        <div>

        </div>
    )

}
export default ManagerLogout;