import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/utils/event";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import TableSchool from "./TablePeserta";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getParticipants } from "@/utils/participant";

const RekapNilai = () => {
  const [event, setEvent] = useState<{
    id: string;
    name: string;
    organizer: string;
    level: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const eventDetails = await getEvent(id);
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
  }, [id]);

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
          <div className="flex justify-between">
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
            <div className="flex gap-3">
              <Link href={`/event/rekap-nilai/${id}/tambah-peserta`} passHref>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="small"
                  style={{ backgroundColor: "#000000", textTransform: "none" }}
                >
                  Tambah Peserta
                </Button>
              </Link>
              <Link href={`/event/rekap-nilai/${id}/hasil-penilaian`} passHref>
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

          <TableSchool />
        </div>
      )}
    </section>
  );
};

export default RekapNilai;
