import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { saveNilai } from "@/utils/participant";

interface HandleFileProps {
  eventID: string;
  pesertaID: string;
}

const HandleFile: React.FC<HandleFileProps> = ({ eventID, pesertaID }) => {
  // onchange states
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  // submit state
  const [excelData, setExcelData] = useState<any[] | null>(null);

  // onchange event
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          if (e.target) {
            setExcelFile(e.target.result as ArrayBuffer);
          }
        };
      } else {
        setTypeError("Silakan pilih jenis file excel saja.");
        setExcelFile(null);
      }
    } else {
      console.log("Silakan pilih berkas.");
    }
  };

  // submit event
  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      // Extracting data from specific rows and columns
      const data = [];
      for (let i = 3; i <= 8; i++) {
        // Rows 3 to 8
        const cellValueA = worksheet[`A${i}`]?.v || "";
        const cellValueB = worksheet[`B${i}`]?.v || "";
        const cellValueC = worksheet[`C${i}`]?.v || "";
        const cellValueD = worksheet[`D${i}`]?.v || 0;
        data.push({
          Deskripsi: `${cellValueA} ${cellValueB} ${cellValueC}`,
          Nilai: cellValueD,
        });
      }

      setExcelData(data);
    }
  };

  const handleSave = async () => {
    try {
      console.log(excelData);
      let nilaiData = {};
      if (excelData) {
        for (let i = 0; i < excelData.length; i++) {
          const { Deskripsi, Nilai } = excelData[i];
          console.log(Deskripsi, Nilai);

          switch (Deskripsi.trim()) {
            case "NILAI PBB":
              nilaiData = { ...nilaiData, pbb: Nilai };
              break;
            case "NILAI DANTON":
              nilaiData = { ...nilaiData, danton: Nilai };
              break;
            case "PENGURANGAN NILAI":
              nilaiData = { ...nilaiData, pengurangan: Nilai };
              break;
            case "JUARA PERINGKAT":
              nilaiData = { ...nilaiData, peringkat: Nilai };
              break;
            case "NILAI VARFOR":
              nilaiData = { ...nilaiData, varfor: Nilai };
              break;
            case "JUARA UMUM":
              nilaiData = { ...nilaiData, juaraUmum: Nilai };
              break;
            default:
              break;
          }
        }
        console.log(nilaiData);
        await saveNilai(eventID, pesertaID, nilaiData);
        console.log("Data berhasil disimpan ke Firestore.");
      } else {
        console.log("Tidak ada data yang disimpan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan data ke Firestore:", error);
    }
  };

  return (
    <section className="mb-3">
      {/* form */}
      <form
        className="flex flex-row justify-center items-center w-fit gap-2"
        onSubmit={handleFileSubmit}
      >
        <input
          type="file"
          className="outline outline-1 rounded outline-gray-400 p-2"
          required
          onChange={handleFile}
        />
        <Button
          type="submit"
          variant="contained"
          size="small"
          style={{ backgroundColor: "#000000", textTransform: "none" }}
        >
          Upload
        </Button>
        {typeError && (
          <div className="text-red-500" role="alert">
            {typeError}
          </div>
        )}
      </form>

      {/* view data */}
      <div className="my-3">
        {excelData ? (
          <div>
            <table className="w-full border-collapse border border-gray-400 mb-3">
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
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                variant="contained"
                size="small"
                style={{ backgroundColor: "#000000", textTransform: "none" }}
                onClick={handleSave}
              >
                Simpan
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            Tidak ada File yang di upload
          </div>
        )}
      </div>
    </section>
  );
};

export default HandleFile;
