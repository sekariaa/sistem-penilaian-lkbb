import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getParticipant } from "@/utils/participant";
import Link from "next/link";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CircularProgress from "@mui/material/CircularProgress";
import HandleFile from "./HandleFile";
import { ParticipantType } from "@/types";

const UploadNilai = () => {
  const [participant, setParticipant] = useState<ParticipantType | null>(null);
  const [error, setError] = useState<string | null>(null);
  /**
   * TypeScript generics untuk menentukan { eventID: string } menunjukkan bahwa params harus memiliki properti eventID yang bertipe string.
   */
  const params = useParams<{ eventID: string; pesertaID: string }>();
  const eventID = params.eventID;
  const pesertaID = params.pesertaID;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getParticipant(eventID, pesertaID);
        setParticipant(data);
      } catch (error: any) {
        console.error(error.message);
        setError(error.message);
      }
    };

    fetchEvent();
  }, [pesertaID, eventID]);

  return (
    <section className="mx-auto max-w-[1640px] text-black-primary">
      <Link href="./" passHref>
        <IconButton style={{ color: "#151c24" }}>
          <ArrowBackIosIcon />
        </IconButton>
      </Link>

      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : participant ? (
        <div>
          <h1 className="text-center text-3xl font-bold mb-3">Upload Nilai</h1>
          <div className="space-y-2 mb-3">
            <p>
              <span className="font-bold">Nomor urut: </span>{" "}
              {participant.noUrut}
            </p>
            <p>
              <span className="font-bold">Nama tim: </span>
              {participant.namaTim}
            </p>
          </div>
          <HandleFile
            eventID={eventID}
            pesertaID={pesertaID}
            noUrut={participant.noUrut}
          />
        </div>
      ) : (
        <div className="text-center">
          <CircularProgress style={{ color: "#151c24" }} />
        </div>
      )}
    </section>
  );
};

export default UploadNilai;
