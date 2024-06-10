import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardEvent from "./CardEvent";
import { getEvent } from "../../utils/event";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";

const Event = () => {
  const [events, setEvents] = useState<
    { name: string; createdAt: Date; organizer: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventList = await getEvent();
        setLoading(false);
        setEvents(eventList);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  return (
    <section className="mx-auto max-w-[1640px]">
      <h1 className="text-center text-xl font-bold mb-3">Daftar Event</h1>
      <div className="flex justify-start mb-3">
        <Link href="tambah-event" passHref>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            style={{ backgroundColor: "#000000", textTransform: "none" }}
          >
            Tambah Event
          </Button>
        </Link>
      </div>
      <div className="flex justify-center py-5">
        {loading ? (
          <CircularProgress style={{ color: "#000000" }} />
        ) : events.length > 0 ? (
          <div className="gap-x-10 gap-y-8 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ">
            {events.map((event, index) => (
              <CardEvent key={index} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center">Tidak ada event yang Anda tambahkan.</p>
        )}
      </div>
    </section>
  );
};

export default Event;
