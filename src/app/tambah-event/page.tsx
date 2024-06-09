"use client";
import React, { useState } from "react";
import { addevent } from "@/utils/event";

const FormAddItem = () => {
  const [eventName, setEventName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nama event:", eventName);
    try {
      await addevent(eventName);
      alert("Event berhasil ditambahkan!");
      setEventName("");
    } catch (error) {
      alert("Gagal menambahkan event. Silakan coba lagi.");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="eventName">Nama event</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <button type="submit">Tambah Event</button>
      </form>
    </section>
  );
};

export default FormAddItem;
