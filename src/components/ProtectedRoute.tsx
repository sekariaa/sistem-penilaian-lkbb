import React, { useEffect } from "react";
import { useAuth } from "../context/auth";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress style={{ color: "#151c24" }} />
      </div>
    );
  }

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
