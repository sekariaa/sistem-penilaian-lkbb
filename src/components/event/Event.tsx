import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardEvent from "./CardEvent";
import { getEvents } from "../../utils/event";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import { EventType } from "../../types";
import ButtonComponent from "../button/ButtonComponent";

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
        console.error(
          "Error fetching event:",
          error instanceof Error ? error.message : error
        );
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
      <h1 className="text-center text-3xl font-bold mb-3 text-black-primary">
        Daftar Event
      </h1>
      <div className="mb-3 flex flex-col md:flex-row space-y-2 justify-between items-center">
        <TextField
          label="Cari Event"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: 250,
            "& .MuiInputBase-input": {
              color: "#151c24",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#151c24",
            },
            "& .MuiInputLabel-root": {
              color: "#97A1AF",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#151c24",
              },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#151c24",
            },
          }}
        />
        <Link href="tambah-event" passHref>
          <ButtonComponent
            intent="primary-small"
            leftIcon={<AddIcon fontSize="small" style={{ fill: "#ffffff" }} />}
          >
            Tambah Event
          </ButtonComponent>
        </Link>
      </div>
      <div className="flex justify-center mb-5">
        {loading ? (
          <CircularProgress style={{ color: "#151c24" }} />
        ) : filteredEvents.length > 0 ? (
          <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <CardEvent key={event.eventID} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500">
            Tidak ada event yang Anda tambahkan.
          </p>
        )}
      </div>
    </section>
  );
};

export default Event;
