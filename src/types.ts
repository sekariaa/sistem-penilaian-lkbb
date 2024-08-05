import { Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface SidebarItems {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
}

/**
 * tipe untuk proses signin
 */
export interface SigninType {
  email: string;
  password: string;
}

/**
 * tipe untuk user yang sudah signin
 */
export interface UserType {
  email: string | null;
  uid: string;
}

/**
 * tipe untuk event
 */
export interface EventType {
  eventID: string;
  name: string;
  organizer: string;
  level: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

/**
 * tipe untuk peserta
 */
export interface ParticipantType {
  pesertaID: string;
  noUrut: number;
  namaTim: string;
}

/**
 * tipe untuk nilai
 */
export interface Nilai {
  danton: number;
  juaraUmum: number;
  pbb: number;
  pengurangan: number;
  peringkat: number;
  varfor: number;
}

/**
 * tipe untuk NilaiPeserta
 * memperluas ParticipantType dan menambahkan properti nilai yang memiliki tipe Nilai
 */
export interface NilaiPeserta extends ParticipantType {
  nilai: Nilai;
}

/**
 * tipe untuk
 * memperluas NilaiPeserta dan menambahkan properti juara
 */
export interface HasilPemeringkatan extends NilaiPeserta {
  juara: number;
}
