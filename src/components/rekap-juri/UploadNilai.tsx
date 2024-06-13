import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getParticipant } from "@/utils/participant";
import Link from "next/link";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CircularProgress from "@mui/material/CircularProgress";
import HandleFile from "./HandleFile";

const UploadNilai = () => {
  const [participant, setParticipant] = useState<{
    pesertaID: string;
    noUrut: string;
    namaTim: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const eventID = Array.isArray(params.eventID)
    ? params.eventID[0]
    : params.eventID;
  const pesertaID = Array.isArray(params.pesertaID)
    ? params.pesertaID[0]
    : params.pesertaID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getParticipant(eventID, pesertaID);
        setParticipant(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch participants:", error);
      }
    };

    fetchData();
  }, [pesertaID, eventID]);

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
      ) : !eventID || !pesertaID || !participant ? (
        <p className="text-center">Data tidak ditemukan.</p>
      ) : (
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
      )}
    </section>
  );
};

export default UploadNilai;
