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
export const addevent = async (eventName: string, organizer: string) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const uid = currentUser.uid;
      await addDoc(collection(db, `users/${uid}/events`), {
        name: eventName,
        createdAt: new Date(),
        organizer: organizer,
      });
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }
  } catch (error) {
    throw new Error("Gagal menambahkan event.");
  }
};

//get event by uid
export const getEvent = async () => {
  try {
    const currentUser = getCurrentUser();
    const eventList: { name: string; createdAt: Date; organizer: string }[] =
      [];

    if (currentUser) {
      const uid = currentUser.uid;
      const q = query(collection(db, `users/${uid}/events`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const { name, createdAt, organizer } = eventData;
        eventList.push({ name, createdAt: createdAt.toDate(), organizer });
      });
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }

    return eventList;
  } catch (error) {
    throw new Error("Gagal mendapatkan event.");
  }
};
