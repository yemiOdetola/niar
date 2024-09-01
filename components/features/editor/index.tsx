"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useEditor } from "@/hooks/editor/use-editor";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import Footer from "./footer";
import { ActiveTool } from "../types";
import ShapeSidebar from "./shape-sidebar";

export default function Editor() {
  const { init, editor } = useEditor();

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      controlsAboveOverlay: true,
    });
    init({ initialCanvas: canvas, initialContainer: containerRef.current! });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  const onchangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool == activeTool) {
        return setActiveTool("select");
      }

      if (tool == "draw") {
      }

      if (activeTool == "draw") {
      }

      setActiveTool(tool);
    },
    [activeTool]
  );

  return (
    <div className="h-full flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onchangeActiveTool} />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onchangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onchangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-red-100"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
