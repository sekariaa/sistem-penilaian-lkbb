import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getBestVarfor, getJuaraUmum, peringkat } from "@/utils/participant";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx-js-style";
import { Button } from "@mui/material";

interface Nilai {
  [key: string]: number;
}

interface NilaiPeserta {
  pesertaId: string;
  nilai: Nilai;
  namaTim: string;
  noUrut: string;
  juara: number;
}

interface Event {
  eventName: string;
}

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const juara = await peringkat(eventID);
        const bestVarfor = await getBestVarfor(juara);
        const juaraUmum = await getJuaraUmum(juara);

        setNilaiPeserta(juara);
        setMaxJuaraUmum(juaraUmum);
        setMaxVarfor(bestVarfor);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal mengambil data nilai.");
        }
      }
    };

    fetchData();
  }, [eventID]);

  const exportToExcel = () => {
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
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Juara");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <section>
      <Button onClick={exportToExcel} variant="contained" color="primary">
        Unduh Data
      </Button>
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
            {nilaiPeserta
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
                  <TableCell align="center">{row.nilai["peringkat"]}</TableCell>
                  <TableCell align="center">{row.juara}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor:
                        row.nilai["varfor"] === maxVarfor[2] &&
                        row.pesertaId === maxVarfor[0]
                          ? "red"
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
                          ? "green"
                          : "inherit",
                    }}
                  >
                    {row.nilai["juaraUmum"]}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
