import React, { useEffect, useState } from "react";
import {
  peringkat,
  getBestVarfor,
  getJuaraUmum,
  addAllJuara,
} from "@/utils/participant";

interface Nilai {
  peringkat: number;
  pbb: number;
  danton: number;
  pengurangan: number;
  juaraUmum: number;
  varfor: number;
}

interface Peringkat {
  pesertaId: string;
  nilai: Nilai;
  namaTim: string;
  noUrut: string;
  juara: number;
}

const Test = () => {
  const [peringkatData, setPeringkatData] = useState<Peringkat[]>([]);
  const [error, setError] = useState<string>("");
  const id = "0vI9yhK1EVIHPqhgg1Ms";

  useEffect(() => {
    const fetchPeringkat = async () => {
      try {
        const data = await peringkat(id);
        const xxx = await getBestVarfor(data);
        const yyy = await getJuaraUmum(data);
        console.log("juara", data);
        console.log("varfor", xxx);
        console.log("umum", yyy);
        // setPeringkatData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal mengambil data peringkat.");
        }
      }
    };

    fetchPeringkat();
  }, []);

  const handleClick = async () => {
    try {
      await addAllJuara(id);
      console.log("Data juara berhasil ditambahkan.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal menambahkan data juara.");
      }
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <button onClick={handleClick}>HALO</button>
    </div>
  );
};

export default Test;
