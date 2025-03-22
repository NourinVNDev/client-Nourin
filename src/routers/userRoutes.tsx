import Register from "../pages/userPages/Register";
import Login from "../pages/userPages/Login";
import HomePage from '../pages/userPages/HomePage';
import ForgotPassword from '../pages/userPages/ForgotPassword';
import OtpPage from "../pages/userPages/OtpPage";
import ResetPassword from "../pages/userPages/ResetPassword";
import Profile from '../pages/userPages/Profile';
import Logout from "../pages/userPages/Logout";
import CategoryBasedData from "../pages/userPages/CategoryBasedData";
import PrivateRoute from "../components/userComponents/PrivateRoute";
import ResetPasswordALogin from "../pages/userPages/ResetPasswordALogin";
import SinglePostDetails from "../pages/userPages/SinglePostDetails";
import EventDetails from "../pages/userPages/EventDetails";
import PaymentSuccess from "../pages/userPages/PaymentSuccess";
import PaymentCancel from "../pages/userPages/PaymentCancel";
import UserChat from "../pages/userPages/UserChat";
import EventHistory from "../pages/userPages/EventHistory";
import EventBooking from "../pages/userPages/EventBooking";
import EntryHome from "../pages/userPages/EntryHome";
import AllEventData from "../pages/userPages/AllEventData";
import CheckLoginUser from "../components/userComponents/CheckLogin";
import UserWallet from "../pages/userPages/UserWallet";

const userRoutes = [
    { path: '/', element: <EntryHome /> },
    { path: '/login', element: <CheckLoginUser><Login /></CheckLoginUser> },
    { path: '/register', element: <Register /> },
    { path: '/home', element: <PrivateRoute><HomePage /></PrivateRoute> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/otpPage/:email', element: <OtpPage /> },
    { path: '/reset-password/:email', element: <ResetPassword /> },
    { path: '/profile', element: <PrivateRoute><Profile /></PrivateRoute> },
    { path: '/logout', element: <Logout /> },
    { path: '/getAllEvents', element: <PrivateRoute><AllEventData /></PrivateRoute> },
    { path: '/user/categoryBasedData/:id', element: <PrivateRoute><CategoryBasedData /></PrivateRoute> },
    { path: '/user/resetPassword', element: <PrivateRoute><ResetPasswordALogin /></PrivateRoute> },
    { path: '/singlePostDetails', element: <PrivateRoute><SinglePostDetails /></PrivateRoute> },
    { path: '/checkEventDetails/:id/:selectedType', element: <PrivateRoute><EventDetails /></PrivateRoute> },
    { path: '/payment-success/:managerId', element: <PrivateRoute><PaymentSuccess /></PrivateRoute> },
    { path: '/payment-cancel/:bookedId', element: <PrivateRoute><PaymentCancel /></PrivateRoute> },
    { path: '/event-history', element: <PrivateRoute><EventHistory /></PrivateRoute> },
    { path: '/user/chat', element: <PrivateRoute><UserChat /></PrivateRoute> },
    { path: '/user/bookedEvent', element: <PrivateRoute><EventBooking /></PrivateRoute> },
    {path:  '/user/wallet', element: <PrivateRoute><UserWallet/></PrivateRoute>}
];

export default userRoutes;
