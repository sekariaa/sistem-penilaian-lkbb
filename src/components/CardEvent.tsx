import React, { useEffect, useState } from "react";
import { getEvent } from "../utils/event";

const CardEvent = () => {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventList = await getEvent();
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Event yang Anda tambahkan:</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((eventName) => (
            <li key={eventName}>{eventName}</li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada event yang Anda tambahkan.</p>
      )}
    </div>
  );
};

export default CardEvent;
