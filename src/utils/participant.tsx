import "../services/firebase";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getCurrentUser } from "./user";
import { ParticipantType } from "../types";

export const db = getFirestore();

// Definisi interface
interface Nilai {
  [key: string]: number;
}

interface NilaiPeserta {
  pesertaId: string;
  nilai: Nilai;
  namaTim: string;
  noUrut: number;
}

interface Peringkat extends NilaiPeserta {
  juara: number;
}

//add event by uid+eventId
export const addParticipant = async (
  eventId: string,
  noUrut: number,
  namaTim: string
) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek no urut unik
    const participantQuery = query(
      collection(db, `events/${eventId}/participants`),
      where("noUrut", "==", noUrut)
    );
    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      throw new Error("Nomor urut sudah digunakan oleh peserta lain.");
    }

    //tambahkan peserta
    await addDoc(collection(db, `events/${eventId}/participants`), {
      noUrut: noUrut,
      namaTim: namaTim,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    //updatedAt event
    await setDoc(
      doc(db, `events/${eventId}`),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error: any) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "Nomor urut sudah digunakan oleh peserta lain."
      ) {
        throw error;
      }
    }
    throw new Error(error.message);
  }
};

//get all participants by uid+eventid
export const getParticipants = async (eventId: string) => {
  try {
    const participantList: ParticipantType[] = [];

    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //ambil data partisipants
    const q = query(collection(db, `events/${eventId}/participants`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const participantData = doc.data();
      const { noUrut, namaTim } = participantData;
      participantList.push({
        pesertaID: doc.id,
        noUrut: noUrut,
        namaTim: namaTim,
      });
    });
    return participantList;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal mendapatkan data peserta.");
  }
};

//get single participant by uid dan eventid
export const getParticipant = async (
  eventId: string,
  pesertaId: string
): Promise<ParticipantType> => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    const q = doc(db, `events/${eventId}/participants/${pesertaId}`);

    const docSnap = await getDoc(q);

    if (!docSnap.exists()) {
      throw new Error("Event tidak ditemukan.");
    }

    const participantData = docSnap.data();

    if (!participantData) {
      throw new Error("Data peserta tidak ditemukan.");
    }

    return {
      pesertaID: docSnap.id,
      noUrut: participantData.noUrut,
      namaTim: participantData.namaTim,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "Event tidak ditemukan." ||
        error.message === "Data peserta tidak ditemukan."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal mendapatkan data peserta.");
  }
};

// edit participant
export const editParticipant = async (
  eventId: string,
  pesertaId: string,
  newNamaTim: string
) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek peserta
    const pesertaDoc = await getDoc(
      doc(db, `events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }

    const participantRef = doc(
      db,
      `events/${eventId}/participants/${pesertaId}`
    );

    // Perbarui dokumen dengan nama tim yang baru
    await setDoc(
      participantRef,
      { namaTim: newNamaTim, updatedAt: serverTimestamp() },
      { merge: true }
    );

    const pesertaData = pesertaDoc.data();
    if (pesertaData && pesertaData.nilai) {
      // Update event's updatedAt field
      await setDoc(
        doc(db, `events/${eventId}`),
        { updatedAt: serverTimestamp() },
        { merge: true }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "ID peserta tidak ditemukan."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal mengedit data peserta.");
  }
};

//delete participant by uid, eventid, dan peserta
export const deleteParticipant = async (eventId: string, pesertaId: string) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //hapus
    const pesertaDoc = await getDoc(
      doc(db, `events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }

    const pesertaData = pesertaDoc.data();
    if (pesertaData && pesertaData.nilai) {
      // Update event's updatedAt field
      await setDoc(
        doc(db, `events/${eventId}`),
        { updatedAt: serverTimestamp() },
        { merge: true }
      );
    }

    await deleteDoc(doc(db, `events/${eventId}/participants/${pesertaId}`));
    return "Peserta berhasil dihapus.";
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message); // Propagate the error message
    }
    throw new Error(error.message);
  }
};

