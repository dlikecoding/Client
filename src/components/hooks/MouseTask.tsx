import { onCleanup, onMount } from "solid-js";
import { mouseGesture, setMouseGesture } from "./mouseStore";
import { useManageURLContext } from "../../context/ManageUrl";

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 10;

type MouseTaskProps = {
  onSigleClick?: () => void;
  onDragHorizontal?: () => void;
  onDragVerticalSmall?: () => void;
  onDragVerticalLarge?: () => void;
  onLongPress?: () => void;
  onDragDownRelease?: () => void;
  onPinchZoomIn?: () => void;
  onPinchZoomOut?: () => void;
  thresholdPx?: number;
  pinchThresholdPx?: number;
  longPressMs: number;
};

export function useMouseTask(
  el: HTMLElement,
  {
    onSigleClick,
    onDragHorizontal,
    onDragVerticalSmall,
    onDragVerticalLarge,
    onLongPress,
    onDragDownRelease,
    onPinchZoomIn,
    onPinchZoomOut,
    thresholdPx = 5,
    pinchThresholdPx = 10,
    longPressMs = 500,
  }: MouseTaskProps
) {
  const { view, setView } = useManageURLContext();

  let initialPinchDistance: number = 0;
  let pressStart = 0;
  let isDragging = false;
  let finalDy = 0;
  let longPressTimer: number | null = null;

  const getTouchDistance = (t0: Touch, t1: Touch) => {
    const dx = t1.clientX - t0.clientX;
    const dy = t1.clientY - t0.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidPoint = (t0: Touch, t1: Touch) => ({
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  });

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    } else if (e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return null;
  };

  const reset = () => {
    isDragging = false;

    finalDy = 0;
    initialPinchDistance = 0;

    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const onStart = (e: MouseEvent | TouchEvent) => {
    const pos = getEventPosition(e);
    if (!pos) return;

    pressStart = Date.now();

    finalDy = 0;

    setMouseGesture({
      start: { x: pos.x, y: pos.y },
    });

    if ("touches" in e && e.touches.length === 2) {
      initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
    } else {
      longPressTimer = window.setTimeout(() => {
        if (!isDragging) {
          setMouseGesture({
            lastAction: "longpress",
            active: true,
          });
          onLongPress?.();
        }
      }, longPressMs);
    }
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    isDragging = true;

    if ("touches" in e && e.touches.length === 2) {
      const [touch0, touch1] = e.touches;

      const currentDistance = getTouchDistance(touch0, touch1);
      const midpoint = getMidPoint(touch0, touch1);

      if (initialPinchDistance) {
        const distanceChange = currentDistance - initialPinchDistance;

        if (Math.abs(distanceChange) > pinchThresholdPx) {
          const zoomFactor = distanceChange / initialPinchDistance; // normalized factor

          if (distanceChange > 0) {
            // Zoom out gesture detected

            setView("zoomLevel", (prev) => Math.min(prev * (1 + zoomFactor), MAX_ZOOM_LEVEL));
            setMouseGesture({ lastAction: "pinchZoomOut", pinchDistance: zoomFactor });
            onPinchZoomOut?.();
          } else {
            // Zoom in gesture detected
            setView("zoomLevel", (prev) => Math.max(prev * (1 + zoomFactor), MIN_ZOOM_LEVEL));
            setMouseGesture({ lastAction: "pinchZoomIn", pinchDistance: zoomFactor });
            onPinchZoomIn?.();
          }

          initialPinchDistance = currentDistance;
        }
      }
      return;
    }

    const pos = getEventPosition(e);
    if (!pos) return;

    const dx = pos.x - mouseGesture.start?.x!;
    const dy = pos.y - mouseGesture.start?.y!;
    finalDy = dy;

    setMouseGesture({
      end: { x: pos.x, y: pos.y },
      lastAction: "dragging",
    });

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > thresholdPx || absDy > thresholdPx) {
      isDragging = true;

      if (longPressTimer !== null) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (absDx > absDy) {
        onDragHorizontal?.();

        setMouseGesture({
          lastAction: "dragging horizontal",
        });
      } else {
        const downPercent = dy / window.innerHeight;

        if (downPercent > 0.05) {
          //   onDragVerticalLarge?.();
          // } else if (downPercent > 0) {
          //   onDragVerticalSmall?.();
        }
      }
    }
  };

  const onEnd = () => {
    const dragPercent = finalDy / window.innerHeight;

    if (isDragging && dragPercent > 0.001) {
      setMouseGesture({ lastAction: "dragDownRelease" });
      onDragDownRelease?.();
    } else if (mouseGesture.lastAction === "longpress") {
      onSigleClick?.();
    } else if (!isDragging) {
      setMouseGesture({ lastAction: "click" });
      onSigleClick?.();
    }

    setMouseGesture({ active: false });
    isDragging = false;
    reset();
  };

  onMount(() => {
    if (!el) return;

    // Touch listeners
    el.addEventListener("touchstart", onStart, false);
    el.addEventListener("touchmove", onMove, false);
    el.addEventListener("touchend", onEnd, false);

    // Mouse listeners
    el.addEventListener("mousedown", onStart, false);
    el.addEventListener("mousemove", onMove, false);
    el.addEventListener("mouseup", onEnd, false);
    el.addEventListener("mouseleave", onEnd, false);

    onCleanup(() => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);

      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onEnd);
      el.removeEventListener("mouseleave", onEnd);
    });
  });
}
