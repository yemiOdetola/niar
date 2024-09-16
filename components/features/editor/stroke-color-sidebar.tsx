import React from "react";
import { ActiveTool, Editor, STROKE_COLOR } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "./color-picker";

interface StrokeColorSidebarProps {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function StrokeColorSidebar({
  activeTool,
  editor,
  onChangeActiveTool,
}: StrokeColorSidebarProps) {
  const value = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] h-full flex flex-col",
        activeTool == "stroke-color" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Stroke Color"
        description="Add stroke color to your element"
        onClose={onClose}
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
    </aside>
  );
}
