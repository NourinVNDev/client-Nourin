import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";

type PrivateRouteProps = {
    children?: ReactNode;
};

const CheckLoginVerifier: React.FC<PrivateRouteProps> = ({ children }) => {
    const email=useSelector((state:RootState)=>state.verifier.email)
    console.log("Get In");

    const isVerifierLoggedIn = localStorage.getItem('verifierAuth');
    console.log(isVerifierLoggedIn);

    // Make sure to return immediately if manager is logged in
    if (isVerifierLoggedIn) {
        return <Navigate to={`/verifier/listAllEvents/${email}`} />;
    }

    return <>{children}</>;
};

export default CheckLoginVerifier;
