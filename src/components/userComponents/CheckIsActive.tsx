import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface RoleObject {
  role: string;
}

interface UserState {
  user: RoleObject | null;
  manager: RoleObject | null;
  admin: RoleObject | null;
  verifier: RoleObject | null;
}

interface CheckIsActiveProps {
  children: ReactNode;
}

const CheckIsActive: React.FC<CheckIsActiveProps> = ({ children }) => {
  
  const user = useSelector((state: UserState) => state.user);
  const manager = useSelector((state: UserState) => state.manager);
  const admin = useSelector((state: UserState) => state.admin);
  const verifier = useSelector((state: UserState) => state.verifier);

  const navigate = useNavigate();

useEffect(() => {
const currentUser =
  (user?.role && user) ||
  (manager?.role && manager) ||
  (admin?.role && admin) ||
  (verifier?.role && verifier);
  console.log("DEBUG: currentUser =", currentUser);

  if (currentUser && currentUser.role) {
    switch (currentUser.role) {
      case 'manager':
        navigate('/Manager/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'verifier':
        const email=localStorage.getItem('email');
        navigate(`/verifier/listAllEvents/${email}`);
        break;
      case 'user':
        navigate('/home');
        break;
      default:
        navigate('/login');
    }
  }
}, [user, manager, admin, verifier, navigate]);


if ((user && user.role) || (manager && manager.role) || (admin && admin.role) || (verifier && verifier.role)) {
  return <div>Loading...</div>;
}

return <>{children}</>
}

export default CheckIsActive
