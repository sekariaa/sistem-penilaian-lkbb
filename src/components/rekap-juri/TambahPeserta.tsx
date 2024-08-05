"use client";
import React, { useState, useEffect } from "react";
import { addParticipant } from "@/utils/participant";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Link from "next/link";
import ButtonComponent from "../button/ButtonComponent";
import AlertComponent from "../AlertComponent";
import { useParams } from "next/navigation";
import { getEvent } from "@/utils/event";
import CircularProgress from "@mui/material/CircularProgress";
import { EventType } from "@/types";
import { type } from "os";

const TambahPeserta = () => {
  const [noUrut, setNoUrut] = useState("");
  const [namaTim, setNamaTim] = useState("");
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorFloat, setErrorFloat] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * TypeScript generics untuk menentukan { eventID: string } menunjukkan bahwa params harus memiliki properti eventID yang bertipe string.
   */
  const params = useParams<{ eventID: string }>();
  const eventID = params.eventID;

  /**
   * melaukan pengecekan eventID yang digunakan apakah sesuai atau tidak
   */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDetails = await getEvent(eventID);
        setEvent(eventDetails);
      } catch (error: any) {
        console.error(error.message);
        setError(error.message);
      }
    };

    fetchEvent();
  }, [eventID]);

  /**
   * setelah submit, maka akan menampilkan loading button, kemudian baru menampilkan berhasil/tidak menambahkan peserta
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingButton(true);
      await addParticipant(eventID, parseInt(noUrut), namaTim);
      setIsLoadingButton(false);
      setSuccess("Peserta berhasil ditambahkan!");
      setTimeout(() => setSuccess(null), 3000);
      setNoUrut("");
      setNamaTim("");
    } catch (error: any) {
      setIsLoadingButton(false);
      console.error(error.message);
      setErrorFloat(error.message);
      //pesan tersebut hanya ditampilkan selama beberapa detik. setelah 3 detik, akan menghapus pesan error
      setTimeout(() => setErrorFloat(null), 3000);
    }
  };

  return (
    <section className="mx-auto max-w-[1640px]">
      <div className="flex items-center mb-3">
        <Link href="./" passHref>
          <IconButton style={{ color: "#151c24" }}>
            <ArrowBackIosIcon />
          </IconButton>
        </Link>
        <h1 className="text-center text-xl font-bold text-black-primary">
          Tambah Peserta
        </h1>
      </div>

      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : event ? (
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="floating_nomor"
              id="floating_nomor"
              className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-black-primary peer"
              placeholder=" "
              value={noUrut}
              onChange={(e) => setNoUrut(e.target.value)}
              required
            />
            <label
              htmlFor="floating_name"
              className="peer-focus:font-medium absolute text-sm text-gray-primary  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black-primary  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nomor Urut
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="string"
              name="floating_nama"
              id="floating_nama"
              className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              value={namaTim}
              onChange={(e) => setNamaTim(e.target.value)}
              required
            />
            <label
              htmlFor="floating_organizer"
              className="peer-focus:font-medium absolute text-sm text-gray-primary  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black-primary  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nama Tim
            </label>
          </div>
          <ButtonComponent intent="primary-full" loading={isLoadingButton}>
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

export default TambahPeserta;
