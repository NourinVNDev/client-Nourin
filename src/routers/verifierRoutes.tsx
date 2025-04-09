
import VerifierLogin from "../pages/verifierPages/VerifierLogin";

import ListAllEvents from "../pages/verifierPages/ListAllEvents";
import ListingBookedEvent from "../pages/verifierPages/ListingBookedEvent";
import CheckLoginVerifier from "../components/verifierComponents/CheckLoginVerifier";
import VerifierLogout from "../pages/verifierPages/VerifierLogout";
import VerifierPrivateRoute from "../components/verifierComponents/VerifierPrivateRoute";
const verifierRoutes=[

    {path:'/verifier/login',element:<CheckLoginVerifier><VerifierLogin/></CheckLoginVerifier>},
    {path:'/verifier/listAllEvents/:email',element:<VerifierPrivateRoute><ListAllEvents/></VerifierPrivateRoute>},
    {path:'/verifier/bookedEventDetails/:eventId',element:<VerifierPrivateRoute><ListingBookedEvent/></VerifierPrivateRoute>},
    {path:'/verifier/logOut',element:<VerifierLogout/>}
    



]

export default verifierRoutes;