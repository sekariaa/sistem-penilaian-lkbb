"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Test from "@/components/Test";
import { Sidebar } from "@/components/sidebar/Sidebar";

const page = () => {
  return (
    <ProtectedRoute>
      <Sidebar />
      <div className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">
        <Test />
      </div>
    </ProtectedRoute>
  );
};

export default page;
