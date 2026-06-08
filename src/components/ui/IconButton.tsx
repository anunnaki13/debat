import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "prestige";
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      size="icon"
      variant={variant}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </Button>
  );
}
