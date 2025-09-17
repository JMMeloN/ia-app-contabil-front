import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import Loading from "../components/loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/sign-in" />
  }

  return <>{children}</>
};

export default PrivateRoute;
