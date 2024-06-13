import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getBestVarfor, getJuaraUmum, peringkat, getEvent } from "@/utils/live";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx-js-style";
import CircularProgress from "@mui/material/CircularProgress";
import { LinearProgress } from "@mui/material";

interface Nilai {
  [key: string]: number;
}

interface NilaiPeserta {
  pesertaId: string;
  nilai: Nilai;
  namaTim: string;
  noUrut: number;
  juara: number;
}

interface Event {
  eventName: string;
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

export default function AccessibleTable({ eventName }: Event) {
  const [nilaiPeserta, setNilaiPeserta] = React.useState<NilaiPeserta[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [maxJuaraUmum, setMaxJuaraUmum] = React.useState<
    [string | null, string | null, number | null]
  >([null, null, null]);
  const [maxVarfor, setMaxVarfor] = React.useState<
    [string | null, string | null, number | null]
  >([null, null, null]);
  const params = useParams();
  const eventID = Array.isArray(params.eventID)
    ? params.eventID[0]
    : params.eventID;
  const [loadingExport, setLoadingExport] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const juara = await peringkat(eventID);
        const bestVarfor = await getBestVarfor(juara);
        const juaraUmum = await getJuaraUmum(juara);
        const updated = (await getEvent(eventID)).updatedAt;

        setNilaiPeserta(juara);
        setMaxJuaraUmum(juaraUmum);
        setMaxVarfor(bestVarfor);
        if (updated && updated.seconds) {
          const updatedDate = new Date(updated.seconds * 1000);
          setUpdatedAt(updatedDate);
          console.log(updatedDate);
        } else {
          setUpdatedAt(null);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal mengambil data nilai.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventID]);

  const exportToExcel = () => {
    setLoadingExport(true);
    const fileName = `Rekap Juara ${eventName}.xlsx`;

    // Menyusun header dengan gaya
    const header = [
      {
        "Nomor Urut": {
          v: "Nomor Urut",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Nama Tim": {
          v: "Nama Tim",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Nilai PBB": {
          v: "Nilai PBB",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Nilai Danton": {
          v: "Nilai Danton",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Pengurangan Nilai": {
          v: "Pengurangan Nilai",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Juara Peringkat": {
          v: "Juara Peringkat",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        Juara: {
          v: "Juara",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Nilai Varfor": {
          v: "Nilai Varfor",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
        "Juara Umum": {
          v: "Juara Umum",
          s: {
            font: { bold: true },
            fill: { fgColor: { rgb: "CCCCCC" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        },
      },
    ];

    const dataToExport = nilaiPeserta.map((row) => {
      const rowData = {
        "Nomor Urut": row.noUrut,
        "Nama Tim": row.namaTim,
        "Nilai PBB": row.nilai["pbb"],
        "Nilai Danton": row.nilai["danton"],
        "Pengurangan Nilai": row.nilai["pengurangan"],
        "Juara Peringkat": row.nilai["peringkat"],
        Juara: row.juara,
        "Nilai Varfor": row.nilai["varfor"],
        "Juara Umum": row.nilai["juaraUmum"],
      };

      // Menambahkan border ke semua sel
      for (const key in rowData) {
        if (typeof rowData[key] !== "object" || !rowData[key].s) {
          rowData[key] = {
            v: rowData[key],
            s: {
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
            },
          };
        } else {
          rowData[key].s.border = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          };
        }
      }

      // Menandai baris dengan juara umum tertinggi dengan latar belakang hijau
      if (
        row.nilai["juaraUmum"] === maxJuaraUmum[2] &&
        row.pesertaId === maxJuaraUmum[0]
      ) {
        rowData["Juara Umum"] = {
          v: row.nilai["juaraUmum"],
          s: {
            fill: { fgColor: { rgb: "00cc00" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        };
      }

      // Menandai baris dengan varfor tertinggi dengan latar belakang hijau
      if (
        row.nilai["varfor"] === maxVarfor[2] &&
        row.pesertaId === maxVarfor[0]
      ) {
        rowData["Nilai Varfor"] = {
          v: row.nilai["varfor"],
          s: {
            fill: { fgColor: { rgb: "00cc00" } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          },
        };
      }
      return rowData;
    });

    // Menggabungkan header dan data
    const dataWithHeader = [header[0], ...dataToExport];

    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_json(worksheet, dataWithHeader, {
      skipHeader: true,
      origin: "A1",
    });

    // Add the updatedAt date
    if (updatedAt) {
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [["Diperbarui pada", formatDate(updatedAt)]],
        { origin: `A${dataToExport.length + 3}` }
      );
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Juara");
    XLSX.writeFile(workbook, fileName);
    setLoadingExport(false);
  };

  return (
    <section>
      {loading && <LinearProgress color="inherit" />}
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow>
              <TableCell align="center">Nomor Urut</TableCell>
              <TableCell align="center">Nama Tim</TableCell>
              <TableCell align="center">Nilai PBB</TableCell>
              <TableCell align="center">Nilai Danton</TableCell>
              <TableCell align="center">Pengurangan Nilai</TableCell>
              <TableCell align="center">Juara Peringkat</TableCell>
              <TableCell align="center">Juara</TableCell>
              <TableCell align="center">Nilai Varfor</TableCell>
              <TableCell align="center">Juara Umum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nilaiPeserta.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <p className="text-gray-400">Tidak Ada Data</p>
                </TableCell>
              </TableRow>
            ) : (
              nilaiPeserta
                .sort((a, b) => a.juara - b.juara)
                .map((row) => (
                  <TableRow key={row.noUrut}>
                    <TableCell component="th" scope="row" align="center">
                      {row.noUrut}
                    </TableCell>
                    <TableCell align="center">{row.namaTim}</TableCell>
                    <TableCell align="center">{row.nilai["pbb"]}</TableCell>
                    <TableCell align="center">{row.nilai["danton"]}</TableCell>
                    <TableCell align="center">
                      {row.nilai["pengurangan"]}
                    </TableCell>
                    <TableCell align="center">
                      {row.nilai["peringkat"]}
                    </TableCell>
                    <TableCell align="center">{row.juara}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor:
                          row.nilai["varfor"] === maxVarfor[2] &&
                          row.pesertaId === maxVarfor[0]
                            ? "#00cc00"
                            : "inherit",
                      }}
                    >
                      {row.nilai["varfor"]}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor:
                          row.nilai["juaraUmum"] === maxJuaraUmum[2] &&
                          row.pesertaId === maxJuaraUmum[0]
                            ? "#00cc00"
                            : "inherit",
                      }}
                    >
                      {row.nilai["juaraUmum"]}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
          {updatedAt && (
            <tfoot>
              <tr>
                <td colSpan={9} className="text-center text-red-500">
                  Diperbarui Pada: {formatDate(updatedAt)}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </TableContainer>
      <div className="flex justify-center items-center mt-3">
        <button
          type="submit"
          className="relative w-28 mb-3 inline-flex items-center justify-center overflow-hidden text-sm font-medium text-white rounded group bg-black"
          onClick={exportToExcel}
          disabled={!nilaiPeserta || Object.keys(nilaiPeserta).length === 0}
          style={{
            cursor:
              !nilaiPeserta || Object.keys(nilaiPeserta).length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loadingExport ? (
            <span className="relative px-3 py-2 transition-all ease-in duration-75 group-hover:bg-opacity-0 ">
              <CircularProgress size="1rem" style={{ color: "#ffffff" }} />
            </span>
          ) : (
            <span className="relative px-3 py-2 transition-all ease-in duration-75 group-hover:bg-opacity-0 ">
              Unduh Data
            </span>
          )}
        </button>
      </div>
    </section>
  );
}
