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
  orderBy,
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

//get single event by uid dan id
export const getEvent = async (eventID: string) => {
  try {
    const eventRef = doc(db, `events/${eventID}`);
    const docSnap = await getDoc(eventRef);

    if (docSnap.exists()) {
      const eventData = docSnap.data();

      // Extract basic event details
      const basicEventData = {
        eventID: docSnap.id,
        name: eventData.name,
        organizer: eventData.organizer,
        level: eventData.level,
        updatedAt: eventData.updatedAt,
      };
      const bestVarfor = eventData.bestVarfor || {};
      const juaraUmum = eventData.juaraUmum || {};
      const bestPBB = eventData.bestPBB || {};
      const bestDanton = eventData.bestDanton || {};
      const peringkat = eventData.peringkat || [];

      return {
        ...basicEventData,
        bestVarfor,
        juaraUmum,
        peringkat,
        bestPBB,
        bestDanton,
      };
    } else {
      throw new Error("Event tidak ditemukan.");
    }
  } catch (error) {
    throw new Error("Gagal mendapatkan event.");
  }
};

export const peringkat = async (eventId: string): Promise<Peringkat[]> => {
  try {
    // Get the event data including additional fields
    const eventData = await getEvent(eventId);

    // Extract peringkat array from eventData
    const allNilai: NilaiPeserta[] = eventData.peringkat;

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
  // // Get the top 10 entries
  const top10 = sortedpbb.slice(0, 3);

  // // Map the top 10 entries to the required format
  return top10.map((entry) => [
    entry.pesertaId,
    entry.namaTim,
    entry.nilai.pbb,
  ]);
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
  // // Get the top 10 entries
  const top10 = sortedDanton.slice(0, 3);

  // // Map the top 10 entries to the required format
  return top10.map((entry) => [
    entry.pesertaId,
    entry.namaTim,
    entry.nilai.danton,
  ]);
};
