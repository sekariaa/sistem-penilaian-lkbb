import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getAllNilai } from "@/utils/participant";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";
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

export default function AccessibleTable() {
  const [nilaiPeserta, setNilaiPeserta] = React.useState<NilaiPeserta[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [maxJuaraUmum, setMaxJuaraUmum] = React.useState<
    [string | null, number | null]
  >([null, null]);
  const [maxVarfor, setMaxVarfor] = React.useState<
    [string | null, number | null]
  >([null, null]);
  const params = useParams();
  const eventID = Array.isArray(params.eventID)
    ? params.eventID[0]
    : params.eventID;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllNilai(eventID);

        // Mengurutkan peringkat
        const sortedData = data.sort((a, b) => {
          if (a.nilai.peringkat !== b.nilai.peringkat) {
            return b.nilai.peringkat - a.nilai.peringkat;
          } else if (a.nilai.pbb !== b.nilai.pbb) {
            return b.nilai.pbb - a.nilai.pbb;
          } else if (a.nilai.danton !== b.nilai.danton) {
            return b.nilai.danton - a.nilai.danton;
          } else {
            return a.nilai.pengurangan - b.nilai.pengurangan;
          }
        });
        const rankedData = sortedData.map((peserta, index) => ({
          ...peserta,
          juara: index + 1,
        }));
        setNilaiPeserta(rankedData);

        // Menghitung juara umum tertinggi
        const sortedJuaraUmum = rankedData.sort((a, b) => {
          if (a.nilai.juaraUmum !== b.nilai.juaraUmum) {
            return b.nilai.juaraUmum - a.nilai.juaraUmum;
          } else {
            return a.juara - b.juara;
          }
        });
        setMaxJuaraUmum([
          sortedJuaraUmum[0].pesertaId,
          sortedJuaraUmum[0].nilai.juaraUmum,
        ]);

        // Menghitung varfor tertinggi
        const sortedVarfor = rankedData.sort((a, b) => {
          if (a.nilai.varfor !== b.nilai.varfor) {
            return b.nilai.varfor - a.nilai.varfor;
          } else {
            return a.juara - b.juara;
          }
        });
        setMaxVarfor([sortedVarfor[0].pesertaId, sortedVarfor[0].nilai.varfor]);
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
    const fileName = "rekap_juara.xlsx";
    const dataToExport = nilaiPeserta.map((row) => ({
      "Nomor Urut": row.noUrut,
      "Nama Tim": row.namaTim,
      "Nilai PBB": row.nilai["pbb"],
      "Nilai Danton": row.nilai["danton"],
      "Pengurangan Nilai": row.nilai["pengurangan"],
      "Juara Peringkat": row.nilai["peringkat"],
      Juara: row.juara,
      "Nilai Varfor": row.nilai["varfor"],
      "Juara Umum": row.nilai["juaraUmum"],
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Juara");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <section>
      <Button onClick={exportToExcel} variant="contained" color="primary">
        Export to Excel
      </Button>

      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <caption>HALO</caption>
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
                        row.nilai["varfor"] === maxVarfor[1] &&
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
                        row.nilai["juaraUmum"] === maxJuaraUmum[1] &&
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
