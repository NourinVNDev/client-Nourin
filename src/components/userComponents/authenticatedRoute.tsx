import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};

const AuthenticatedUser: React.FC<PrivateRouteProps> = ({ children }) => {
    console.log("Hello from PrivteRoute");
    
    const isUserAuthenticate = localStorage.getItem('userAuth') === 'true';

    return isUserAuthenticate ? <><Navigate to="/home" />;</> :<> {children}</>;
};

export default AuthenticatedUser;