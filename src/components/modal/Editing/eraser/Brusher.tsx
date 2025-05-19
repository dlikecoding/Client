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

const MIN_MAX_BRUSH_SIZE = { min: 1, max: 300 };

const BrusherDrawing: Component<BrushProps> = (props) => {
  const [isDrawing, setIsDrawing] = createSignal(false);
  const [brushSize, setBrushSize] = createSignal(50);
  const [lastPos, setLastPos] = createStore<Position>({ x: 0, y: 0 });

  let canvasRef: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D;

  const getMousePos = (e: MouseEvent) => {
    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  onMount(() => {
    // Internal canvas resolution for crisp drawing
    canvasRef.width = props.photo.naturalWidth;
    canvasRef.height = props.photo.naturalHeight;

    // Get the size the image is actually displayed at
    const displayWidth = props.photo.clientWidth;
    const displayHeight = props.photo.clientHeight;

    // Apply the same CSS size to canvas so it overlays correctly
    canvasRef.style.width = `${displayWidth}px`;
    canvasRef.style.height = `${displayHeight}px`;

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
      <div class={styles.mainBrusher}>
        <canvas
          ref={(el) => (canvasRef = el)}
          style={{
            width: "100%", // Fills container width
            height: "auto", // Maintains aspect ratio

            border: "1px solid black",
            cursor: "crosshair",
            // background: "rgba(62, 255, 133, 0.699)",
            display: "block", // removes inline spacing
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
        />
      </div>

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
            min={MIN_MAX_BRUSH_SIZE.min}
            max={MIN_MAX_BRUSH_SIZE.max}
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

const getTrackBackground = (size: number) => {
  const min = MIN_MAX_BRUSH_SIZE.min;
  const max = MIN_MAX_BRUSH_SIZE.max;
  const percentage = ((size - min) / (max - min)) * 100;
  return `linear-gradient(to right, var(--button-active-color) 0%, var(--button-active-color) ${percentage}%, #ccc ${percentage}%, #ccc 100%)`;
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
