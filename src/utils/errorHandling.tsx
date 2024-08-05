import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getCurrentUser } from "./user";

const db = getFirestore();

/**
 * definisi path
 */
export const PARTICIPANTS_PATH = (eventID: string) =>
  `events/${eventID}/participants`;
export const EVENT_PATH = (eventID: string) => `events/${eventID}`;
export const PARTICIPANT_PATH = (eventID: string, pesertaID: string) =>
  `events/${eventID}/participants/${pesertaID}`;

/**
 * penanganan format waktu
 */
export const formatDate = (date: Date | null): string => {
  if (!date) return "-";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Pad single digit numbers with leading zero
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${day} ${months[monthIndex]} ${year} pada ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

/**
 * handle error
 */
export enum ErrorMessages {
  UserNotFound = "Pengguna tidak ditemukan.",
  EventNotFound = "Event tidak ditemukan.",
  ParticipantNotFound = "Peserta tidak ditemukan.",
  DuplicateNoUrut = "Nomor urut sudah digunakan oleh peserta lain.",
}

export const handleError = (error: any, message?: string) => {
  if (error instanceof Error) {
    throw new Error(message || error.message);
  }
  throw new Error(message || "Gagal melakukan operasi.");
};

export const checkUser = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error(ErrorMessages.UserNotFound);
  }
  return currentUser;
};

export const checkEvent = async (eventID: string) => {
  const eventDoc = await getDoc(doc(db, EVENT_PATH(eventID)));
  if (!eventDoc.exists()) {
    throw new Error(ErrorMessages.EventNotFound);
  }
  return eventDoc;
};

export const checkParticipant = async (eventID: string, pesertaID: string) => {
  const participantDoc = await getDoc(
    doc(db, PARTICIPANT_PATH(eventID, pesertaID))
  );
  if (!participantDoc.exists()) {
    throw new Error(ErrorMessages.ParticipantNotFound);
  }
  return participantDoc;
};
