import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardEvent from "./CardEvent";
import { getEvents } from "../../utils/event";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, TextField } from "@mui/material";
import { EventType } from "../../types";

const Event = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mx-auto max-w-[1640px]">
      <h1 className="text-center text-3xl font-bold mb-3">Daftar Event</h1>
      <div className="mb-3 flex flex-col md:flex-row space-y-2 justify-between items-center">
        <TextField
          label="Cari Event"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            "& .MuiInputBase-input": {
              color: "#000000",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000000",
            },
            "& .MuiInputLabel-root": {
              color: "#000000",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#000000",
              },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#000000",
            },
          }}
        />
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
      <div className="flex justify-center">
        {loading ? (
          <CircularProgress style={{ color: "#000000" }} />
        ) : filteredEvents.length > 0 ? (
          <div className="gap-x-5 gap-y-8 grid grid-cols-1 xl:w-full md:w-full xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2">
            {filteredEvents.map((event) => (
              <CardEvent key={event.eventID} event={event} />
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
