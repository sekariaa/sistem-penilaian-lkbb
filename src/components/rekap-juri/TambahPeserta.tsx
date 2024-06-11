"use client";
import React, { useState } from "react";
import { addParticipant } from "@/utils/participant";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import AlertComponent from "../AlertComponent";
import { useParams } from "next/navigation";

const TambahPeserta = () => {
  const [noUrut, setNoUrut] = useState("");
  const [namaTim, setNamaTim] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const params = useParams();
  const eventID = Array.isArray(params.eventID) ? params.eventID[0] : params.eventID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noUrut || !namaTim) {
      setError("Form tidak boleh kosong");
      return;
    }
    console.log("no urut:", noUrut);
    console.log("nama sekolah:", namaTim);
    try {
      setIsLoading(true);
      await addParticipant(eventID, noUrut, namaTim);
      setIsLoading(false);
      setSuccess("Peserta berhasil ditambahkan!");
      setNoUrut("");
      setNamaTim("");
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <section className="mx-auto max-w-[1640px]">
      <div className="flex items-center mb-3">
        <Link href="./" passHref>
          <IconButton style={{ color: "#000000" }}>
            <ArrowBackIosIcon />
          </IconButton>
        </Link>
        <h1 className="text-center text-xl font-bold">Tambah Peserta</h1>
      </div>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="string"
            name="floating_nomor"
            id="floating_nomor"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={noUrut}
            onChange={(e) => setNoUrut(e.target.value)}
            required
          />
          <label
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nomor Urut
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="string"
            name="floating_nama"
            id="floating_nama"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={namaTim}
            onChange={(e) => setNamaTim(e.target.value)}
            required
          />
          <label
            htmlFor="floating_organizer"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nama Tim
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-black font-medium rounded-full text-sm w-full px-5 py-2.5 text-center "
        >
          {isLoading ? (
            <span className="w-full relative px-5 py-2 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0 ">
              <CircularProgress size="1rem" style={{ color: "#ffffff" }} />
            </span>
          ) : (
            <span className="w-full relative px-5 py-2 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0 ">
              Simpan
            </span>
          )}
        </button>
      </form>
      <AlertComponent severity="success" message={success} />
      <AlertComponent severity="error" message={error} />
    </section>
  );
};

export default TambahPeserta;
