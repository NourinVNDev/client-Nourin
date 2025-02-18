import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Approutes from "./Approutes";
interface RouteConfig {
    path: string;
    element: React.ReactNode;
  }

const MainRouter:React.FC=()=>{
    return(
        <div>
            <Router>
           <Routes>
            {Approutes.map((route:RouteConfig)=>{
                return(
                    <Route 
                    key={route.path} 
                    path={route.path} 
                    element={route.element}
                    />

                )
             
            })}
           </Routes>

            </Router>
        </div>
    )
}
export default MainRouter;