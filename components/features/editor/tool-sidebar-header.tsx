import { ChevronsLeft } from "lucide-react";
import React from "react";

interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
}

export default function ToolSidebarHeader({
  title,
  description,
  onClose,
}: ToolSidebarHeaderProps) {
  return (
    <div className="p-4 border-b space-y-1 h-[68px] flex items-center justify-between">
      <div className="w-3/4">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="outline-none border-none m-2 absolute top-1/2 -right-[1.80rem] bg-white h-[70px] 
        transform -translate-y-1/2 flex items-center justify-center rounded-r-xl pr-2 border-r border-y group"
      >
        <ChevronsLeft className="size-4 text-black group-hover:opacity-75 transition" />
      </button>
    </div>
  );
}
