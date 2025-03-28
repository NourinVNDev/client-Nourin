import Adminlogin from "../pages/adminPages/Adminlogin";
import Adminhome from "../pages/adminPages/Adminhome";
import AdminUser from "../pages/adminPages/AdminUser";
import AdminManager from "../pages/adminPages/AdminManager";
import AdminCategory from "../pages/adminPages/AdminCategory";
import AdminAddCategory from "../pages/adminPages/AdminAddCategory";
import AdminLogout from "../pages/adminPages/AdminLogout";
import AdminPrivateRoute from "../components/adminComponents/AdminPrivateRoute";
import AdminEditCategory from "../pages/adminPages/AdminEditCategory";
import AdminWallet from "../pages/adminPages/AdminWallet";

const adminRoutes = [
    { path: '/adminlogin', element: <Adminlogin /> },
    { path: '/admin/dashboard', element: <AdminPrivateRoute><Adminhome /></AdminPrivateRoute> },
    { path: '/admin/users', element: <AdminPrivateRoute><AdminUser /></AdminPrivateRoute> },
    { path: '/admin/managers', element: <AdminPrivateRoute><AdminManager /></AdminPrivateRoute> },
    { path: '/admin/category', element: <AdminPrivateRoute><AdminCategory /></AdminPrivateRoute> },
    {path:  '/admin/wallet',element:<AdminPrivateRoute><AdminWallet/></AdminPrivateRoute>},
    { path: '/admin/editCategory/:id', element: <AdminPrivateRoute><AdminEditCategory /></AdminPrivateRoute> },
    { path: '/admin/addEvents', element: <AdminPrivateRoute><AdminAddCategory /></AdminPrivateRoute> },
    { path: '/adminLogout', element: <AdminLogout /> },
];

export default adminRoutes;
