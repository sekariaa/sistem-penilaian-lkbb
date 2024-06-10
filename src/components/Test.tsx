"use client";
import React, { useEffect } from "react";
import { getEvent } from "@/utils/event";

const Test = () => {
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventId = "0vI9yhK1EVIHPqhgg1Ms";
        const event = await getEvent(eventId);
        console.log("Event data:", event);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventData();
  }, []);
  return <div>Test Page</div>;
};

export default Test;
