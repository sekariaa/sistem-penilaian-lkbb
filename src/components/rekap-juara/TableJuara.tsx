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
import { HasilPemeringkatan } from "@/types";
import { formatDate } from "@/utils/errorHandling";

interface Event {
  eventName: string;
}

export default function AccessibleTable({ eventName }: Event) {
  const [nilaiPeserta, setNilaiPeserta] = React.useState<HasilPemeringkatan[]>(
    []
  );
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
  const params = useParams<{ eventID: string }>();
  const eventID = params.eventID;
  const [loadingExport, setLoadingExport] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        //mengambil data
        const juara: HasilPemeringkatan[] = await peringkat(eventID);
        const bestVarfor = await getBestVarfor(juara);
        const juaraUmum = await getJuaraUmum(juara);
        const bestPBB = await getBestPBB(juara);
        const bestDanton = await getBestDanton(juara);
        const eventData = await getEvent(eventID);
        if (eventData) {
          const updated = eventData.updatedAt;
          if (updated && updated.seconds) {
            const updatedDate = new Date(updated.seconds * 1000);
            setUpdatedAt(updatedDate);
          } else {
            setUpdatedAt(null);
          }
        } else {
          setUpdatedAt(null);
        }

        //mengatur state dengan data yang telah diambil
        setNilaiPeserta(juara);
        setMaxJuaraUmum(juaraUmum);
        setMaxVarfor(bestVarfor);
        setMaxBestPBB(bestPBB);
        setMaxBestDanton(bestDanton);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventID]);

  /**
   * danton adalah parameter untuk setiap elemen dalam array maxBestDanton
   * danton[0] adalah ID peserta pada setiap elemen array, sedangkan danton[1] dan danton[2] adalah informasi tambahan (nama tim dan nilai)
   *
   */
  const getBestDantonValue = (pesertaID: string) => {
    const value = maxBestDanton.find((danton) => danton[0] === pesertaID)
      ? maxBestDanton.findIndex((danton) => danton[0] === pesertaID) + 1
      : "-";
    return value;
  };

  const getBestPBBValue = (pesertaID: string) => {
    const value = maxBestPBB.find((pbb) => pbb[0] === pesertaID)
      ? maxBestPBB.findIndex((pbb) => pbb[0] === pesertaID) + 1
      : "-";
    return value;
  };

  const getBestVarforValue = (pesertaID: string) => {
    const value = maxVarfor.find((varfor) => varfor[0] === pesertaID)
      ? maxVarfor.findIndex((varfor) => varfor[0] === pesertaID) + 1
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
        "Best PBB": getBestPBBValue(row.pesertaID),
        "Best Danton": getBestDantonValue(row.pesertaID),
        "Best Varfor": getBestVarforValue(row.pesertaID),
      };

      // Menambahkan border ke semua sel
      for (const key in rowData) {
        rowData[key] = {
          v: rowData[key],
          s: bodyStyle,
        };
      }

      // Menandai baris dengan pbb tertinggi
      if (maxBestPBB.find((pbb) => pbb[0] === row.pesertaID)) {
        rowData["Nilai PBB"] = {
          v: row.nilai["pbb"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "F8F633" } },
          },
        };
      }
      // Menandai baris dengan danton tertinggi
      if (maxBestDanton.find((danton) => danton[0] === row.pesertaID)) {
        rowData["Nilai Danton"] = {
          v: row.nilai["danton"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "4C9CFF" } },
          },
        };
      }
      // Menandai baris dengan varfor tertinggi
      if (maxVarfor.find((varfor) => varfor[0] === row.pesertaID)) {
        rowData["Nilai Varfor"] = {
          v: row.nilai["varfor"],
          s: {
            ...bodyStyle,
            fill: { fgColor: { rgb: "F0A537" } },
          },
        };
      }
      // Menandai baris dengan juara umum tertinggi
      if (row.pesertaID === maxJuaraUmum[0]) {
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
                <TableCell colSpan={12} align="center">
                  <p className="text-gray-400">Tidak Ada Data</p>
                </TableCell>
              </TableRow>
            ) : (
              nilaiPeserta
                .sort((a, b) => a.juara - b.juara)
                .map((row) => (
                  <TableRow
                    key={row.noUrut}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F0F0F0",
                        cursor: "default",
                      },
                    }}
                    onMouseEnter={() => setHoveredRow(row.pesertaID)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      backgroundColor:
                        hoveredRow === row.pesertaID ? "#F0F0F0" : "inherit",
                    }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row.noUrut}
                    </TableCell>
                    <TableCell align="center">{row.namaTim}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: maxBestPBB.find(
                          (pbb) => pbb[0] === row.pesertaID
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
                          (danton) => danton[0] === row.pesertaID
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
                          (varfor) => varfor[0] === row.pesertaID
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
                          row.pesertaID === maxJuaraUmum[0]
                            ? "#0CE42A"
                            : "inherit",
                      }}
                    >
                      {row.nilai["juaraUmum"]}
                    </TableCell>
                    <TableCell align="center">{row.juara}</TableCell>
                    <TableCell align="center">
                      {getBestPBBValue(row.pesertaID)}
                    </TableCell>
                    <TableCell align="center">
                      {getBestDantonValue(row.pesertaID)}
                    </TableCell>
                    <TableCell align="center">
                      {getBestVarforValue(row.pesertaID)}
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
          className="relative w-28 mb-3 inline-flex items-center justify-center overflow-hidden text-sm font-medium text-white rounded group bg-black-primary hover:bg-black-secondary"
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
            <span className="px-3 py-2">
              <CircularProgress size="1rem" style={{ color: "#ffffff" }} />
            </span>
          ) : (
            <span className="px-3 py-2">Unduh Data</span>
          )}
        </button>
      </div>
    </section>
  );
}
