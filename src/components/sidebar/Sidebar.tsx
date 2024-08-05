"use client";

import { Home, SquareGanttChart } from "lucide-react";
import { SidebarDesktop } from "./SidebarDesktop";
import { SidebarItems } from "@/types";
import { useMediaQuery } from "usehooks-ts";
import { SidebarMobile } from "./SidebarMobile";

/**
 * menyediakan data yang dibutuhkan untuk item-item sidebar
 */
const sidebarItems: SidebarItems = {
  links: [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Event", href: "/event", icon: SquareGanttChart },
  ],
};

export function Sidebar() {
  /**
   * mengecek apakah lebar viewport saat ini adalah minimal 640px.
   */
  const isDesktop = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
