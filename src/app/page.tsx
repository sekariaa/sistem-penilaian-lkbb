"use client";

import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/auth";
import Home from "@/components/Home";
import { Sidebar } from "@/components/sidebar/Sidebar";

const Page = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Sidebar />
      <div className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">
        <Home user={user} />
      </div>
    </ProtectedRoute>
  );
};

export default Page;
