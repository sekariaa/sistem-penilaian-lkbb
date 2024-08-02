"use client";

import { SidebarButton } from "./SidebarButton";
import { SidebarItems } from "@/types";
import Link from "next/link";
import { Separator } from "../ui-sidebar/Separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui-sidebar/Popover";
import { Button } from "../ui-sidebar/Button";
import { LogOut, MoreHorizontal, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignOut, getCurrentUser } from "../../utils/user";

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const pathname = usePathname();
  const user = getCurrentUser();

  const handleSignOut = async () => {
    try {
      await SignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (linkHref: string) => {
    return pathname === linkHref || pathname.startsWith(`${linkHref}/`);
  };

  return (
    <aside className="w-[270px] max-w-xs h-screen fixed left-0 top-0 z-40 border-r">
      <div className="h-full px-3 py-4">
        <h3 className="mx-3 text-lg font-semibold text-foreground text-center text-black-primary">
          Rekap Pembaris
        </h3>
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full text-black-primary">
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  icon={link.icon}
                  className="w-full"
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
          </div>
          <div className="absolute left-0 bottom-3 w-full px-3">
            <Separator className="absolute -top-3 left-0 w-full" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                      <span className="text-black-primary">{user?.email}</span>
                    </div>
                    <MoreHorizontal size={20} />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mb-2 w-56 p-3 rounded-[1rem]">
                <div className="space-y-1">
                  <SidebarButton
                    size="sm"
                    icon={LogOut}
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Keluar
                  </SidebarButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </aside>
  );
}
