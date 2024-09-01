import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface ShapeToolProps {
  onClick: () => void;
  icon: LucideIcon;
  iconClassName?: string;
}

export default function ShapeTool({
  onClick,
  icon: Icon,
  iconClassName,
}: ShapeToolProps) {
  return (
    <button onClick={onClick} className="aspect-square border rounded-md p-5">
      <Icon className={cn("w-full h-full", iconClassName)} />
    </button>
  );
}
