import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { clearVerifierDetails } from "../../../Features/verifierSlice";
import { persistor } from "../../../App/store";
import { useEffect } from "react";
const VerifierLogout=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
        Cookies.remove('verifierAccessToken');
        Cookies.remove('verifierRefreshToken');
        localStorage.removeItem('verifierAuth');
        dispatch(clearVerifierDetails());
        persistor.purge();
        navigate('/verifier/login');

    },[navigate])
    return(
        <div>

        </div>
    )

}

export default VerifierLogout;