import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  Rect,
  IText,
  Line,
  FabricObject,
  Point,
} from "fabric";

import Toolbar from "../components/Toolbar";

const BoardCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fabricRef = useRef<Canvas | null>(null);

  // Pan State
  const isPanning = useRef(false);

  const lastPosX = useRef(0);
  const lastPosY = useRef(0);

  // Connect Mode
  const [connectMode, setConnectMode] =
    useState(false);

  const connectModeRef = useRef(false);

  const selectedObjects = useRef<FabricObject[]>(
    []
  );

  // ----------------------------
  // KEEP REF UPDATED
  // ----------------------------
  useEffect(() => {
    connectModeRef.current = connectMode;
  }, [connectMode]);

  // ----------------------------
  // CANVAS SETUP
  // ----------------------------
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(
      canvasRef.current,
      {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#0f172a",
        selection: true,
      }
    );

    fabricRef.current = fabricCanvas;

    // ----------------------------
    // ZOOM
    // ----------------------------
    fabricCanvas.on("mouse:wheel", (opt) => {
      const event = opt.e as WheelEvent;

      let zoom = fabricCanvas.getZoom();

      zoom *= 0.999 ** event.deltaY;

      if (zoom > 3) zoom = 3;
      if (zoom < 0.3) zoom = 0.3;

      fabricCanvas.zoomToPoint(
        new Point(
          event.offsetX,
          event.offsetY
        ),
        zoom
      );

      event.preventDefault();
      event.stopPropagation();
    });

    // ----------------------------
    // MOUSE DOWN
    // ----------------------------
    fabricCanvas.on("mouse:down", (opt) => {
      const event = opt.e as MouseEvent;

      // ALT PAN
      if (event.altKey) {
        isPanning.current = true;

        fabricCanvas.selection = false;

        lastPosX.current = event.clientX;
        lastPosY.current = event.clientY;
      }

      // CONNECT MODE
      if (
        connectModeRef.current &&
        opt.target
      ) {
        selectedObjects.current.push(opt.target);

        // SECOND OBJECT
        if (
          selectedObjects.current.length === 2
        ) {
          const obj1 =
            selectedObjects.current[0];

          const obj2 =
            selectedObjects.current[1];

          const x1 =
            (obj1.left || 0) +
            ((obj1.width || 0) *
              (obj1.scaleX || 1)) /
              2;

          const y1 =
            (obj1.top || 0) +
            ((obj1.height || 0) *
              (obj1.scaleY || 1)) /
              2;

          const x2 =
            (obj2.left || 0) +
            ((obj2.width || 0) *
              (obj2.scaleX || 1)) /
              2;

          const y2 =
            (obj2.top || 0) +
            ((obj2.height || 0) *
              (obj2.scaleY || 1)) /
              2;

          const line = new Line(
            [x1, y1, x2, y2],
            {
              stroke: "#22c55e",
              strokeWidth: 4,
              selectable: false,
              evented: false,
            }
          );

          fabricCanvas.add(line);

          fabricCanvas.sendObjectToBack(
            line
          );

          selectedObjects.current = [];

          setConnectMode(false);

          fabricCanvas.renderAll();
        }
      }
    });

    // ----------------------------
    // PANNING
    // ----------------------------
    fabricCanvas.on("mouse:move", (opt) => {
      if (!isPanning.current) return;

      const event = opt.e as MouseEvent;

      const vpt =
        fabricCanvas.viewportTransform;

      if (!vpt) return;

      vpt[4] +=
        event.clientX - lastPosX.current;

      vpt[5] +=
        event.clientY - lastPosY.current;

      fabricCanvas.requestRenderAll();

      lastPosX.current = event.clientX;
      lastPosY.current = event.clientY;
    });

    // ----------------------------
    // PAN END
    // ----------------------------
    fabricCanvas.on("mouse:up", () => {
      isPanning.current = false;

      fabricCanvas.selection = true;
    });

    fabricCanvas.renderAll();

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // ----------------------------
  // DELETE OBJECT
  // ----------------------------
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Delete") {
        if (!fabricRef.current) return;

        const activeObjects =
          fabricRef.current.getActiveObjects();

        activeObjects.forEach((obj) => {
          fabricRef.current?.remove(obj);
        });

        fabricRef.current.discardActiveObject();

        fabricRef.current.renderAll();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // ----------------------------
  // ADD RECTANGLE
  // ----------------------------
  const addRectangle = () => {
    if (!fabricRef.current) return;

    const rect = new Rect({
      left: Math.random() * 600 + 100,
      top: Math.random() * 400 + 100,
      fill: "#3b82f6",
      width: 220,
      height: 120,
      rx: 14,
      ry: 14,
    });

    fabricRef.current.add(rect);

    fabricRef.current.setActiveObject(
      rect
    );

    fabricRef.current.renderAll();
  };

  // ----------------------------
  // ADD TEXT
  // ----------------------------
  const addText = () => {
    if (!fabricRef.current) return;

    const text = new IText("Service", {
      left: Math.random() * 600 + 100,
      top: Math.random() * 400 + 100,
      fill: "#ffffff",
      fontSize: 28,
      fontFamily: "Arial",
    });

    fabricRef.current.add(text);

    fabricRef.current.setActiveObject(
      text
    );

    fabricRef.current.renderAll();
  };

  return (
    <div className="relative overflow-hidden">
      <Toolbar
        addRectangle={addRectangle}
        addText={addText}
        toggleConnectMode={() =>
          setConnectMode(
            !connectModeRef.current
          )
        }
      />

      <canvas
        ref={canvasRef}
        className="border border-gray-800"
      />
    </div>
  );
};

export default BoardCanvas;