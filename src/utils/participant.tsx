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
import {
  ParticipantType,
  NilaiPeserta,
  HasilPemeringkatan,
  Nilai,
} from "../types";
import {
  checkUser,
  checkEvent,
  checkParticipant,
  EVENT_PATH,
  PARTICIPANTS_PATH,
  PARTICIPANT_PATH,
  ErrorMessages,
  handleError,
} from "./errorHandling";

const db = getFirestore();

//add event by uid+eventID
export const addParticipant = async (
  eventID: string,
  noUrut: number,
  namaTim: string
) => {
  try {
    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);

    //cek no urut unik
    const participantQuery = query(
      collection(db, PARTICIPANTS_PATH(eventID)),
      where("noUrut", "==", noUrut)
    );
    const participantSnapshot = await getDocs(participantQuery);
    if (!participantSnapshot.empty) {
      throw new Error(ErrorMessages.DuplicateNoUrut);
    }

    //tambahkan peserta
    await addDoc(collection(db, PARTICIPANTS_PATH(eventID)), {
      noUrut,
      namaTim,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    //updatedAt event
    await setDoc(
      doc(db, EVENT_PATH(eventID)),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    handleError(error);
  }
};

//get all participants by uid+eventid
export const getParticipants = async (eventID: string) => {
  try {
    const participantList: ParticipantType[] = [];

    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);

    //ambil data partisipants
    const q = query(collection(db, PARTICIPANTS_PATH(eventID)));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const participantData = doc.data();
      const { noUrut, namaTim } = participantData;
      participantList.push({
        pesertaID: doc.id,
        noUrut,
        namaTim,
      });
    });
    return participantList;
  } catch (error) {
    handleError(error);
    return [];
  }
};

//get single participant by uid dan eventid
export const getParticipant = async (
  eventID: string,
  pesertaID: string
): Promise<ParticipantType> => {
  try {
    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);
    //cek peserta
    const participant = await checkParticipant(eventID, pesertaID);
    const participantData = participant.data();
    return {
      pesertaID: participant.id,
      noUrut: participantData.noUrut,
      namaTim: participantData.namaTim,
    };
  } catch (error) {
    handleError(error);
    return {
      pesertaID: "",
      noUrut: 0,
      namaTim: "",
    };
  }
};

// edit participant
export const editParticipant = async (
  eventID: string,
  pesertaID: string,
  newNamaTim: string
) => {
  try {
    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);
    //cek peserta
    await checkParticipant(eventID, pesertaID);
    // data yang ada di dokumen tidak akan ditimpa sepenuhnya. hanya field namaTim dan updatedAt yang akan diperbarui, dan field lainnya di dokumen akan tetap utuh
    await setDoc(
      doc(db, PARTICIPANT_PATH(eventID, pesertaID)),
      { namaTim: newNamaTim, updatedAt: serverTimestamp() },
      { merge: true }
    );
    //updatedAt event
    await setDoc(
      doc(db, EVENT_PATH(eventID)),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    handleError(error);
  }
};

//delete participant by uid, eventid, dan peserta
export const deleteParticipant = async (eventID: string, pesertaID: string) => {
  try {
    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);
    //cek peserta
    await checkParticipant(eventID, pesertaID);
    //hapus
    await deleteDoc(doc(db, PARTICIPANT_PATH(eventID, pesertaID)));
  } catch (error) {
    handleError(error);
  }
};

//add nilai participant by uid, eventID, pesertaID
export const saveNilai = async (
  eventID: string,
  pesertaID: string,
  nilaiData: Nilai
) => {
  try {
    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);
    //cek peserta
    await checkParticipant(eventID, pesertaID);

    const dataToSave = {
      ...nilaiData,
      updatedAt: serverTimestamp(),
    };

    // Set nilaiData ke dokumen nilai peserta
    await setDoc(
      doc(db, PARTICIPANT_PATH(eventID, pesertaID)),
      { nilai: dataToSave },
      { merge: true }
    );

    //updatedAt event
    await setDoc(
      doc(db, EVENT_PATH(eventID)),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    handleError(error);
  }
};

// Fungsi untuk mendapatkan nilai peserta berdasarkan uid, eventID, pesertaID
export const getNilai = async (eventID: string, pesertaID: string) => {
  try {
    //cek user
    await checkUser();
    //cek event
    await checkEvent(eventID);
    //cek peserta
    const doc = await checkParticipant(eventID, pesertaID);
    const data = doc.data();
    const nilaiData = data.nilai;
    const updatedAt = data.nilai.updatedAt;
    return { nilaiData, updatedAt };
  } catch (error) {
    handleError(error);
    return {};
  }
};

