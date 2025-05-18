import { Accessor, Component, createMemo, createSignal, onCleanup, onMount, Setter, Show } from "solid-js";
import styles from "./Brusher.module.css";
import {
  BrushButtonIcon,
  ClearButtonIcon,
  GenerateButtonIcon,
  UndoButtonIcon,
  ZoomButtonIcon,
} from "../../../svgIcons";
import { createStore } from "solid-js/store";

type BrushProps = {
  photo: HTMLImageElement;
};

// Define the type for drawing position
interface Position {
  x: number;
  y: number;
}

const BrusherDrawing: Component<BrushProps> = (props) => {
  const [isDrawing, setIsDrawing] = createSignal(false);
  const [brushSize, setBrushSize] = createSignal(10);
  const [lastPos, setLastPos] = createStore<Position>({ x: 0, y: 0 });

  let canvasRef: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D;

  const getMousePos = (e: MouseEvent) => {
    const rect = canvasRef.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  onMount(() => {
    canvasRef.width = props.photo.width;
    canvasRef.height = props.photo.height;
    canvasRef.style.width = `${props.photo.width}px`;
    canvasRef.style.height = `${props.photo.height}px`;

    const ctx = canvasRef.getContext("2d");
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize();
      ctx.strokeStyle = "white";
      canvasContext = ctx;
    }
  });

  const startDrawing = (e: MouseEvent): void => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPos({ x: pos.x, y: pos.y });
  };

  const stopDrawing = (): void => {
    setIsDrawing(false);
  };

  const draw = (e: MouseEvent): void => {
    if (!isDrawing() || !canvasContext) return;

    const pos = getMousePos(e);
    canvasContext.lineWidth = brushSize();
    canvasContext.beginPath();
    canvasContext.moveTo(lastPos.x, lastPos.y);
    canvasContext.lineTo(pos.x, pos.y);
    canvasContext.stroke();
    canvasContext.closePath();

    setLastPos({ x: pos.x, y: pos.y });
  };

  const clearCanvas = (): void => {
    if (canvasContext) {
      canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
    }
  };

  onCleanup(() => {
    if (canvasContext) canvasContext.closePath();
  });

  return (
    <>
      <canvas
        ref={(el) => (canvasRef = el)}
        style={{
          border: "1px solid black",
          cursor: "crosshair",
          background: "rgba(62, 255, 133, 0.699)",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
      <Show when={!isDrawing()}>
        <div class={styles.inputBrusher}>
          <div class={styles.sizeBrusher}>
            <label for="brushSize">Size</label>
            <span>{brushSize()}px</span>
          </div>

          <input
            style={{ background: getTrackBackground(brushSize()) }}
            id="brushSize"
            type="range"
            min="1"
            max="100"
            value={brushSize()}
            onInput={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>

        <footer class="footer_nav">
          <div class="actions__toolbar__column is_left">
            <button>{UndoButtonIcon()}</button>
          </div>
          <div class="actions__toolbar__column is_middle">
            {/* <button>{ZoomButtonIcon()}</button> */}
            <button onClick={() => saveToServer(canvasContext, canvasRef)}>{GenerateButtonIcon()} Remove</button>
            {/* <button>{BrushButtonIcon()}</button> */}
          </div>
          <div class="actions__toolbar__column is_right">
            <button onClick={clearCanvas}>{ClearButtonIcon()}</button>
          </div>
        </footer>
      </Show>
    </>
  );
};

export default BrusherDrawing;

const drawDot = (x: number, y: number, burshSize: number, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.arc(x, y, burshSize, 0, Math.PI * 2);
  ctx.fill();
};

const drawInterpolatedDots = (
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  brushSize: number,
  ctx: CanvasRenderingContext2D
) => {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.ceil(distance / (brushSize * 1.5));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    drawDot(x, y, brushSize, ctx);
  }
};
const getTrackBackground = (size: number) => {
  return `linear-gradient(to right, var(--button-active-color) 0%, var(--button-active-color) ${size}%, #ccc ${size}%, #ccc 100%)`;
};

const convertBlackToWhite = (canvasContext: CanvasRenderingContext2D, canvasRef: HTMLCanvasElement) => {
  if (!canvasContext) return;
  const imageData = canvasContext?.getImageData(0, 0, canvasRef.width, canvasRef.height);

  const data = imageData?.data;
  if (!data) return;

  for (let i = 0; i < data.length; i += 4) {
    const isDrawn = data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0;
    data[i] = isDrawn ? 255 : 0;
    data[i + 1] = isDrawn ? 255 : 0;
    data[i + 2] = isDrawn ? 255 : 0;
    data[i + 3] = 255;
  }

  canvasContext?.putImageData(imageData, 0, 0);
};

// Save canvas content as an image and send to server
const saveToServer = async (canvasContext: CanvasRenderingContext2D, canvasRef: HTMLCanvasElement): Promise<void> => {
  if (!canvasContext) return;

  convertBlackToWhite(canvasContext, canvasRef);
  const imageData = canvasRef.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageData;
  link.download = "bw-image.png";
  link.click();

  /**
    const formData = new FormData();
    formData.append("image", imageData); // The server should expect this key ('image')

    try {
      // Send the image to the server (replace with your actual endpoint)
      const response = await fetch("https://yourserver.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Image saved successfully!");
      } else {
        alert("Failed to save image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
     */
};
