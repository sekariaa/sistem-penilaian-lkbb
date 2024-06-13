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
  Timestamp,
  deleteDoc,
  DocumentReference,
} from "firebase/firestore";
import { getCurrentUser } from "./user";

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
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek no urut unik
    const participantQuery = query(
      collection(db, `users/${uid}/events/${eventId}/participants`),
      where("noUrut", "==", noUrut)
    );
    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      throw new Error("Nomor urut sudah digunakan oleh peserta lain.");
    }

    const timestamp = Timestamp.now();
    //tambahkan peserta
    await addDoc(
      collection(db, `users/${uid}/events/${eventId}/participants`),
      {
        noUrut: noUrut,
        namaTim: namaTim,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "Nomor urut sudah digunakan oleh peserta lain."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal menambahkan data peserta.");
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
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek peserta
    const pesertaDoc = await getDoc(
      doc(db, `users/${uid}/events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }

    const timestamp = Timestamp.now();
    const participantRef = doc(
      db,
      `users/${uid}/events/${eventId}/participants/${pesertaId}`
    );

    // Perbarui dokumen dengan nama tim yang baru
    await setDoc(
      participantRef,
      { namaTim: newNamaTim, updatedAt: timestamp },
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
    throw new Error("Gagal mengedit data peserta.");
  }
};

//get all participants by uid+eventid
export const getParticipants = async (eventId: string) => {
  try {
    const participantList: {
      pesertaID: string;
      noUrut: number;
      namaTim: string;
    }[] = [];

    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //ambil data partisipants
    const q = query(
      collection(db, `users/${uid}/events/${eventId}/participants`)
    );
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
export const getParticipant = async (eventId: string, pesertaId: string) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    const q = doc(
      db,
      `users/${uid}/events/${eventId}/participants/${pesertaId}`
    );

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

//delete participant by uid, eventid, dan peserta
export const deleteParticipant = async (eventId: string, pesertaId: string) => {
  try {
    //cek user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //hapus
    const pesertaDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }
    await deleteDoc(
      doc(db, `users/${uid}/events/${eventId}/participants/${pesertaId}`)
    );
    return "Peserta berhasil dihapus.";
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message); // Propagate the error message
    }
    throw new Error("Gagal menghapus peserta.");
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
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek peserta
    const pesertaDoc = await getDoc(
      doc(db, `users/${uid}/events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }

    // Set nilaiData ke dokumen nilai peserta
    const docRef = doc(
      db,
      `users/${uid}/events/${eventId}/participants/${pesertaId}`
    );
    setDoc(docRef, { nilai: nilaiData }, { merge: true });
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
    const uid = currentUser.uid;

    //cek event
    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    //cek peserta
    const pesertaDoc = await getDoc(
      doc(db, `users/${uid}/events/${eventId}/participants/${pesertaId}`)
    );
    if (!pesertaDoc.exists()) {
      throw new Error("ID peserta tidak ditemukan.");
    }
    // Dapatkan referensi dokumen
    const docRef = doc(
      db,
      `users/${uid}/events/${eventId}/participants/${pesertaId}`
    );

    // Ambil dokumen dari Firestore
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const nilaiData = data.nilai;
      return nilaiData;
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
    const uid = currentUser.uid;

    const eventDoc = await getDoc(doc(db, `users/${uid}/events/${eventId}`));
    if (!eventDoc.exists()) {
      throw new Error("ID event tidak ditemukan.");
    }

    const participantsCollectionRef = collection(
      db,
      `users/${uid}/events/${eventId}/participants`
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
): [string, string, number] => {
  const sortedVarfor = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.varfor !== b.nilai.varfor) {
      return b.nilai.varfor - a.nilai.varfor;
    } else {
      return a.juara - b.juara;
    }
  });

  return [
    sortedVarfor[0].pesertaId,
    sortedVarfor[0].namaTim,
    sortedVarfor[0].nilai.varfor,
  ];
};

//masukkan peringkat, getjuaraumum, getbestvarfor kedalam firestor
export const addAllJuara = async (eventId: string) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    // Get all rankings
    const sortedPeserta = await peringkat(eventId);

    // Determine overall winner
    const [juaraUmumId, juaraUmumScore] = getJuaraUmum(sortedPeserta);

    // Determine best varfor
    const [bestVarforId, bestVarforScore] = getBestVarfor(sortedPeserta);

    // Create a reference to the event document
    const eventDocRef = doc(db, `users/${uid}/events/${eventId}`);

    // Update the event document with the new rankings
    await setDoc(
      eventDocRef,
      {
        peringkat: sortedPeserta,
        juaraUmum: {
          pesertaId: juaraUmumId,
          score: juaraUmumScore,
        },
        bestVarfor: {
          pesertaId: bestVarforId,
          score: bestVarforScore,
        },
      },
      { merge: true }
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        "Gagal menambahkan data juara ke Firestore: " + error.message
      );
    } else {
      throw new Error("Gagal menambahkan data juara ke Firestore.");
    }
  }
};
