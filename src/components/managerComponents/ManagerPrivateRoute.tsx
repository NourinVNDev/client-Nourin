

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};
const ManagerPrivateRoute:React.FC<PrivateRouteProps>=({children})=>{
  const isUserAuthenticate = localStorage.getItem('managerAuth') === 'true';

  return isUserAuthenticate ? <>{children}</> : <Navigate to="/mLogin" />;
}
export default ManagerPrivateRoute;