export const getAllNilai = async (eventID: string): Promise<NilaiPeserta[]> => {
  try {
    //cek event
    await checkEvent(eventID);

    const participantsRef = collection(db, PARTICIPANTS_PATH(eventID));
    const participants = await getDocs(participantsRef);

    const allNilai: NilaiPeserta[] = [];
    //melakukan iterasi pada setiap dokumen dalam koleksi peserta.
    participants.forEach((participant) => {
      const data = participant.data(); //mengambiul data nya lalu dimasukkan ke array
      if (data.nilai) {
        allNilai.push({
          pesertaID: participant.id,
          nilai: data.nilai,
          namaTim: data.namaTim,
          noUrut: data.noUrut,
        });
      }
    });
    return allNilai;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const peringkat = async (
  eventID: string
): Promise<HasilPemeringkatan[]> => {
  try {
    const allNilai: NilaiPeserta[] = await getAllNilai(eventID);

    /**
     * mengurutkan berdasarkan peringkat. semakin tinggi peringkat, semakin tinggi posisi peserta dalam urutan.
     * jika peringkat sama, mengurutkan berdasarkan pbb
     * jika pbb juga sama, mengurutkan berdasarkan danton
     * jika danton juga sama, mengurutkan berdasarkan pengurangan. dalam kasus ini, nilai pengurangan yang lebih rendah akan memiliki posisi lebih tinggi
     */
    const sortedPeserta: HasilPemeringkatan[] = allNilai
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
        //setelah pengurutan selesai, map untuk menambahkan properti juara pada setiap objek peserta
        ...peserta, //menyalin semua properti ke dalam sortedPeserta
        juara: index + 1,
      }));
    return sortedPeserta;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * menentukan pemenang dengan nilai juaraUmum tertinggi dari daftar peserta yang sudah diurutkan
 */
export const getJuaraUmum = (
  sortedPeserta: HasilPemeringkatan[]
): [string, string, number] => {
  //spread operator: membuat salinan dari array
  const sortedJuaraUmum = [...sortedPeserta].sort((a, b) => {
    /**
     * jika nilai juaraUmum dari peserta a berbeda dari peserta b, maka pengurutan dilakukan berdasarkan nilai juaraUmum tertinggi di atas
     * jika nilai juaraUmum dari peserta a dan b sama, pengurutan dilakukan berdasarkan urutan juara
     */
    if (a.nilai.juaraUmum !== b.nilai.juaraUmum) {
      return b.nilai.juaraUmum - a.nilai.juaraUmum;
    } else {
      return a.juara - b.juara;
    }
  });

  return [
    sortedJuaraUmum[0].pesertaID,
    sortedJuaraUmum[0].namaTim,
    sortedJuaraUmum[0].nilai.juaraUmum,
  ];
};

export const getBestVarfor = (
  sortedPeserta: HasilPemeringkatan[]
): [string, string, number][] => {
  const sortedVarfor = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.varfor !== b.nilai.varfor) {
      return b.nilai.varfor - a.nilai.varfor;
    } else {
      return a.juara - b.juara;
    }
  });

  /**
   * mendapatkan 10 besar varfor
   */
  const top10 = sortedVarfor.slice(0, 10);
  return top10.map((entry) => [
    entry.pesertaID,
    entry.namaTim,
    entry.nilai.varfor,
  ]);
};

export const getBestPBB = (
  sortedPeserta: HasilPemeringkatan[]
): [string, string, number][] => {
  const sortedpbb = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.pbb !== b.nilai.pbb) {
      return b.nilai.pbb - a.nilai.pbb;
    } else {
      return a.juara - b.juara;
    }
  });

  /**
   * mendapatkan 3 besar pbb
   */
  const top3 = sortedpbb.slice(0, 3);
  return top3.map((entry) => [entry.pesertaID, entry.namaTim, entry.nilai.pbb]);
};

export const getBestDanton = (
  sortedPeserta: HasilPemeringkatan[]
): [string, string, number][] => {
  const sortedDanton = [...sortedPeserta].sort((a, b) => {
    if (a.nilai.danton !== b.nilai.danton) {
      return b.nilai.danton - a.nilai.danton;
    } else {
      return a.juara - b.juara;
    }
  });

  /**
   * mendapatkan 3 besar danton
   */
  const top3 = sortedDanton.slice(0, 3);
  return top3.map((entry) => [
    entry.pesertaID,
    entry.namaTim,
    entry.nilai.danton,
  ]);
};

/**
 * array dua dimensi dengan 3 baris, di mana setiap baris adalah array satu dimensi berisi:

danton[0]: ID peserta (misalnya "P1")
danton[1]: Nama tim
danton[2]: Nilai
 */

// const maxBestDanton = [
//   ['P1', 'Tim A', 90],
//   ['P3', 'Tim C', 90],
//   ['P4', 'Tim D', 88],
// ];

//   const getBestDantonValue = (pesertaID) => {
//     const value = maxBestDanton.find((danton) => danton[0] === pesertaID)
//       ? maxBestDanton.findIndex((danton) => danton[0] === pesertaID) + 1
//       : "-";
//     return value;
//   };

//   console.log(getBestDantonValue("P2"))
