import React from "react";
import { Authentication } from "../utils/user";
import Link from "next/link";
import CardEvent from "./CardEvent";

interface HomeProps {
  user: any;
}

const handleSignOut = async () => {
  try {
    await Authentication().signOut();
    localStorage.removeItem("username");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const addEvent = async () => {};

const Home: React.FC<HomeProps> = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <Link href="tambah-event" passHref>
        <button className="bg-green-500 py-3 mx-3" onClick={addEvent}>
          Tambah Event
        </button>
      </Link>
      <button className="bg-red-500 p-3" onClick={handleSignOut}>
        Sign Out
      </button>
      <h1>EVENT</h1>
      <CardEvent />
    </div>
  );
};

export default Home;
