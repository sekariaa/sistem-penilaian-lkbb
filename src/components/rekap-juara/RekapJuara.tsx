import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/utils/event";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import TableJuara from "./TableJuara";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const RekapNilai = () => {
  const [event, setEvent] = useState<{
    eventID: string;
    name: string;
    organizer: string;
    level: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const eventID = Array.isArray(params.eventID)
    ? params.eventID[0]
    : params.eventID;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (eventID) {
          const eventDetails = await getEvent(eventID);
          setEvent(eventDetails);
        } else {
          console.error("Event ID tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventID]);

  return (
    <section className="mx-auto max-w-[1640px]">
      <Link href="./" passHref>
        <IconButton style={{ color: "#000000" }}>
          <ArrowBackIosIcon />
        </IconButton>
      </Link>

      {loading ? (
        <div className="flex justify-center py-5">
          <CircularProgress style={{ color: "#000000" }} />
        </div>
      ) : !event ? (
        <p className="text-center">Event tidak ditemukan.</p>
      ) : (
        <div>
          <h1 className="text-center text-3xl font-bold mb-3">Rekap Juara</h1>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="space-y-2 mb-3">
              <p>
                <span className="font-bold">Nama Event: </span> {event.name}
              </p>
              <p>
                <span className="font-bold">Penyelenggara: </span>
                {event.organizer}
              </p>
              <p>
                <span className="font-bold">Tingkat Perlombaan: </span>
                {event.level}
              </p>
            </div>
            <div className="mb-3">
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                size="small"
                style={{ backgroundColor: "#000000", textTransform: "none" }}
              >
                Unduh Data
              </Button>
            </div>
          </div>

          <TableJuara />
        </div>
      )}
    </section>
  );
};

export default RekapNilai;
