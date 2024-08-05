import React, { useEffect, useState } from "react";
import { getNilai } from "@/utils/participant";
import { LinearProgress } from "@mui/material";
import { formatDate } from "@/utils/errorHandling";

const TableNilai: React.FC<{ eventID: string; pesertaID: string }> = ({
  eventID,
  pesertaID,
}) => {
  //tipe data TypeScript yang menunjukkan bahwa nilaiData bisa berupa objek dengan pasangan key-value di mana kunci adalah string dan nilainya adalah number, atau null
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

  //keyMapping adalah objek yang memetakan kunci nilai (key) ke deskripsi yang akan ditampilkan di tabel.
  const keyMapping: { [key: string]: string } = {
    pbb: "Nilai PBB",
    danton: "Nilai Danton",
    juaraUmum: "Juara Umum",
    varfor: "Nilai Varfor",
    pengurangan: "Pengurangan Nilai",
    peringkat: "Juara Peringkat",
  };

  //array yang menentukan urutan tampilnya kunci nilai dalam tabel.
  const orderedKeys = [
    "pbb",
    "danton",
    "pengurangan",
    "peringkat",
    "varfor",
    "juaraUmum",
  ];

  return (
    <section className="text-black-primary">
      {loading && <LinearProgress color="inherit" />}
      {!loading && (!nilaiData || Object.keys(nilaiData).length === 0) ? (
        <div className="text-center">Lakukan upload dokumen!</div>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-300 mb-3">
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
