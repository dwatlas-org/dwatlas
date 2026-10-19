import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/auth-context";
import { useLocation } from "react-router";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/register", { replace: true, state: { from: location } });
      return;
    }
  });

  return <Outlet />;
}
