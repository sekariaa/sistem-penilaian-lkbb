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
} from "firebase/firestore";
import { getCurrentUser } from "./user";

export const db = getFirestore();

//hitung peringkat berdasarkan uid, eventid dari nilai peserta
