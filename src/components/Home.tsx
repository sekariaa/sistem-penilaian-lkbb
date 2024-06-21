import React from "react";
import Link from "next/link";

interface HomeProps {
  user: any;
}

const addEvent = async () => {};

const Home: React.FC<HomeProps> = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center font-bold space-y-1 text-xl md:text-3xl ">
        <div>
          <p>Rekap Nilai</p>
        </div>
        <div className="flex items-center gap-1">
          <hr className="w-20 md:w-32 h-1 border-0 rounded bg-black" />
          <p className="">Lomba Paskibraka </p>
        </div>
        <div>
          <p>Solusi Cerdas dan Praktis</p>
        </div>
      </div>
      <div className="flex justify-center items-center py-5">
        <Link
          href="https://drive.google.com/drive/u/0/folders/1xQ69tmZDno-Xrz1812ubAVpB3C5CWcHl"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          <button className="inline-flex items-center justify-center mb-1 me-2 overflow-hidden text-sm font-medium text-black rounded-lg group outline outline-2">
            <span className="px-5 py-2 rounded-md group-hover:bg-opacity-0 ">
              Template
            </span>
          </button>
        </Link>
        <Link
          href="https://drive.google.com/drive/u/0/folders/1kwwzwzxGP2fgcz3VxiQzGKiFpAFJOvR_"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          <button className="inline-flex items-center justify-center mb-1 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-black">
            <span className="px-5 py-2 rounded-md group-hover:bg-opacity-0 ">
              Tutorial
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
