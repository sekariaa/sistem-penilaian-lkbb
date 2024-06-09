import "../services/firebase";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { getCurrentUser } from "./user";

export const db = getFirestore();

//add event by uid
export const addevent = async (eventName: string) => {
  try {
    const uid = getCurrentUser();
    console.log(uid);
    if (uid) {
      await addDoc(collection(db, `users/${uid}/events`), {
        name: eventName,
        createdAt: new Date(),
      });
      console.log("Event berhasil ditambahkan!");
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }
  } catch (error) {
    console.error("Gagal menambahkan event:", error);
    throw new Error("Gagal menambahkan event.");
  }
};

//get event by uid
export const getEvent = async () => {
  try {
    const uid = getCurrentUser();
    const eventList: string[] = [];

    if (uid) {
      const q = query(collection(db, `users/${uid}/events`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        eventList.push(doc.data().name);
      });
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }

    return eventList;
  } catch (error) {
    console.error("Gagal mendapatkan event:", error);
    throw new Error("Gagal mendapatkan event.");
  }
};
