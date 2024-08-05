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
  getBestPBB,
  getBestDanton,
} from "@/utils/participant";
import { getEvent } from "@/utils/event";
import { useParams } from "next/navigation";
import { LinearProgress } from "@mui/material";
import { HasilPemeringkatan } from "@/types";
import { formatDate } from "@/utils/errorHandling";

export default function AccessibleTable() {
  const [nilaiPeserta, setNilaiPeserta] = React.useState<HasilPemeringkatan[]>(
    []
  );
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
  const params = useParams<{ eventID: string }>();
  const eventID = params.eventID;
  const [loading, setLoading] = React.useState(true);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
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

        setNilaiPeserta(juara);
        setMaxJuaraUmum(juaraUmum);
        setMaxVarfor(bestVarfor);
        setMaxBestPBB(bestPBB);
        setMaxBestDanton(bestDanton);
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
                  <TableRow key={row.noUrut}>
                    <TableCell scope="row" align="center">
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
    </section>
  );
}
