import { useCallback, useState } from "react";
import {fabric} from 'fabric';
import { useAutoResize } from "./use-autoresize";

interface UseEditorProps {
  initialCanvas: fabric.Canvas;
  initialContainer: HTMLDivElement;
}

export const useEditor = () => {

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({canvas, container});

  const init = useCallback(({ initialCanvas, initialContainer }: UseEditorProps) =>  {

    fabric.Object.prototype.set({
      cornerColor: '#FFF',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      borderScaleFactor: 1,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: '#3b82f6',
    })

    const initialWorkspace = new fabric.Rect({
      width: 700,
      height: 900,
      name: 'clip',
      fill: 'white',
      selectable: false,
      hasControls: false,
      hasBorders: true,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.1)',
        blur: 5,
      })
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
      fill: 'black',
      selectable: true,
      hasControls: true,
    })

    initialCanvas.add(test);
    initialCanvas.centerObject(test);
  }, []);

  return { init };
};
