"use client";
import React, { useState, useEffect } from "react";
// import { addAllJuara } from "@/utils/participant";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Link from "next/link";
import AlertComponent from "../AlertComponent";
import { useParams } from "next/navigation";
import { getParticipant, editParticipant } from "@/utils/participant";
import { ParticipantType } from "@/types";
import ButtonComponent from "../button/ButtonComponent";
import CircularProgress from "@mui/material/CircularProgress";

const EditPeserta = () => {
  const [participant, setParticipant] = useState<ParticipantType | null>(null);
  const [namaTimNew, setNamaTimNew] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorFloat, setErrorFloat] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  /**
   * TypeScript generics untuk menentukan { eventID: string } menunjukkan bahwa params harus memiliki properti eventID yang bertipe string.
   */
  const params = useParams<{ eventID: string; pesertaID: string }>();
  const eventID = params.eventID;
  const pesertaID = params.pesertaID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const participantData = await getParticipant(eventID, pesertaID);
        setParticipant(participantData);
        setNamaTimNew(participantData.namaTim);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setError(error.message);
      }
    };
    fetchData();
  }, [eventID, pesertaID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await editParticipant(eventID, pesertaID, namaTimNew);
      setIsLoading(false);
      setSuccess("Peserta berhasil diupdate!");
      setTimeout(() => setSuccess(null), 3000);
      setNamaTimNew(namaTimNew);
    } catch (error: any) {
      setIsLoading(false);
      setErrorFloat(error.message);
      setTimeout(() => setErrorFloat(null), 3000);
    }
  };

  return (
    <section className="mx-auto max-w-[1640px]">
      <div className="flex items-center mb-3">
        <Link href="../" passHref>
          <IconButton style={{ color: "#151c24" }}>
            <ArrowBackIosIcon />
          </IconButton>
        </Link>
        <h1 className="text-center text-xl font-bold">Edit Peserta</h1>
      </div>

      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : participant ? (
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group cursor-not-allowed">
            <span className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-primary">
              {participant.noUrut}
            </span>
            <label
              htmlFor="floating_nomor"
              className="peer-focus:font-medium absolute text-sm text-gray-primary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nomor Urut
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="floating_nama"
              id="floating_nama"
              className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-primary appearance-none  focus:outline-none focus:ring-0 focus:border-black-primary peer"
              placeholder=" "
              value={namaTimNew}
              onChange={(e) => setNamaTimNew(e.target.value)}
              required
            />
            <label
              htmlFor="floating_organizer"
              className="peer-focus:font-medium absolute text-sm text-gray-primary  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nama Tim
            </label>
          </div>
          <ButtonComponent intent="primary-full" loading={isLoading}>
            Simpan
          </ButtonComponent>
        </form>
      ) : (
        <div className="text-center">
          <CircularProgress style={{ color: "#151c24" }} />
        </div>
      )}

      <AlertComponent severity="success" message={success} />
      <AlertComponent severity="error" message={errorFloat} />
    </section>
  );
};

export default EditPeserta;
