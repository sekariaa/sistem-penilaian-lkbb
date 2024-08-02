import { Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface SidebarItems {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
  extras?: ReactNode;
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
 *
 */
export interface ParticipantType {
  pesertaID: string;
  noUrut: number;
  namaTim: string;
}
