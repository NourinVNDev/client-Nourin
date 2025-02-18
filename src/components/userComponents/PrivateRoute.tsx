import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    console.log("Hello from PrivteRoute");
    
    const isUserAuthenticate = localStorage.getItem('userAuth') === 'true';

    return isUserAuthenticate ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
