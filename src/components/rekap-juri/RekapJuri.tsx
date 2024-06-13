import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/utils/event";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import TablePeserta from "./TablePeserta";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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
          setLoading(false);
        } else {
          setLoading(false);
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
      <Link href="../" passHref>
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
          <h1 className="text-center text-3xl font-bold mb-3">
            Daftar Peserta
          </h1>
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
            <div className="flex gap-3 mb-3">
              <Link
                href={`/event/rekap-juri/${eventID}/tambah-peserta`}
                passHref
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="small"
                  style={{ backgroundColor: "#000000", textTransform: "none" }}
                >
                  Tambah Peserta
                </Button>
              </Link>
              <Link href={`/event/rekap-juri/${eventID}/rekap-juara`} passHref>
                <Button
                  variant="contained"
                  startIcon={<EmojiEventsIcon />}
                  size="small"
                  style={{ backgroundColor: "#000000", textTransform: "none" }}
                >
                  Hasil Penilaian
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <TablePeserta />
    </section>
  );
};

export default RekapNilai;
