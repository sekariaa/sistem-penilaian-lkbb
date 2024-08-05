import "../services/firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { EventType } from "../types";
import { checkEvent, checkUser, handleError } from "./errorHandling";

const db = getFirestore();

export const addevent = async (
  eventName: string,
  organizer: string,
  level: string
) => {
  try {
    //cek user
    const { uid } = checkUser();

    await addDoc(collection(db, `events`), {
      name: eventName,
      organizer: organizer,
      level: level,
      creatorUID: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleError(error);
  }
};

//get all event by uid
export const getEvents = async () => {
  try {
    //cek user
    const { uid } = checkUser();
    const eventList: EventType[] = [];

    const q = query(
      collection(db, "events"),
      where("creatorUID", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      /**
       * destructuring
       */
      const { name, createdAt, updatedAt, organizer, level } = eventData;
      eventList.push({
        eventID: doc.id,
        name,
        organizer,
        level,
        createdAt,
        updatedAt,
      });
    });

    return eventList;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const getEvent = async (eventID: string): Promise<EventType | null> => {
  try {
    //cek event
    const eventDoc = await checkEvent(eventID);
    const eventData = eventDoc.data();
    return {
      eventID: eventDoc.id,
      name: eventData.name,
      organizer: eventData.organizer,
      level: eventData.level,
      updatedAt: eventData.updatedAt,
      createdAt: eventData.createdAt,
    };
  } catch (error: any) {
    handleError(error);
    return null;
  }
};
