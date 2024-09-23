import { useCallback, useMemo, useState } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-autoresize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  EditorHookProps,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  JSON_KEYS,
  RECTANGLE_OPTIONS,
  RHOMBUS_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "@/components/features/types";
import { useCanvasEvents } from "./use-canvas-events";
import { createFilter, downloadFile, isTypeText, transformText } from "@/lib/utils";
import { useClipboard } from "./use-clipboard";
import { useHotkeys } from "./use-hotkeys";
import { useLoadState } from "./use-load-state";
import { useHistory } from "./use-history";
import { useWindowEvents } from "./use-window-events";

interface UseEditorProps {
  initialCanvas: fabric.Canvas;
  initialContainer: HTMLDivElement;
}

const buildEditor = ({
  save,
  undo,
  redo,
  canRedo,
  canUndo,
  autoZoom,
  copy,
  paste,
  canvas,
  fillColor,
  fontFamily,
  setFontFamily,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
}: BuildEditorProps): Editor => {

  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "svg");
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "jpg");
    autoZoom();
  };

  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);

    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t"),
    )}`;
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data, () => {
      autoZoom();
    });
  };

  const getWorkspace = () => {
    return canvas.getObjects().findLast((object) => object.name == "clip");
  };
  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    if (!center) return;
    //@ts-ignore
    canvas._centerObject(object, center);
    // canvas.centerObject(object);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    savePng,
    saveJpg,
    saveSvg,
    saveJson,
    loadJson,
    canUndo,
    canRedo,
    autoZoom,
    getWorkspace,
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio > 1 ? 1 : zoomRatio
      );
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio
      );
    },

    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set(value);
      autoZoom();
      save();
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
    },
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (image) => {
          const workspace = getWorkspace();

          image.scaleToWidth(workspace?.width || 0);
          image.scaleToHeight(workspace?.height || 0);

          addToCanvas(image);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });

      addToCanvas(object);
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      // @ts-ignore
      const value = selectedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      // @ts-ignore
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      // @ts-ignore
      const value = selectedObject.get("fontFamily") || fontFamily;

      return value;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      // @ts-ignore
      const value = selectedObject.get("textAlign") || "left";

      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      const value = selectedObject.get("underline") || false;

      return value;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      // @ts-ignore
      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          // @ts-ignore
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },

    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") || 1;

      return value;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTypeText(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      canvas.freeDrawingBrush.color = value;
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.freeDrawingBrush.width = value;
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
        rx: 10,
        ry: 10,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: TRIANGLE_OPTIONS.width, y: 0 },
          { x: TRIANGLE_OPTIONS.width / 2, y: TRIANGLE_OPTIONS.height },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },

    addDiamond: () => {
      const object = new fabric.Polygon(
        [
          { x: RHOMBUS_OPTIONS.width / 2, y: 0 },
          { x: RHOMBUS_OPTIONS.width, y: RHOMBUS_OPTIONS.height / 2 },
          { x: RHOMBUS_OPTIONS.width / 2, y: RHOMBUS_OPTIONS.height },
          { x: 0, y: RHOMBUS_OPTIONS.height / 2 },
        ],
        {
          ...RHOMBUS_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return fillColor;

      const value = selectedObject.get("fill") || fillColor;
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return fillColor;

      const value = selectedObject.get("stroke") || strokeColor;
      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeWidth;

      const value = selectedObject.get("strokeWidth") || strokeWidth;
      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeDashArray;

      const value = selectedObject.get("strokeDashArray") || strokeDashArray;
      return value;
    },
    canvas,
    selectedObjects,
  };
};

export const useEditor = ({ clearSelectionCallback, saveCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  useWindowEvents();

  const { 
    save, 
    canRedo, 
    canUndo, 
    undo, 
    redo,
    canvasHistory,
    setHistoryIndex,
  } = useHistory({ 
    canvas,
    saveCallback
  });

  useCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  const { copy, paste } = useClipboard({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useHotkeys({
    undo,
    redo,
    copy,
    paste,
    save,
    canvas,
  });

  // useLoadState({
  //   canvas,
  //   autoZoom,
  //   initialState,
  //   canvasHistory,
  //   setHistoryIndex,
  // });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        save, 
        canRedo, 
        canUndo, 
        undo, 
        redo,
        canvas,
        autoZoom,
        fillColor,
        fontFamily,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
        strokeDashArray,
        setStrokeDashArray,
        setFontFamily,
        copy,
        paste,
      });
    }
    return undefined;
  }, [canvas, save, canRedo, canUndo, undo, redo, autoZoom, fillColor, fontFamily, strokeColor, strokeWidth, selectedObjects, strokeDashArray, copy, paste]);

  const init = useCallback(
    ({ initialCanvas, initialContainer }: UseEditorProps) => {
      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: 700,
        height: 900,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        hasBorders: true,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.1)",
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(
        initialCanvas.toJSON(JSON_KEYS)
      );
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [canvasHistory, setHistoryIndex]
  );

  return { init, editor };
};
