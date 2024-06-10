import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardEvent from "./CardEvent";
import { getEvents } from "../../utils/event";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";

const Event = () => {
  const [events, setEvents] = useState<
    {
      id: string;
      name: string;
      createdAt: Date;
      organizer: string;
      level: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventList = await getEvents();
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
      <h1 className="text-center text-3xl font-bold mb-3">Daftar Event</h1>
      <div className="mb-3">
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
          <div className="gap-x-5 gap-y-8 grid grid-cols-1 xl:w-full xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2">
            {events.map((event) => (
              <CardEvent key={event.id} event={event} />
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
