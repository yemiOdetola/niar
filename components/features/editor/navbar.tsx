"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Logo from "./logo";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  CloudUpload,
  Download,
  File,
  FileSearch,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Hint from "@/components/hint";
import { ActiveTool } from "../types";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export default function Navbar({
  activeTool,
  onChangeActiveTool,
}: NavbarProps) {
  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-2">
              <File className="size-8" />
              <div className="f">
                <p className="">open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />
        <Hint label="Select" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(activeTool == "select" && "bg-gray-100")}
            onClick={() => onChangeActiveTool("select")}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>

        <Hint label="Undo" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            className=""
            // onClick={() => onChangeActiveTool("undo")}
          >
            <Undo2 className="size-4" />
          </Button>
        </Hint>

        <Hint label="Redo" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            className=""
            // onClick={() => onChangeActiveTool("redo")}
          >
            <Redo2 className="size-4" />
          </Button>
        </Hint>

        <Separator orientation="vertical" className="mx-2" />

        <div className="flex items-center gap-x-2">
          <CloudUpload className="text-muted-foreground size-[20px]" />
          <div className="text-xs text-muted-foreground">Saved</div>
        </div>

        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                Export
                <Download className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
              <DropdownMenuItem className="flex items-center gap-x-2">
                <File className="size-8" />
                <div>
                  <p className="">JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Save for later
                  </p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-x-2">
                <File className="size-8" />
                <div>
                  <p className="">PNG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for sharing on the web
                  </p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-x-2">
                <FileSearch className="size-8" />
                <div>
                  <p className="">SVG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for editing in vector softwares
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
