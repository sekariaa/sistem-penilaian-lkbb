"use client";
import React, { useEffect } from "react";
import { getParticipants } from "@/utils/participant";
import Button from "./rekap-juri/ButtonComponent";

const Test = () => {
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventId = "0vI9yhK1EVIHPqhgg1Ms";
        const event = await getParticipants(eventId);
        console.log("Event data:", event);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventData();
  }, []);
  return (
    <div>
      {/* Test Page{" "} */}
      <div className="mt-10">
        <Button intent="Hapus"></Button>
      </div>
    </div>
  );
};

export default Test;
