import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearManagerDetails } from "../../../Features/managerSlice";
import { useDispatch} from "react-redux";
import { persistor } from "../../../App/store";

const ManagerLogout=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
        Cookies.remove('managerToken');
        Cookies.remove('managerRefreshToken');
        localStorage.removeItem('managerAuth');
        dispatch(clearManagerDetails());
        persistor.purge();
        navigate('/mLogin');

    },[navigate])

    return(
        <div>

        </div>
    )
}
export default ManagerLogout;