import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

// Protected Route for logged-in users
export const UserProtectedRoute = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  return userInfo ? <Outlet /> : <Navigate to="/user-login" />;
};

// Protected Route for logged-in service providers
export const SpProtectedRoute = () => {
  const spInfo = useSelector((state: RootState) => state.spInfo.spInfo);
  return spInfo ? <Outlet /> : <Navigate to="/sp-login" />;
};

// Protected Route for logged-in admins
export const AdminProtectedRoute = () => {
  const adminInfo = useSelector(
    (state: RootState) => state.adminInfo.adminInfo,
  );
  return adminInfo ? <Outlet /> : <Navigate to="/admin-login" />;
};

// Public Route for users (only accessible when not logged in)
export const PublicUserProtectedRoute = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  return !userInfo ? <Outlet /> : <Navigate to="/user/user-home" />;
};

// Public Route for service providers (only accessible when not logged in)
export const PublicSpProtectedRoute = () => {
  const spInfo = useSelector((state: RootState) => state.spInfo.spInfo);
  return !spInfo ? <Outlet /> : <Navigate to="/sp/sp-home" />;
};

// Public Route for admins (only accessible when not logged in)
export const PublicAdminProtectedRoute = () => {
  const adminInfo = useSelector(
    (state: RootState) => state.adminInfo.adminInfo,
  );
  return !adminInfo ? <Outlet /> : <Navigate to="/admin/dashboard" />;
};
