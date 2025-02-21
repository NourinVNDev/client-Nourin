import Register from "../pages/userPages/Register";
import Login from "../pages/userPages/Login";
import  HomePage from '../pages/userPages/HomePage';
import ManagerRegister from '../pages/managerPages/MRegister';
import MLogin from '../pages/managerPages/mLogin';
import DashBoard from "../pages/managerPages/DashBoard";
import Adminlogin from "../pages/adminPages/Adminlogin";
import Adminhome from "../pages/adminPages/Adminhome";
import ForgotPassword from '../pages/userPages/ForgotPassword';
import OtpPage from "../pages/userPages/OtpPage";
import ResetPassword from "../pages/userPages/ResetPassword";
import Profile from '../pages/userPages/Profile'
import ForgotPasswordM from "../pages/managerPages/ForgotPasswordM";
import ManagerOtpPage from "../pages/managerPages/ManagerOtpPage";
import ManagerProfile from "../pages/managerPages/ManagerProfile";
import AdminUser from "../pages/adminPages/AdminUser";
import AdminManager from "../pages/adminPages/AdminManager";
import ManagerEvents from "../pages/managerPages/ManagerEvents";
import AdminCategory from "../pages/adminPages/AdminCategory";
import AdminAddCategory from "../pages/adminPages/AdminAddCategory";
import Logout from "../pages/userPages/Logout";
import ManagerLogout from "../pages/managerPages/managerLogout";
import AdminLogout from "../pages/adminPages/AdminLogout";
import CategoryBasedData from "../pages/userPages/CategoryBasedData";
import PrivateRoute from "../components/userComponents/PrivateRoute";
import ManagerPrivateRoute from "../components/managerComponents/ManagerPrivateRoute";
import AdminPrivateRoute from "../components/adminComponents/AdminPrivateRoute";
import ManagerOffers from "../pages/managerPages/ManagerOffer";
import ManagerAddOffer from "../pages/managerPages/ManagerAddOffer";
import ManagerAllEvents from "../pages/managerPages/ManagerAllEvents";
import ResetPasswordALogin from "../pages/userPages/ResetPasswordALogin";
import SinglePostDetails from "../pages/userPages/SinglePostDetails";
import EventDetails from "../pages/userPages/EventDetails";
import PaymentSuccess from "../pages/userPages/PaymentSuccess";
import PaymentCancel from "../pages/userPages/PaymentCancel";
import ManagerEditSelectedEvents from '../pages/managerPages/ManagerEditSelectedEvent' 
import ManagerEditOffer from "../pages/managerPages/ManagerEditOffer";
import UserChat from "../pages/userPages/UserChat";
import EventHistory from "../pages/userPages/EventHistory";
import EventBooking from "../pages/userPages/EventBooking";
import TodaysRequest from "../pages/managerPages/TodaysRequest";
import TotalBooking from "../pages/managerPages/TotalBooking";
import EntryHome from "../pages/userPages/EntryHome";
import AdminEditCategory from "../pages/adminPages/AdminEditCategory";
interface RouteConfig {
    path: string;
    element: React.ReactNode;
  }
  const Approutes: RouteConfig[] = [
    { path: '/', element: <EntryHome/>},
    {path:'/login',element:<Login/>},
    {path :'/register',element:<Register/>},
    {path:'/home',element:<PrivateRoute><HomePage/></PrivateRoute>},
    {path:'/forgot-password',element:<ForgotPassword/>},
    {path:'/otpPage/:email',element:<OtpPage/>},
    {path:'/reset-password/:email',element:<ResetPassword/>},
    {path:'/profile',element:<PrivateRoute><Profile/></PrivateRoute>},
    {path:'/logout',element:<Logout></Logout>},
    {path:'/user/categoryBasedData/:id',element:<PrivateRoute><CategoryBasedData/></PrivateRoute>},
    {path:'/user/resetPassword',element:<PrivateRoute><ResetPasswordALogin/></PrivateRoute>},
    {path:'/singlePostDetails',element:<PrivateRoute><SinglePostDetails/></PrivateRoute>},
    {path:'/checkEventDetails/:id',element:<PrivateRoute><EventDetails/></PrivateRoute>},
    {path:'/payment-success',element:<PrivateRoute><PaymentSuccess/></PrivateRoute>},
    {path:'/payment-cancel/:bookedId',element:<PrivateRoute><PaymentCancel/></PrivateRoute>},
    {path:'/event-history',element:<PrivateRoute><EventHistory/></PrivateRoute>},
    {path:'/user/chat',element:<PrivateRoute><UserChat/></PrivateRoute>},
    {path:'/user/bookedEvent',element:<PrivateRoute><EventBooking/></PrivateRoute>},

    //for Managers
    {path:'/mLogin',element:<MLogin />},
    {path:'/mRegister',element:<ManagerRegister />},
    {path:'/Manager/dashboard',element:<ManagerPrivateRoute><DashBoard/></ManagerPrivateRoute>},
    {path:'/forgot-passwordM',element:<ForgotPasswordM/>},
    {path:'/managerOtpPage/:email',element:<ManagerOtpPage/>},
    {path:'/Manager/profile/:companyName',element:<ManagerPrivateRoute><ManagerProfile/></ManagerPrivateRoute>},
    {path:'/Manager/events',element:<ManagerPrivateRoute><ManagerAllEvents/></ManagerPrivateRoute>},
    {path:'/Manager/addNewEvent',element:<ManagerPrivateRoute><ManagerEvents/></ManagerPrivateRoute>},
    {path:'/Manager/offer',element:<ManagerPrivateRoute><ManagerOffers/></ManagerPrivateRoute>},
    {path:'/Manager/addOffer',element:<ManagerPrivateRoute><ManagerAddOffer/></ManagerPrivateRoute>},
    {path:'/editOfferDetails/:offerId',element:<ManagerPrivateRoute><ManagerEditOffer/></ManagerPrivateRoute>},
    {path:'/managerLogout',element:<ManagerLogout/>},
    {path:'/editEventDetails/:id',element:<ManagerPrivateRoute><ManagerEditSelectedEvents/></ManagerPrivateRoute>},
    {path:'/manager/latestRequest',element:<ManagerPrivateRoute><TodaysRequest/></ManagerPrivateRoute>},
    {path:'/manager/futureBooking',element:<ManagerPrivateRoute><TotalBooking/></ManagerPrivateRoute>},





    //for Admin
    {path:'/adminlogin',element:<Adminlogin/>},
    {path:'/admin/dashboard',element:<AdminPrivateRoute><Adminhome/></AdminPrivateRoute>},
    {path:'/admin/users',element:<AdminPrivateRoute><AdminUser/></AdminPrivateRoute>},
    {path:'/admin/managers',element:<AdminPrivateRoute><AdminManager/></AdminPrivateRoute>},
    {path:'/admin/category',element:<AdminPrivateRoute><AdminCategory/></AdminPrivateRoute>},
    {path:'/admin/editCategory/:id',element:<AdminPrivateRoute><AdminEditCategory/></AdminPrivateRoute>},
    {path:'/admin/addEvents',element:<AdminPrivateRoute><AdminAddCategory/></AdminPrivateRoute>},
    {path:'/adminLogout',element:<AdminLogout/>}

  ];    
export default Approutes;