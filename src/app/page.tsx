"use client";

import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/auth";
import Home from "@/components/Home";

const Page = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Home user={user} />
    </ProtectedRoute>
  );
};

export default Page;
