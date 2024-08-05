import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveNilai } from "@/utils/participant";
import AlertComponent from "../AlertComponent";
import CircularProgress from "@mui/material/CircularProgress";
import { Nilai } from "@/types";

interface HandleFileProps {
  eventID: string;
  pesertaID: string;
  noUrut: number;
}

const HandleFile: React.FC<HandleFileProps> = ({
  eventID,
  pesertaID,
  noUrut,
}) => {
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [noUrutExcel, setNoUrutExcel] = useState<number | null>(null);

  const [typeError, setTypeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loadingSave, setLoadingSave] = useState(false);

  /**
   * memeriksa jenis file yang dipilih
   * memuat konten file tersebut jika sesuai dengan format yang diperbolehkan (Excel atau CSV)
   */
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeError(null);
    setExcelData(null);
    setNoUrutExcel(null);
    setError(null);

    //array yang berisi MIME type untuk file Excel dan CSV yang diperbolehkan
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    const selectedFile = e.target?.files?.[0];

    if (!selectedFile) {
      setTypeError(
        "Tidak ada file yang dipilih. Silakan pilih file yang sesuai template dengan format Excel atau CSV."
      );
      return;
    }

    if (!fileTypes.includes(selectedFile.type)) {
      setTypeError("Silakan pilih file dengan format Excel atau CSV.");
      return;
    }

    /**
     * membaca file excel yang telah dipilih dan memproses data
     *
     */
    const reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = async () => {
      /**
       * setelah FileReader selesai membaca file, hasilnya akan disimpan di result. akan diperiksa apakah ada hasil yang tersedia
       * mengurai file Excel dari ArrayBuffer menjadi objek yang bisa diakses.
       */
      if (reader.result) {
        const workbook = XLSX.read(reader.result as ArrayBuffer, {
          type: "buffer",
        });
        //mengakases sheet excel pertama
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        /**
         * membuat array baru
         * _ untuk parameter yang diabaikan
         * baris dimulai dari 3 (artinya baris yang diambil dari worksheet adalah baris ke-3 hingga ke-8)
         * mengakses nilai dari sel di kolom A, B, dan C pada baris yang ditentukan (rowIndex)
         * menggabungkan nilai dari kolom A, B, dan C menjadi satu string, dengan spasi sebagai pemisah
         * mengakses nilai dari sel di kolom D pada baris yang ditentukan.
         */
        const data = Array.from({ length: 6 }, (_, i) => {
          const rowIndex = i + 3;
          return {
            Deskripsi: [
              worksheet[`A${rowIndex}`]?.v || "",
              worksheet[`B${rowIndex}`]?.v || "",
              worksheet[`C${rowIndex}`]?.v || "",
            ]
              .join(" ")
              .trim(),
            Nilai: worksheet[`D${rowIndex}`]?.v || 0,
          };
        });

        //untuk mengambil nilai dari sel tertentu dalam worksheet
        const noUrutValue = worksheet[`B2`]?.v || null;
        setNoUrutExcel(noUrutValue || null);

        //array yang berisi deskripsi yang harus ada di data excel
        const requiredDescriptions = [
          "NILAI PBB",
          "NILAI DANTON",
          "PENGURANGAN NILAI",
          "JUARA PERINGKAT",
          "NILAI VARFOR",
          "JUARA UMUM",
        ];

        //array data yang berisi deskripsi yang diambil dari data excel yang telah diproses sebelumnya
        const dataDescriptions = data.map((item) => item.Deskripsi);
        //apakah semua deskripsi dalam dataDescriptions adalah deskripsi yang diharapkan, tanpa adanya deskripsi tambahan
        const templateValid = dataDescriptions.every((description) =>
          requiredDescriptions.includes(description)
        );

        if (!templateValid) {
          setTypeError("File tidak sesuai template.");
          return;
        }
        setExcelData(data);
      }
    };
  };

  const handleSave = async () => {
    setTimeout(() => setError(null), 3000);
    if (noUrut !== noUrutExcel) {
      setError("Nomor urut tidak sama");
      return;
    }
    setLoadingSave(true);
    try {
      //inisialisasi nilaiData dengan nilai default untuk semua atribut yang diperlukan sesuai dengan interface Nilai
      let nilaiData: Nilai = {
        danton: 0,
        juaraUmum: 0,
        pbb: 0,
        pengurangan: 0,
        peringkat: 0,
        varfor: 0,
      };
      if (excelData) {
        for (let i = 0; i < excelData.length; i++) {
          const { Deskripsi, Nilai } = excelData[i];
          //berdasarkan deskripsi dari setiap item, nilai yang relevan dimasukkan ke dalam nilaiData
          switch (Deskripsi.trim()) {
            case "NILAI PBB":
              nilaiData.pbb = Nilai;
              break;
            case "NILAI DANTON":
              nilaiData.danton = Nilai;
              break;
            case "PENGURANGAN NILAI":
              nilaiData.pengurangan = Nilai;
              break;
            case "JUARA PERINGKAT":
              nilaiData.peringkat = Nilai;
              break;
            case "NILAI VARFOR":
              nilaiData.varfor = Nilai;
              break;
            case "JUARA UMUM":
              nilaiData.juaraUmum = Nilai;
              break;
            default:
              break;
          }
        }
        await saveNilai(eventID, pesertaID, nilaiData);
        setSuccess("Data berhasil disimpan.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Tidak ada data yang disimpan.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <section className="mb-3">
      {/* form */}
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex-col space-y-3 md:flex-row md:space-x-5">
          <input
            type="file"
            className="outline outline-1 rounded outline-gray-400 p-2"
            required
            onChange={handleFile}
          />
        </div>
        {typeError && (
          <div className="text-red-500 text-xs" role="alert">
            {typeError}
          </div>
        )}
      </form>

      {/* view data */}
      <div className="my-3">
        {excelData ? (
          <div>
            <p className="mb-3 font-bold text-red-500">
              No Urut: {noUrutExcel}
            </p>
            <table className="mx-auto w-full border-collapse border border-gray-400 mb-3">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-1 bg-gray-100"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td
                        key={key}
                        className="border border-gray-300 px-4 py-1"
                      >
                        {individualExcelData[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="flex justify-center items-center "
              onClick={handleSave}
            >
              <button
                type="submit"
                className="relative w-20 inline-flex items-center justify-center overflow-hidden text-sm font-medium text-white rounded group bg-black-primary hover:bg-black-secondary"
                onClick={handleSave}
              >
                {loadingSave ? (
                  <span className="px-3 py-2">
                    <CircularProgress
                      size="1rem"
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                ) : (
                  <span className="px-3 py-2">Simpan</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            Tidak ada File yang di upload
          </div>
        )}
      </div>
      <AlertComponent severity="success" message={success} />
      <AlertComponent severity="error" message={error} />
    </section>
  );
};

export default HandleFile;
