import React, { useEffect } from "react";
import { useAuth } from "../context/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <div>
        <p>Loading</p>
      </div>
    );
  }

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
