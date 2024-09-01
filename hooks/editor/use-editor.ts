import { useCallback, useMemo, useState } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-autoresize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  RHOMBUS_OPTIONS,
  TRIANGLE_OPTIONS,
} from "@/components/features/types";

interface UseEditorProps {
  initialCanvas: fabric.Canvas;
  initialContainer: HTMLDivElement;
}

const buildEditor = ({ canvas }: BuildEditorProps): Editor => {
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
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 10,
        ry: 10,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
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
        }
      );
      addToCanvas(object);
    },

    addDiamond: () => {
      const object = new fabric.Polygon(
        [
          { x: RHOMBUS_OPTIONS.width / 2, y: 0 },
          { x: RHOMBUS_OPTIONS.width, y: RHOMBUS_OPTIONS.height / 2 },
          { x: RHOMBUS_OPTIONS.width/2, y: RHOMBUS_OPTIONS.height },
          { x: 0, y: RHOMBUS_OPTIONS.height / 2 },
        ],
        {
          ...RHOMBUS_OPTIONS,
        }
      );
      addToCanvas(object);
    },
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({ canvas, container });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({ canvas });
    }
    return undefined;
  }, [canvas]);

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

      const test = new fabric.Rect({
        width: 200,
        height: 200,
        fill: "black",
        selectable: true,
        hasControls: true,
      });

      initialCanvas.add(test);
      initialCanvas.centerObject(test);
    },
    []
  );

  return { init, editor };
};
