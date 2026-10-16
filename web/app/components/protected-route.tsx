import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/auth-context";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
  });

  return <Outlet />;
}
