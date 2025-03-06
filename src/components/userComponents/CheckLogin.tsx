import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};

const CheckLoginUser: React.FC<PrivateRouteProps> = ({ children }) => {
    console.log("Get In");
    
    const isUserLoggedIn = localStorage.getItem('userAuth');
    console.log(isUserLoggedIn);
    
    return isUserLoggedIn ? <Navigate to='/home' /> : <>{children}</>;
};

export default CheckLoginUser;
