import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { useParams } from "next/navigation";
import { getParticipants, deleteParticipant } from "@/utils/participant";
import LinearProgress from "@mui/material/LinearProgress";
import ButtonComponent from "../button/ButtonCRUDComponent";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import { ParticipantType } from "@/types";

interface Data {
  pesertaID: string;
  noUrut: number;
  namaTim: string;
  lainnya: any;
}

function createData({ pesertaID, noUrut, namaTim }: ParticipantType): Data {
  return {
    pesertaID,
    noUrut,
    namaTim,
    lainnya: "Lainnya",
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "noUrut",
    numeric: false,
    disablePadding: false,
    label: "Nomor Urut",
  },
  {
    id: "namaTim",
    numeric: false,
    disablePadding: false,
    label: "Nama Tim",
  },
  {
    id: "lainnya",
    numeric: false,
    disablePadding: true,
    label: "Lainnya",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("noUrut");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [participants, setParticipants] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searched, setSearched] = React.useState<string>("");

  /**
   * TypeScript generics untuk menentukan { eventID: string } menunjukkan bahwa params harus memiliki properti eventID yang bertipe string.
   */
  const params = useParams<{ eventID: string }>();
  const eventID = params.eventID;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getParticipants(eventID);
        setParticipants(data.map(createData));
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.error(error.message);
      }
    };

    fetchData();
  }, [eventID]);

  /**
   * menangani permintaan pengurutan kolom pada tabel ketika pengguna mengklik header kolom
   * property adalah nama kolom yang dipilih oleh pengguna untuk diurutkan
   */
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    //kolom dibawah ini tidak dapat diurutkan
    if (property === "namaTim" || property === "lainnya") {
      return;
    }
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  /**
   * event.target.value: nilai yang dipilih oleh pengguna dari dropdown
   * basis numerik yang digunakan adalah desimal (basis 10)
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteParticipant = async (pesertaID: string) => {
    const confirmed = window.confirm("Apakah Anda yakin untuk menghapus data?");
    if (confirmed) {
      try {
        setLoading(true);
        await deleteParticipant(eventID, pesertaID);
        const updatedParticipants = await getParticipants(eventID);
        setParticipants(updatedParticipants.map(createData));
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.error(error.message);
      }
    }
  };

  /**
   * menghasilkan data yang akan ditampilkan di tabel, dengan mempertimbangkan pencarian, pengurutan, dan paginasi.
   */
  const visibleRows = React.useMemo(() => {
    //filter berdasarkan search input
    const filteredParticipants = participants.filter((participant) =>
      participant.namaTim.toLowerCase().includes(searched.toLowerCase())
    );
    //menghitung total jumlah halaman yang diperlukan berdasarkan jumlah peserta yang difilter dan jumlah baris per halaman
    const pageCount = Math.ceil(filteredParticipants.length / rowsPerPage);
    //mengatur halaman saat ini jika halaman yang ditentukan (page) melebihi jumlah halaman yang tersedia. sehingga dipastikan halaman saat ini tidak melebihi halaman terakhir yang valid.
    const adjustedPage = Math.min(page, pageCount - 1);
    //mengurutkan array dengan mempertahankan urutan relatif elemen yang dianggap sama oleh fungsi perbandingan
    return stableSort(
      filteredParticipants,
      getComparator(order, orderBy)
      //mengambil subset dari peserta yang sudah diurutkan berdasarkan halaman saat ini dan jumlah baris per halaman
    ).slice(
      adjustedPage * rowsPerPage,
      adjustedPage * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, participants, searched]);

  const requestSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearched(event.target.value);
  };

  return (
    <Box sx={{ width: "100%", boxShadow: 3 }}>
      <TextField
        label="Cari Nama Tim"
        value={searched}
        onChange={requestSearch}
        size="small"
        sx={{
          width: "100%",
          "& .MuiInputBase-input": {
            color: "#000000",
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000",
          },
          "& .MuiInputLabel-root": {
            color: "#000000",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#000000",
            },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#000000",
          },
        }}
      />
      {loading && <LinearProgress color="inherit" />}
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={participants.length}
            />
            <TableBody>
              {!loading && visibleRows.length > 0
                ? visibleRows.map((row) => (
                    <TableRow
                      key={row.noUrut}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f3f3f3" },
                      }}
                    >
                      <TableCell align="center" className="w-36">
                        {row.noUrut}
                      </TableCell>
                      <TableCell align="center" className=" w-56">
                        {row.namaTim} <br />
                      </TableCell>
                      <TableCell align="center">
                        {/* data nilai */}
                        <Link
                          href={`/event/rekap-juri/${eventID}/data-nilai/${row.pesertaID}`}
                          passHref
                        >
                          <ButtonComponent intent="Data Nilai"></ButtonComponent>
                        </Link>
                        {/* edit peserta */}
                        <Link
                          href={`/event/rekap-juri/${eventID}/edit-peserta/${row.pesertaID}`}
                          passHref
                        >
                          <ButtonComponent intent="Edit Peserta"></ButtonComponent>
                        </Link>
                        {/* hapus data */}
                        <button
                          onClick={() =>
                            handleDeleteParticipant(row.pesertaID as string)
                          }
                        >
                          <ButtonComponent intent="Hapus"></ButtonComponent>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                : !loading && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <p className="text-gray-400">Tidak Ada Data.</p>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={participants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
