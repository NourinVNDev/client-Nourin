
import VerifierLogin from "../pages/verifierPages/VerifierLogin";
import HomePage from "../pages/verifierPages/HomePage";
import ListAllEvents from "../pages/verifierPages/ListAllEvents";
import ListingBookedEvent from "../pages/verifierPages/ListingBookedEvent";
const verifierRoutes=[

    {path:'/verifier/login',element:<VerifierLogin/>},
    {path:'/verifier/homePage',element:<HomePage/>},
    {path:'/verifier/listAllEvents',element:<ListAllEvents/>},
    {path:'/verifier/bookedEventDetails/:eventId',element:<ListingBookedEvent/>},
    {},



]

export default verifierRoutes;