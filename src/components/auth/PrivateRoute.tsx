import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
