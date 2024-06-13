import React, { useState } from "react";
import * as XLSX from "xlsx";
import { addAllJuara, saveNilai } from "@/utils/participant";
import AlertComponent from "../AlertComponent";
import CircularProgress from "@mui/material/CircularProgress";

interface HandleFileProps {
  eventID: string;
  pesertaID: string;
  noUrut: string;
}

const HandleFile: React.FC<HandleFileProps> = ({
  eventID,
  pesertaID,
  noUrut,
}) => {
  // onchange states
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  // submit state
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [noUrutExcel, setNoUrutExcel] = useState<string[] | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // onchange event
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeError(null);
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setLoadingUpload(true);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          if (e.target) {
            setExcelFile(e.target.result as ArrayBuffer);
            setLoadingUpload(false);
          }
        };
      } else {
        setLoadingUpload(false);
        setTypeError("Silakan pilih jenis file excel saja.");
        setExcelFile(null);
      }
    } else {
      setLoadingUpload(false);
      setTypeError("Silakan pilih berkas.");
    }
  };

  // submit event
  const handleFileSubmit = (e: React.FormEvent) => {
    setLoadingUpload(true);
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

      // Extract No Urut from cell B2
      const noUrutValue = worksheet[`B2`]?.v || null;
      setNoUrutExcel(noUrutValue ? noUrutValue.toString() : null);

      setExcelData(data);
      setLoadingUpload(false);
      setError(null);
    }
    setLoadingUpload(false);
  };

  const handleSave = async () => {
    setError(null);
    if (noUrut !== noUrutExcel[0]) {
      setError("Nomor urut tidak sama");
      return;
    }
    setLoadingSave(true);
    try {
      let nilaiData = {};
      if (excelData) {
        for (let i = 0; i < excelData.length; i++) {
          const { Deskripsi, Nilai } = excelData[i];
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
        // Check if nilaiData conforms to the template
        const requiredFields = [
          "pbb",
          "danton",
          "pengurangan",
          "peringkat",
          "varfor",
          "juaraUmum",
        ];
        const missingFields = requiredFields.filter(
          (field) => !(field in nilaiData)
        );
        if (missingFields.length > 0) {
          throw new Error("File tidak sesuai template.");
        }
        await saveNilai(eventID, pesertaID, nilaiData);
        await addAllJuara(eventID);
        setSuccess("Data berhasil disimpan.");
        console.log("berhasil");
        setLoadingSave(false);
      } else {
        setLoadingSave(false);
        setError("Tidak ada data yang disimpan.");
      }
    } catch (error: any) {
      setLoadingSave(false);
      setError(error.message);
    }
    setError(null);
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
        <button
          type="submit"
          className="relative inline-flex items-center justify-center mb-1 overflow-hidden text-sm font-medium text-white rounded group bg-black"
        >
          {loadingUpload ? (
            <span className="relative px-3 py-2 transition-all ease-in duration-75 group-hover:bg-opacity-0 ">
              <CircularProgress size="1rem" style={{ color: "#ffffff" }} />
            </span>
          ) : (
            <span className="relative px-3 py-2 transition-all ease-in duration-75 group-hover:bg-opacity-0 ">
              Upload
            </span>
          )}
        </button>
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
            <p className="mb-3 font-bold">No Urut: {noUrutExcel}</p>
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
              <button
                type="submit"
                className="relative inline-flex items-center justify-center mb-1 overflow-hidden text-sm font-medium text-white rounded group bg-black"
                onClick={handleSave}
              >
                {loadingSave ? (
                  <span className="relative px-3 py-2 transition-all ease-in duration-75 group-hover:bg-opacity-0 ">
                    <CircularProgress
                      size="1rem"
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                ) : (
                  <span className="relative px-3 py-2 transition-all ease-in duration-75 group-hover:bg-opacity-0 ">
                    Simpan
                  </span>
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
