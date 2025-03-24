import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};

const CheckLoginManager: React.FC<PrivateRouteProps> = ({ children }) => {
    console.log("Get In");

    const isManagerLoggedIn = localStorage.getItem('managerAuth');
    console.log(isManagerLoggedIn);

    // Make sure to return immediately if manager is logged in
    if (isManagerLoggedIn) {
        return <Navigate to='/Manager/dashboard' />;
    }

    // Return children if not logged in
    return <>{children}</>;
};

export default CheckLoginManager;
