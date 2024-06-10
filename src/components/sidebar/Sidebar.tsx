"use client";

import { Home, SquareGanttChart } from "lucide-react";
import { SidebarDesktop } from "./SidebarDesktop";
import { SidebarItems } from "@/types";
import { useMediaQuery } from "usehooks-ts";
import { SidebarMobile } from "./SidebarMobile";

const sidebarItems: SidebarItems = {
  links: [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Event", href: "/event", icon: SquareGanttChart },
  ],
};

export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
