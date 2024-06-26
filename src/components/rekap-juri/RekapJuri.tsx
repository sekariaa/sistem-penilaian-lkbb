import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/utils/event";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import TablePeserta from "./TablePeserta";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { EventType } from "../../types";
import ButtonComponent from "../button/ButtonComponent";

const RekapNilai = () => {
  const [event, setEvent] = useState<EventType | null>(null);
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
        <IconButton style={{ color: "#151c24" }}>
          <ArrowBackIosIcon />
        </IconButton>
      </Link>

      {loading ? (
        <div className="flex justify-center py-5">
          <CircularProgress style={{ color: "#151c24" }} />
        </div>
      ) : !event ? (
        <p className="text-center text-black-primary">Event tidak ditemukan.</p>
      ) : (
        <div className="text-black-primary">
          <h1 className="text-center text-3xl font-bold mb-3">
            Daftar Peserta
          </h1>
          <div className="flex flex-col md:flex-row justify-between mb-3">
            <div className="space-y-1 ">
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
              <Link
                href={`/event/rekap-juri/${eventID}/tambah-peserta`}
                passHref
              >
                <ButtonComponent
                  intent="primary-small"
                  leftIcon={
                    <AddIcon fontSize="small" style={{ fill: "#ffffff" }} />
                  }
                >
                  Tambah Peserta
                </ButtonComponent>
              </Link>
              <Link href={`/event/rekap-juri/${eventID}/rekap-juara`} passHref>
                <ButtonComponent
                  intent="primary-small"
                  leftIcon={
                    <EmojiEventsIcon
                      fontSize="small"
                      style={{ fill: "#ffffff" }}
                    />
                  }
                >
                  Hasil Penilaian
                </ButtonComponent>
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
