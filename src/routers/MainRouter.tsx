import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import userRoutes from "./userRoutes";
import managerRoutes from "./managerRoutes";
import adminRoutes from "./adminRoutes";
import verifierRoutes from "./verifierRoutes";


const MainRouter:React.FC=()=>{
    const allRoutes = [...userRoutes, ...managerRoutes, ...adminRoutes,...verifierRoutes];
    return(
        <div>
            <Router>
           <Routes>
           {allRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
           </Routes>

            </Router>
        </div>
    )
}
export default MainRouter;