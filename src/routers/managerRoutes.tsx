import MLogin from '../pages/managerPages/mLogin';
import ManagerRegister from '../pages/managerPages/MRegister';
import DashBoard from "../pages/managerPages/DashBoard";
import ForgotPasswordM from "../pages/managerPages/ForgotPasswordM";
import ManagerOtpPage from "../pages/managerPages/ManagerOtpPage";
import ManagerProfile from "../pages/managerPages/ManagerProfile";
import ManagerEvents from "../pages/managerPages/ManagerEvents";
import ManagerPrivateRoute from "../components/managerComponents/ManagerPrivateRoute";
import ManagerOffers from "../pages/managerPages/ManagerOffer";
import ManagerAddOffer from "../pages/managerPages/ManagerAddOffer";
import ManagerAllEvents from "../pages/managerPages/ManagerAllEvents";
import ManagerEditSelectedEvents from '../pages/managerPages/ManagerEditSelectedEvent';
import ManagerEditOffer from "../pages/managerPages/ManagerEditOffer";
import ManagerLogout from "../pages/managerPages/managerLogout";
import TodaysRequest from "../pages/managerPages/TodaysRequest";
import TotalBooking from "../pages/managerPages/TotalBooking";
import ManagerChat from "../pages/managerPages/ManagerChat";
import ManagerEvents2 from "../pages/managerPages/ManagerEvents2";
import ListVerifier from '../pages/managerPages/ListVerifier';
import ManagerWallet from '../pages/managerPages/ManagerWallet';
import CheckLoginManager from '../components/managerComponents/CheckLoginManager';
import AddNewVerifier from '../pages/managerPages/AddNewVerifier';
import Manager2Page from '../pages/managerPages/Manager2page';
import ManagerEditVerifier from '../pages/managerPages/ManagerEditVerifier';
import ManagerResetPassword from '../pages/managerPages/ManagerResetPassword';
import ManagerNotification from '../pages/managerPages/ManagerNotification';
import VideoCall from '../components/userComponents/VideoCall';

const managerRoutes = [
    { path: '/mLogin', element: <CheckLoginManager><MLogin /></CheckLoginManager> },
    { path: '/mRegister', element: <ManagerRegister /> },
    { path: '/Manager/dashboard', element: <ManagerPrivateRoute><DashBoard /></ManagerPrivateRoute> },
    { path: '/forgot-passwordM', element: <ForgotPasswordM /> },
    {path:'/manager/Reset-password/:email',element:<ManagerResetPassword/>},
    { path: '/managerOtpPage/:email', element: <ManagerOtpPage /> },
    { path: '/Manager/profile/:companyName', element: <ManagerPrivateRoute><ManagerProfile /></ManagerPrivateRoute> },
    { path: '/Manager/events', element: <ManagerPrivateRoute><ManagerAllEvents /></ManagerPrivateRoute> },
    { path: '/Manager/addNewEvent', element: <ManagerPrivateRoute><ManagerEvents /></ManagerPrivateRoute> },
    { path: '/Manager/addNewEvent2/:eventId', element: <ManagerPrivateRoute><ManagerEvents2 /></ManagerPrivateRoute> },
    { path: '/Manager/offer', element: <ManagerPrivateRoute><ManagerOffers /></ManagerPrivateRoute> },
    { path: '/Manager/addOffer', element: <ManagerPrivateRoute><ManagerAddOffer /></ManagerPrivateRoute> },
    { path: '/editOfferDetails/:offerId', element: <ManagerPrivateRoute><ManagerEditOffer /></ManagerPrivateRoute> },
    { path: '/editEventDetails/:id', element: <ManagerPrivateRoute><ManagerEditSelectedEvents /></ManagerPrivateRoute> },
    { path: '/manager/latestRequest', element: <ManagerPrivateRoute><TodaysRequest /></ManagerPrivateRoute> },
    { path: '/manager/futureBooking', element: <ManagerPrivateRoute><TotalBooking /></ManagerPrivateRoute> },
    {path:'/manager/verifier',element:<ManagerPrivateRoute><ListVerifier/></ManagerPrivateRoute>},
    { path: '/manager/chat', element: <ManagerPrivateRoute><ManagerChat /></ManagerPrivateRoute> },
    {path:'/manager/wallet',element:<ManagerPrivateRoute><ManagerWallet/></ManagerPrivateRoute>},
    {path:'/Manager/addNewVerifier',element:<ManagerPrivateRoute><AddNewVerifier/></ManagerPrivateRoute>},
    {path:'/Manager/update2Page/:id',element:<ManagerPrivateRoute><Manager2Page/></ManagerPrivateRoute>},
    {path:'/Manager/editVerifier/:verifierId',element:<ManagerPrivateRoute><ManagerEditVerifier/></ManagerPrivateRoute>},
    {path:'/Manager/notification' ,element:<ManagerPrivateRoute><ManagerNotification/></ManagerPrivateRoute>},
    {path:'/room/:roomId',element:<ManagerPrivateRoute><VideoCall/></ManagerPrivateRoute>},
    { path: '/managerLogout', element: <ManagerLogout /> },
];

export default managerRoutes;
