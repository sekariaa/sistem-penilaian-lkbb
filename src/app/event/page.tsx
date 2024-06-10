"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/sidebar/Sidebar";
import Event from "@/components/event/Event";

const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <Sidebar />
        <div className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">
          <Event />
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default page;
