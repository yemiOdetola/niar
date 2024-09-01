import React from "react";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShapeTool from "./shape-tool";
import { Circle, Diamond, Square, Triangle } from "lucide-react";

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function ShapeSidebar({
  activeTool,
  editor,
  onChangeActiveTool,
}: ShapeSidebarProps) {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] h-full flex flex-col",
        activeTool == "shapes" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
        onClose={onClose}
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool onClick={() => editor?.addCircle()} icon={Circle} />
          <ShapeTool onClick={() => editor?.addSoftRectangle()} icon={Square} />
          <ShapeTool onClick={() => editor?.addTriangle()} icon={Triangle} />
          <ShapeTool
            onClick={() => editor?.addInverseTriangle()}
            icon={Triangle}
            iconClassName="rotate-180"
          />
          <ShapeTool onClick={() => editor?.addDiamond()} icon={Diamond} />
        </div>
      </ScrollArea>
    </aside>
  );
}
