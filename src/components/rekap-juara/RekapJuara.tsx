import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/utils/event";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import TableJuara from "./TableJuara";
import ButtonComponent from "../button/ButtonComponent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AlertComponent from "../AlertComponent";
import { EventType } from "@/types";

const RekapNilai = () => {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ eventID: string }>();
  const eventID = params.eventID;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const copyToClipboard = () => {
    const link = `https://rekap-pembaris.vercel.app/live/${eventID}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setSuccess("Berhasil copy link live score!");
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch((error) => {
        setError("Gagal copy link live score!");
        setTimeout(() => setError(null), 3000);
      });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDetails = await getEvent(eventID);
        setEvent(eventDetails);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventID]);

  return (
    <section className="mx-auto max-w-[1640px] text-black-primary">
      <Link href="./" passHref>
        <IconButton style={{ color: "#151c24" }}>
          <ArrowBackIosIcon />
        </IconButton>
      </Link>
      {loading ? (
        <div className="flex justify-center py-5">
          <CircularProgress style={{ color: "#151c24" }} />
        </div>
      ) : !event ? (
        <p className="text-center text-red-500">Event tidak ditemukan.</p>
      ) : (
        <div>
          <h1 className="text-center text-3xl font-bold mb-3">Rekap Juara</h1>
          <div className="flex flex-col md:flex-row justify-between mb-3">
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
              <div onClick={copyToClipboard}>
                <ButtonComponent
                  intent="primary-small"
                  leftIcon={
                    <ContentCopyIcon
                      fontSize="small"
                      style={{ fill: "#ffffff" }}
                    />
                  }
                >
                  Live Score
                </ButtonComponent>
              </div>
            </div>
          </div>

          <TableJuara eventName={event.name} />
        </div>
      )}
      <AlertComponent severity="success" message={success} />
      <AlertComponent severity="error" message={error} />
    </section>
  );
};

export default RekapNilai;
