import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  getBestVarfor,
  getJuaraUmum,
  peringkat,
  getBestDanton,
  getBestPBB,
} from "@/utils/participant";
import { getEvent } from "@/utils/event";
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
  const [maxVarfor, setMaxVarfor] = React.useState<[string, string, number][]>(
    []
  );
  const [maxBestPBB, setMaxBestPBB] = React.useState<
    [string, string, number][]
  >([]);
  const [maxBestDanton, setMaxBestDanton] = React.useState<
    [string, string, number][]
  >([]);
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
        const bestPBB = await getBestPBB(juara);
        const bestDanton = await getBestDanton(juara);
        const updated = (await getEvent(eventID)).updatedAt;

        setNilaiPeserta(juara);
        setMaxJuaraUmum(juaraUmum);
        setMaxVarfor(bestVarfor);
        setMaxBestPBB(bestPBB);
        setMaxBestDanton(bestDanton);

        if (updated && updated.seconds) {
          const updatedDate = new Date(updated.seconds * 1000);
          setUpdatedAt(updatedDate);
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

  const getBestDantonValue = (pesertaId: string) => {
    const value = maxBestDanton.find((danton) => danton[0] === pesertaId)
      ? maxBestDanton.findIndex((danton) => danton[0] === pesertaId) + 1
      : "-";
    return value;
  };

  const getBestPBBValue = (pesertaId: string) => {
    const value = maxBestPBB.find((pbb) => pbb[0] === pesertaId)
      ? maxBestPBB.findIndex((pbb) => pbb[0] === pesertaId) + 1
      : "-";
    return value;
  };

  const getBestVarforValue = (pesertaId: string) => {
    const value = maxVarfor.find((varfor) => varfor[0] === pesertaId)
      ? maxVarfor.findIndex((varfor) => varfor[0] === pesertaId) + 1
      : "-";
    return value;
  };

  const exportToExcel = () => {
    setLoadingExport(true);
    const fileName = `Rekap Juara ${eventName}.xlsx`;
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "CCCCCC" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
    const bodyStyle = {
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Menyusun header dengan gaya
    const header = [
      {
        "Nomor Urut": {
          v: "Nomor Urut",
          s: headerStyle,
        },
        "Nama Tim": {
          v: "Nama Tim",
          s: headerStyle,
        },
        "Nilai PBB": {
          v: "Nilai PBB",
          s: headerStyle,
        },
        "Nilai Danton": {
          v: "Nilai Danton",
          s: headerStyle,
        },
        "Pengurangan Nilai": {
          v: "Pengurangan Nilai",
          s: headerStyle,
        },
        "Juara Peringkat": {
          v: "Juara Peringkat",
          s: headerStyle,
        },
        "Nilai Varfor": {
          v: "Nilai Varfor",
          s: headerStyle,
        },
        "Juara Umum": {
          v: "Juara Umum",
          s: headerStyle,
        },
        Juara: {
          v: "Juara",
          s: headerStyle,
        },
        "Best PBB": {
          v: "Best PBB",
          s: headerStyle,
        },
        "Best Danton": {
          v: "Best Danton",
          s: headerStyle,
        },
        "Best Varfor": {
          v: "Best Varfor",
          s: headerStyle,
        },
      },
    ];

    const dataToExport = nilaiPeserta.map((row) => {
      const rowData: any = {
        "Nomor Urut": row.noUrut,
        "Nama Tim": row.namaTim,
        "Nilai PBB": row.nilai["pbb"],
        "Nilai Danton": row.nilai["danton"],
        "Pengurangan Nilai": row.nilai["pengurangan"],
        "Juara Peringkat": row.nilai["peringkat"],
        "Nilai Varfor": row.nilai["varfor"],
        "Juara Umum": row.nilai["juaraUmum"],
        Juara: row.juara,
        "Best PBB": getBestPBBValue(row.pesertaId),
        "Best Danton": getBestDantonValue(row.pesertaId),
        "Best Varfor": getBestVarforValue(row.pesertaId),
      };

      // Menambahkan border ke semua sel
      for (const key in rowData) {
        rowData[key] = {
          v: rowData[key],
          s: bodyStyle,
        };
      }

      // Menandai baris dengan pbb tertinggi
      if (maxBestPBB.find((pbb) => pbb[0] === row.pesertaId)) {
        rowData["Nilai PBB"] = {
          v: row.nilai["pbb"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "F8F633" } },
          },
        };
      }
      // Menandai baris dengan danton tertinggi
      if (maxBestDanton.find((danton) => danton[0] === row.pesertaId)) {
        rowData["Nilai Danton"] = {
          v: row.nilai["danton"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "4C9CFF" } },
          },
        };
      }
      // Menandai baris dengan varfor tertinggi
      if (maxVarfor.find((varfor) => varfor[0] === row.pesertaId)) {
        rowData["Nilai Varfor"] = {
          v: row.nilai["varfor"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "F0A537" } },
          },
        };
      }
      // Menandai baris dengan juara umum tertinggi
      if (row.pesertaId === maxJuaraUmum[0]) {
        rowData["Juara Umum"] = {
          v: row.nilai["juaraUmum"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "0CE42A" } },
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
        <Table sx={{ minWidth: 650 }} size="small" aria-label="caption table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow>
              <TableCell align="center" rowSpan={2}>
                No Urut
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Nama Tim
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Nilai PBB
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Nilai Danton
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Pengurangan Nilai
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Juara Peringkat
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Nilai Varfor
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Juara Umum
              </TableCell>
              <TableCell align="center">Juara</TableCell>
              <TableCell align="center">Best PBB</TableCell>
              <TableCell align="center">Best Danton</TableCell>
              <TableCell align="center">Best Varfor</TableCell>
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
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: maxBestPBB.find(
                          (pbb) => pbb[0] === row.pesertaId
                        )
                          ? "#F8F633"
                          : "inherit",
                      }}
                    >
                      {row.nilai["pbb"]}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: maxBestDanton.find(
                          (danton) => danton[0] === row.pesertaId
                        )
                          ? "#4C9CFF"
                          : "inherit",
                      }}
                    >
                      {row.nilai["danton"]}
                    </TableCell>
                    <TableCell align="center">
                      {row.nilai["pengurangan"]}
                    </TableCell>
                    <TableCell align="center">
                      {row.nilai["peringkat"]}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: maxVarfor.find(
                          (varfor) => varfor[0] === row.pesertaId
                        )
                          ? "#F0A537"
                          : "inherit",
                      }}
                    >
                      {row.nilai["varfor"]}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor:
                          row.pesertaId === maxJuaraUmum[0]
                            ? "#0CE42A"
                            : "inherit",
                      }}
                    >
                      {row.nilai["juaraUmum"]}
                    </TableCell>
                    <TableCell align="center">{row.juara}</TableCell>
                    <TableCell align="center">
                      {getBestPBBValue(row.pesertaId)}
                    </TableCell>
                    <TableCell align="center">
                      {getBestDantonValue(row.pesertaId)}
                    </TableCell>
                    <TableCell align="center">
                      {getBestVarforValue(row.pesertaId)}
                    </TableCell>
                  </TableRow>
                ))
            )}
            {updatedAt && (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-red-500">
                  Diperbarui {formatDate(updatedAt)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
