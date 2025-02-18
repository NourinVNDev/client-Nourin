import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};

const AdminPrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isUserAuthenticate = localStorage.getItem('adminAuth') === 'true';

    return isUserAuthenticate ? <>{children}</> : <Navigate to="/adminlogin" />;
};

export default AdminPrivateRoute;