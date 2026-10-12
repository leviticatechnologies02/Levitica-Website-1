import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const DashboardIndex = () => {
  const role = useSelector((state) => state.auth.user?.role);

  if (role === "admin" || role === "superadmin") {
    return <Navigate to="admin" replace />;
  }

  if (role === "mentor") {
    return <Navigate to="mentor" replace />;
  }

  return <Navigate to="student" replace />;
};

export default DashboardIndex;
