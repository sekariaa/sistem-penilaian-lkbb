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

//tipe untuk signin
export interface Signin {
  email: string;
  password: string;
}

//tipe untuk event
export interface EventType {
  eventID: string;
  name: string;
  createdAt: Date;
  organizer: string;
  level: string;
}
