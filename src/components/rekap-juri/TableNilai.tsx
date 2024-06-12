import React, { useEffect, useState } from "react";
import { getNilai } from "@/utils/participant";
import { LinearProgress } from "@mui/material";

interface HandleFileProps {
  eventID: string;
  pesertaID: string;
}

const TableNilai: React.FC<HandleFileProps> = ({ eventID, pesertaID }) => {
  const [nilaiData, setNilaiData] = useState<Record<string, number> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNilai(eventID, pesertaID);
        setNilaiData(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data nilai:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventID, pesertaID]);

  const keyMapping: { [key: string]: string } = {
    pbb: "Nilai PBB",
    danton: "Nilai Danton",
    juaraUmum: "Juara Umum",
    varfor: "Nilai Varfor",
    pengurangan: "Pengurangan Nilai",
    peringkat: "Juara Peringkat",
  };

  const orderedKeys = [
    "pbb",
    "danton",
    "pengurangan",
    "peringkat",
    "varfor",
    "juaraUmum",
  ];

  return (
    <section>
      {loading && <LinearProgress color="inherit" />}
      {!loading && (!nilaiData || Object.keys(nilaiData).length === 0) ? (
        <div className="text-center">
          Tidak ada data yang ditemukan. Lakukan upload dokumen!
        </div>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-400 mb-3">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-1 bg-gray-100">
                  Deskripsi
                </th>
                <th className="border border-gray-300 px-4 py-1 bg-gray-100">
                  Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {orderedKeys.map((key) => (
                <tr key={key}>
                  <td className="border border-gray-300 px-4 py-1">
                    {keyMapping[key]}
                  </td>
                  <td className="border border-gray-300 px-4 py-1 text-end">
                    {nilaiData && nilaiData[key] !== undefined
                      ? nilaiData[key]
                      : "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default TableNilai;
