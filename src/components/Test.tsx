import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function AccessibleTable() {
  return (
    <section>
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead sx={{ fontWeight: "bold" }}>
            <TableRow className="bg-yellow-500">
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
              <TableCell align="center" colSpan={4} className="bg-blue-500">
                Hasil
              </TableCell>
            </TableRow>
            <TableRow className="bg-purple-500">
              <TableCell align="center" className="bg-fuchsia-500">
                Juara
              </TableCell>
              <TableCell align="center">Best Varfor</TableCell>
              <TableCell align="center">Best PBB</TableCell>
              <TableCell align="center">Best Danton</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" align="center">
                a
              </TableCell>
              <TableCell align="center">b</TableCell>
              <TableCell align="center">c</TableCell>
              <TableCell align="center">d</TableCell>
              <TableCell align="center">e</TableCell>
              <TableCell align="center">f</TableCell>
              <TableCell align="center">g</TableCell>
              <TableCell align="center">h</TableCell>
              <TableCell align="center">i</TableCell>
              <TableCell align="center">j</TableCell>
              <TableCell align="center">k</TableCell>
              <TableCell align="center">l</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
