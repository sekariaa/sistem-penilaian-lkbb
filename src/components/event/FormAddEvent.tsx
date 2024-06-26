"use client";
import React, { useState } from "react";
import { addevent } from "@/utils/event";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Link from "next/link";
import AlertComponent from "../AlertComponent";
import ButtonComponent from "../button/ButtonComponent";

const FormAddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [level, setLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    setError(null);
    e.preventDefault();
    if (!eventName || !organizer || !level) {
      setError("Form tidak boleh kosong");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setIsLoading(true);
      await addevent(eventName, organizer, level);
      setIsLoading(false);
      setSuccess("Event berhasil ditambahkan!");
      setTimeout(() => setSuccess(null), 3000);
      setEventName("");
      setOrganizer("");
      setLevel("");
    } catch (error) {
      setIsLoading(false);
      setError("Gagal menambahkan event. Silakan coba lagi.");
      setError(null);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <section className="mx-auto max-w-[1640px]">
      <div className="flex items-center mb-3 text-black-primary">
        <Link href="event" passHref>
          <IconButton style={{ color: "#151c24" }}>
            <ArrowBackIosIcon />
          </IconButton>
        </Link>
        <h1 className="text-center text-xl font-bold">Tambah event</h1>
      </div>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="string"
            name="floating_name"
            id="floating_name"
            className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-primary appearance-none  focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <label
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nama Event
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="string"
            name="floating_organizer"
            id="floating_organizer"
            className="block py-2.5 px-0 w-full text-sm text-black-primary bg-transparent border-0 border-b-2 border-gray-primary appearance-none  focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
          />
          <label
            htmlFor="floating_organizer"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Penyelenggara Event
          </label>
        </div>
        <p className="mb-1 text-black-primary text-sm">
          Pilih Tingkat Perlombaan:
        </p>
        <div className="flex items-center space-x-3 mb-5 text-sm text-black-primary">
          <div className="space-x-2">
            <input
              type="radio"
              value="SMA/sederajat"
              checked={level === "SMA/sederajat"}
              onChange={() => setLevel("SMA/sederajat")}
              required={true}
            />
            <label>SMA/sederajat</label>
          </div>
          <div className="space-x-2">
            <input
              type="radio"
              value="SMP/sederajat"
              checked={level === "SMP/sederajat"}
              onChange={() => setLevel("SMP/sederajat")}
              required={true}
            />
            <label>SMP/sederajat</label>
          </div>
        </div>
        <ButtonComponent intent="primary-full" loading={isLoading}>
          Simpan
        </ButtonComponent>
      </form>
      <AlertComponent severity="success" message={success} />
      <AlertComponent severity="error" message={error} />
    </section>
  );
};

export default FormAddEvent;
