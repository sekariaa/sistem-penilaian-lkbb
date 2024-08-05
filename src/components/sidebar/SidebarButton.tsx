import { LucideIcon } from "lucide-react";
import { Button, ButtonProps } from "../ui-sidebar/Button";
import { cn } from "@/lib/utils";
import { SheetClose } from "../ui-sidebar/Sheet";
import { SvgIconComponent } from "@mui/icons-material";

interface SidebarButtonProps extends ButtonProps {
  icon?: LucideIcon | SvgIconComponent;
}

/**
 * SidebarButton: untuk membuat tombol sidebar biasa tanpa  menutup sheet
 * SideBarButtonSheet: untuk membuat tombol ditambah dengan langsung menutup sheet
 */
export function SidebarButton({
  icon: Icon,
  className,
  children,
  ...props
}: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn("gap-2 justify-start", className)}
      {...props}
    >
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </Button>
  );
}

export function SidebarButtonSheet(props: SidebarButtonProps) {
  return (
    <SheetClose asChild>
      <SidebarButton {...props} />
    </SheetClose>
  );
}
