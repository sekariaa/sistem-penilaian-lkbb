import React, { useEffect, useState } from "react";
import { getNilai } from "@/utils/participant";
import { LinearProgress } from "@mui/material";

interface HandleFileProps {
  eventID: string;
  pesertaID: string;
}

const formatDate = (date: Date | null): string => {
  if (!date) return "-"; // Handle null or undefined case

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Pad single digit numbers with leading zero
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${day} ${months[monthIndex]} ${year} pada ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const TableNilai: React.FC<HandleFileProps> = ({ eventID, pesertaID }) => {
  const [nilaiData, setNilaiData] = useState<Record<string, number> | null>(
    null
  );
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { nilaiData, updatedAt } = await getNilai(eventID, pesertaID);
        setNilaiData(nilaiData);
        if (updatedAt && updatedAt.seconds) {
          const updatedDate = new Date(updatedAt.seconds * 1000);
          setUpdatedAt(updatedDate);
        } else {
          setUpdatedAt(null);
        }
        setLoading(false);
      } catch (error) {
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
            {updatedAt && (
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-center text-red-500">
                    Diperbarui {formatDate(updatedAt)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </section>
  );
};

export default TableNilai;
