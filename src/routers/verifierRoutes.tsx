
import VerifierLogin from "../pages/verifierPages/VerifierLogin";

import ListAllEvents from "../pages/verifierPages/ListAllEvents";
import ListingBookedEvent from "../pages/verifierPages/ListingBookedEvent";
import CheckLoginVerifier from "../components/verifierComponents/CheckLoginVerifier";
import VerifierLogout from "../pages/verifierPages/VerifierLogout";
import VerifierPrivateRoute from "../components/verifierComponents/VerifierPrivateRoute";
import CheckIsActive from "../components/userComponents/CheckIsActive";
import SingleUserInfo from "../pages/verifierPages/SingleUserInfo";
const verifierRoutes=[

    {path:'/verifier/login',element: <CheckIsActive><CheckLoginVerifier><VerifierLogin/></CheckLoginVerifier></CheckIsActive> },
    {path:'/verifier/listAllEvents/:email',element:<VerifierPrivateRoute><ListAllEvents/></VerifierPrivateRoute>},
    {path:'/verifier/bookedEventDetails/:eventId',element:<VerifierPrivateRoute><ListingBookedEvent/></VerifierPrivateRoute>},
    {path:'fetchSingleBookedUser/:bookedId/:userName',element:<VerifierPrivateRoute><SingleUserInfo/></VerifierPrivateRoute>},
    {path:'/verifier/logOut',element:<VerifierLogout/>}
    



]

export default verifierRoutes;