//add nilai participant by uid, eventID, pesertaID
export const saveNilai = async (
  eventId: string,
  pesertaId: string,
  nilaiData: any
) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek peserta
    const pesertaDoc = await getDoc(
      doc(db, `events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }
    const dataToSave = {
      ...nilaiData,
      updatedAt: serverTimestamp(),
    };

    // Set nilaiData ke dokumen nilai peserta
    const docRef = doc(db, `events/${eventId}/participants/${pesertaId}`);
    await setDoc(docRef, { nilai: dataToSave }, { merge: true });

    // updatedat event
    await setDoc(
      doc(db, `events/${eventId}`),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "ID peserta tidak ditemukan."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal menambahkan data.");
  }
};

// Fungsi untuk mendapatkan nilai peserta berdasarkan uid, eventID, pesertaID
export const getNilai = async (eventId: string, pesertaId: string) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    //cek event
    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek peserta
    const pesertaDoc = await getDoc(
      doc(db, `events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }
    // Dapatkan referensi dokumen
    const docRef = doc(db, `events/${eventId}/participants/${pesertaId}`);

    // Ambil dokumen dari Firestore
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const nilaiData = data.nilai;
      const updatedAt = data.nilai.updatedAt;
      return { nilaiData, updatedAt };
    } else {
      throw new Error("Tidak ada Data. Lakukan upload dokumen!");
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "ID peserta tidak ditemukan." ||
        error.message === "Tidak ada Data. Lakukan upload dokumen!"
      ) {
        throw error;
      }
    }
    throw new Error("Gagal menambahkan data.");
  }
};

export const getAllNilai = async (eventId: string): Promise<NilaiPeserta[]> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    const eventDoc = await getDoc(doc(db, `events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    const participantsCollectionRef = collection(
      db,
      `events/${eventId}/participants`
    );
    const participantsSnapshot = await getDocs(participantsCollectionRef);

    if (participantsSnapshot.empty) {
      throw new Error("Tidak ada peserta ditemukan.");
    }

    const allNilai: NilaiPeserta[] = [];
    participantsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.nilai) {
        allNilai.push({
          pesertaId: doc.id,
          nilai: data.nilai,
          namaTim: data.namaTim,
          noUrut: data.noUrut,
        });
      }
    });

    return allNilai;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "ID peserta tidak ditemukan." ||
        error.message === "Tidak ada Data."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal menambahkan data.");
  }
};

export const peringkat = async (eventId: string): Promise<Peringkat[]> => {
  try {
    const allNilai: NilaiPeserta[] = await getAllNilai(eventId);

    const sortedPeserta: Peringkat[] = allNilai
      .sort((a, b) => {
        if (a.nilai.peringkat !== b.nilai.peringkat) {
          return b.nilai.peringkat - a.nilai.peringkat;
        } else if (a.nilai.pbb !== b.nilai.pbb) {
          return b.nilai.pbb - a.nilai.pbb;
        } else if (a.nilai.danton !== b.nilai.danton) {
          return b.nilai.danton - a.nilai.danton;
        } else {
          return a.nilai.pengurangan - b.nilai.pengurangan;
        }
      })
      .map((peserta, index) => ({
        ...peserta,
        juara: index + 1,
      }));
    return sortedPeserta;
  } catch (error) {
    throw new Error("Gagal menghitung peringkat.");
  }
};

export const getJuaraUmum = (
  sortedPeserta: Peringkat[]
): [string, string, number] => {
  const sortedJuaraUmum = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.juaraUmum !== b.nilai.juaraUmum) {
      return b.nilai.juaraUmum - a.nilai.juaraUmum;
    } else {
      return a.juara - b.juara;
    }
  });

  return [
    sortedJuaraUmum[0].pesertaId,
    sortedJuaraUmum[0].namaTim,
    sortedJuaraUmum[0].nilai.juaraUmum,
  ];
};

export const getBestVarfor = (
  sortedPeserta: Peringkat[]
): [string, string, number][] => {
  const sortedVarfor = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.varfor !== b.nilai.varfor) {
      return b.nilai.varfor - a.nilai.varfor;
    } else {
      return a.juara - b.juara;
    }
  });

  // // Get the top 10 entries
  const top10 = sortedVarfor.slice(0, 10);

  // // Map the top 10 entries to the required format
  return top10.map((entry) => [
    entry.pesertaId,
    entry.namaTim,
    entry.nilai.varfor,
  ]);
};

export const getBestPBB = (
  sortedPeserta: Peringkat[]
): [string, string, number][] => {
  const sortedpbb = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.pbb !== b.nilai.pbb) {
      return b.nilai.pbb - a.nilai.pbb;
    } else {
      return a.juara - b.juara;
    }
  });

  // // Get the top 3 entries
  const top3 = sortedpbb.slice(0, 3);

  // // Map the top 3 entries to the required format
  return top3.map((entry) => [entry.pesertaId, entry.namaTim, entry.nilai.pbb]);
};

export const getBestDanton = (
  sortedPeserta: Peringkat[]
): [string, string, number][] => {
  const sortedDanton = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.danton !== b.nilai.danton) {
      return b.nilai.danton - a.nilai.danton;
    } else {
      return a.juara - b.juara;
    }
  });

  // // Get the top 3 entries
  const top3 = sortedDanton.slice(0, 3);

  // // Map the top 3 entries to the required format
  return top3.map((entry) => [
    entry.pesertaId,
    entry.namaTim,
    entry.nilai.danton,
  ]);
};
