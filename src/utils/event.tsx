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
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getCurrentUser } from "./user";
import { EventType } from "../types";

export const db = getFirestore();

export const addevent = async (
  eventName: string,
  organizer: string,
  level: string
) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }
    const uid = currentUser.uid;

    await addDoc(collection(db, `events`), {
      name: eventName,
      organizer: organizer,
      level: level,
      creatorUID: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error: any) {
    console.error("Gagal menambahkan event:", error.message);
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
      organizer: string;
      level: string;
      creatorUID: string;
      createdAt: Timestamp;
      updatedAt: Timestamp;
    }[] = [];

    if (currentUser) {
      const uid = currentUser.uid;
      const q = query(
        collection(db, "events"),
        where("creatorUID", "==", uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const { name, createdAt, updatedAt, organizer, level, creatorUID } =
          eventData;
        eventList.push({
          eventID: doc.id,
          name,
          organizer,
          level,
          createdAt,
          updatedAt,
          creatorUID,
        });
      });
      console.log(eventList);
    } else {
      throw new Error("Pengguna tidak ditemukan.");
    }

    return eventList;
  } catch (error) {
    throw new Error("Gagal mendapatkan event.");
  }
};

export const getEvent = async (eventID: string): Promise<EventType> => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const uid = currentUser.uid;
      const q = doc(db, `events/${eventID}`);
      const docSnap = await getDoc(q);

      if (docSnap.exists()) {
        const eventData = docSnap.data();
        if (eventData.creatorUID === uid) {
          return {
            eventID: docSnap.id,
            name: eventData.name,
            organizer: eventData.organizer,
            level: eventData.level,
            updatedAt: eventData.updatedAt,
            createdAt: eventData.createdAt,
          };
        } else {
          throw new Error("Anda tidak diizinkan untuk mengakses event ini.");
        }
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
