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

//add event by uid
export const addevent = async (
  eventName: string,
  organizer: string,
  level: string
) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const uid = currentUser.uid;
      await addDoc(collection(db, `users/${uid}/events`), {
        name: eventName,
        createdAt: new Date(),
        organizer: organizer,
        level: level,
      });
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }
  } catch (error) {
    throw new Error("Gagal menambahkan event.");
  }
};

//get all event by uid
export const getEvents = async () => {
  try {
    const currentUser = getCurrentUser();
    const eventList: {
      eventID: string;
      name: string;
      createdAt: Date;
      organizer: string;
      level: string;
    }[] = [];

    if (currentUser) {
      const uid = currentUser.uid;
      const q = query(
        collection(db, `users/${uid}/events`),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const { name, createdAt, organizer, level } = eventData;
        eventList.push({
          eventID: doc.id,
          name,
          createdAt: createdAt.toDate(),
          organizer,
          level,
        });
      });
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }

    return eventList;
  } catch (error) {
    throw new Error("Gagal mendapatkan event.");
  }
};

//get single event by uid dan id
export const getEvent = async (eventID: string) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const uid = currentUser.uid;
      const q = doc(db, `users/${uid}/events/${eventID}`);
      const docSnap = await getDoc(q);
      if (docSnap.exists()) {
        const eventData = docSnap.data();
        return {
          eventID: docSnap.id,
          name: eventData.name,
          organizer: eventData.organizer,
          level: eventData.level,
          updatedAt: eventData.updatedAt,
        };
      } else {
        throw new Error("Event tidak ditemukan.");
      }
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }
  } catch (error) {
    throw new Error("Gagal mendapatkan event.");
  }
};
