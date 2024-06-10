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
} from "firebase/firestore";
import { getCurrentUser } from "./user";

export const db = getFirestore();

//add event by uid+eventId
export const addParticipant = async (
  eventId: string,
  noUrut: string,
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

    //cek no urut hanya boleh angka
    if (!/^\d+$/.test(noUrut)) {
      throw new Error("Nomor urut hanya boleh berisi angka.");
    }

    //tambahkan peserta
    await addDoc(
      collection(db, `users/${uid}/events/${eventId}/participants`),
      {
        noUrut: noUrut,
        namaTim: namaTim,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Pengguna tidak ditemukan." ||
        error.message === "ID event tidak ditemukan." ||
        error.message === "Nomor urut sudah digunakan oleh peserta lain." ||
        error.message === "Nomor urut hanya boleh berisi angka."
      ) {
        throw error;
      }
    }
    throw new Error("Gagal menambahkan data peserta.");
  }
};

//get all participants by uid+eventid
export const getParticipants = async (eventId: string) => {
  try {
    const currentUser = getCurrentUser();
    const participantList: {
      noUrut: string;
      namaTim: string;
    }[] = [];

    //cek uid
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    //cek event
    if (!eventId) {
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
  participantId: string
) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    const uid = currentUser.uid;

    const q = doc(
      db,
      `users/${uid}/events/${eventId}/participants/${participantId}`
    );

    const docSnap = await getDoc(q);

    if (!docSnap.exists()) {
      throw new Error("Data peserta tidak ditemukan.");
    }

    const participantData = docSnap.data();

    if (!participantData) {
      throw new Error("Data peserta tidak ditemukan.");
    }

    return {
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
