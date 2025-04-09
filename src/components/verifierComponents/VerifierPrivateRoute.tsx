import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children?: ReactNode;
};
const VerifierPrivateRoute:React.FC<PrivateRouteProps>=({children})=>{
  const isVerifierAuthenticate = localStorage.getItem('verifierAuth') === 'true';

  return isVerifierAuthenticate ? <>{children}</> : <Navigate to="/verifier/login" />;
}
export default VerifierPrivateRoute;