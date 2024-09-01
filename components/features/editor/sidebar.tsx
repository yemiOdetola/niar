"use client";

import React from "react";
import SidebarItem from "./sidebar-item";
import {
  ImageIcon,
  LayoutTemplate,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ActiveTool } from "../types";

const tools: {label: any, id: ActiveTool, icon: LucideIcon}[] = [
  {
    label: "Design",
    id: "templates",
    icon: LayoutTemplate,
  },
  {
    label: "Image",
    id: "images",
    icon: ImageIcon,
  },
  {
    label: "Text",
    id: "text",
    icon: Type,
  },
  {
    label: "Shapes",
    id: "shapes",
    icon: Shapes,
  },
  {
    label: "AI",
    id: "ai",
    icon: Sparkles,
  },
  {
    label: "Settings",
    id: "settings",
    icon: Settings,
  },
];

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function Sidebar({
  activeTool,
  onChangeActiveTool,
}: SidebarProps) {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        {tools.map((tool, index) => (
          <SidebarItem
            key={index}
            icon={tool.icon}
            label={tool.label}
            isActive={activeTool === tool.id}
            onClick={() => onChangeActiveTool(tool.id)}
          />
        ))}
      </ul>
    </aside>
  );
}
