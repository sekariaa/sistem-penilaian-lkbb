import React, { useEffect, useState } from "react";
import { peringkat } from "@/utils/participant";

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

  useEffect(() => {
    const fetchPeringkat = async () => {
      try {
        const data = await peringkat("0vI9yhK1EVIHPqhgg1Ms"); // Ganti 'eventID' dengan ID event yang sesuai
        setPeringkatData(data);
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

  return (
    <div>
      <h1>Test</h1>
      {/* {error && <p>{error}</p>}
      {peringkatData.length > 0 ? (
        <ul>
          {peringkatData.map((item, index) => (
            <li key={item.pesertaId}>
              {index + 1}. {item.namaTim} - {item.nilai.peringkat}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )} */}
    </div>
  );
};

export default Test;
