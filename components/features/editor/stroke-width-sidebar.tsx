import React from "react";
import { ActiveTool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function StrokeWidthSidebar({
  activeTool,
  editor,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) {
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] h-full flex flex-col",
        activeTool == "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Stroke options"
        description="Modify the stroke of your element"
        onClose={onClose}
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke width</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke Type</Label>
          <Button
            className={cn(
              "w-full h-16 justify-start text-left py-2 px-4",
              JSON.stringify(typeValue) == "[]" && "border-2 border-blue-500"
            )}
            variant="secondary"
            size="lg"
            onClick={() => onChangeStokeType([])}
          >
            <div className="w-full border-black rounded-full border-2" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left py-2 px-4",
              JSON.stringify(typeValue) == "[4,4]" && "border border-blue-500"
            )}
            onClick={() => onChangeStokeType([4, 4])}
          >
            <div className="w-full border-black rounded-full border-dashed border-2" />
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}
