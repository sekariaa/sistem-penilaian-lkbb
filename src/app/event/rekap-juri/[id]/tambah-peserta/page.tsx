"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/sidebar/Sidebar";
import TambahPeserta from "@/components/rekap-juri/TambahPeserta";

const page = () => {
  return (
    <ProtectedRoute>
      <Sidebar />
      <div className="mx-5 mt-16 sm:ml-[300px] sm:mt-3">
        <TambahPeserta />
      </div>
    </ProtectedRoute>
  );
};

export default page;
