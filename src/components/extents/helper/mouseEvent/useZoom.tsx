import { createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

export default function TouchArea(): JSX.Element {
  let touchRef: HTMLDivElement | undefined;

  const [logMessages, setLogMessages] = createSignal<string[]>([]);
  const appendLog = (msg: string) => setLogMessages((prev) => [...prev, msg]);

  let initialDistance: number | null = null;
  let xDown: number | null = null;
  let yDown: number | null = null;
  let mouseDown = false;

  const handleTouchStart = (evt: TouchEvent): void => {
    if (evt.touches.length === 1) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    }
  };

  const handleTouchMove = (evt: TouchEvent): void => {
    if (evt.touches.length === 2) {
      const [t0, t1] = [evt.touches[0], evt.touches[1]];
      const dx = t1.clientX - t0.clientX;
      const dy = t1.clientY - t0.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (initialDistance === null) {
        initialDistance = distance;
      } else {
        const change = distance - initialDistance;
        if (Math.abs(change) > 10) {
          appendLog(change > 0 ? "Pinch Zoom Out" : "Pinch Zoom In");
          initialDistance = distance;
        }
      }
    } else if (evt.touches.length === 1 && xDown !== null && yDown !== null) {
      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;

      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        appendLog(xDiff > 0 ? "Swipe Left" : "Swipe Right");
      } else {
        appendLog(yDiff > 0 ? "Swipe Up" : "Swipe Down");
      }

      xDown = null;
      yDown = null;
    }
  };

  const handleTouchEnd = (): void => {
    appendLog("Touch Ended");
    initialDistance = null;
    xDown = null;
    yDown = null;
  };

  // Mouse handlers
  const handleMouseDown = (evt: MouseEvent): void => {
    mouseDown = true;
    xDown = evt.clientX;
    yDown = evt.clientY;
  };

  const handleMouseMove = (evt: MouseEvent): void => {
    if (!mouseDown || xDown === null || yDown === null) return;

    const xUp = evt.clientX;
    const yUp = evt.clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      appendLog(xDiff > 0 ? "Mouse Drag Left" : "Mouse Drag Right");
    } else {
      appendLog(yDiff > 0 ? "Mouse Drag Up" : "Mouse Drag Down");
    }

    // reset after logging
    xDown = null;
    yDown = null;
    mouseDown = false;
  };

  const handleMouseUp = (): void => {
    if (mouseDown) appendLog("Mouse Released");
    mouseDown = false;
    xDown = null;
    yDown = null;
  };

  onMount(() => {
    if (!touchRef) return;
    const el = touchRef;

    // Touch listeners
    el.addEventListener("touchstart", handleTouchStart, false);
    el.addEventListener("touchmove", handleTouchMove, false);
    el.addEventListener("touchend", handleTouchEnd, false);

    // Mouse listeners
    el.addEventListener("mousedown", handleMouseDown, false);
    el.addEventListener("mousemove", handleMouseMove, false);
    el.addEventListener("mouseup", handleMouseUp, false);
    el.addEventListener("mouseleave", handleMouseUp, false);

    onCleanup(() => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);

      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mouseleave", handleMouseUp);
    });
  });

  return (
    <div
      ref={(el) => (touchRef = el)}
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "90vw",
        height: "90vh",
        margin: "auto",
        background: "#fdfdfd",
        border: "2px dashed #aaa",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "text-align": "center",
        "touch-action": "none",
        "user-select": "none",
      }}>
      <div>
        <p>Touch or click/drag here to test gestures</p>
        <div
          style={{
            "max-height": "150px",
            overflow: "auto",
            background: "#222",
            color: "#fff",
            padding: "10px",
            "border-radius": "6px",
            "font-size": "14px",
          }}>
          {logMessages().map((msg, i) => (
            <div>{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
