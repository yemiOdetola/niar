import React, { useState } from "react";
import { ActiveTool, Editor } from "../types";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, GalleryHorizontalEnd, GitPullRequestClosedIcon, Grid, LucideLayoutGrid, SlidersHorizontal, WandIcon } from "lucide-react";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function Toolbar({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) {
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();

  if (editor?.selectedObjects.length == 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] gap-x-2">
      <div className="flex items-center justify-center h-full gap-x-2 pl-2">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            size="icon"
            variant="ghost"
            className={cn(activeTool == "fill" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border"
              style={{
                backgroundColor: fillColor,
              }}
            ></div>
          </Button>
        </Hint>

        <Hint label="Stroke color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-color")}
            size="icon"
            variant="ghost"
            className={cn(activeTool == "stroke-color" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border-2 bg-white"
              style={{
                borderColor: strokeColor,
              }}
            ></div>
          </Button>
        </Hint>

        <Hint label="Stroke width" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-width")}
            size="icon"
            variant="ghost"
            className={cn(activeTool == "stroke-width" && "bg-gray-100")}
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </Hint>

        <div className="flex items-center h-full justify-center">
          <Hint label="Bring forward" side="bottom" sideOffset={5}>
            <Button
              onClick={() => editor?.bringForward()}
              size="icon"
              variant="ghost"
            >
              <ArrowUp className="size-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center h-full justify-center">
          <Hint label="Send backwards" side="bottom" sideOffset={5}>
            <Button
              onClick={() => editor?.sendBackwards()}
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="size-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <GitPullRequestClosedIcon className="size-4" />
          </Button>
        </Hint>
      </div>
      </div>
    </div>
  );
}
