import { onCleanup, onMount } from "solid-js";
import { setMouseGesture } from "./mouseStore";

type UseMouseTaskProps = {
  onClick?: () => void;
  onDragHorizontal?: () => void;
  onDragVerticalSmall?: () => void;
  onDragVerticalLarge?: () => void;
  onLongPress?: () => void;
  onDragDownRelease?: () => void;
  onPinchZoomIn?: () => void;
  onPinchZoomOut?: () => void;
  thresholdPx?: number;
  pinchThresholdPx?: number;
  longPressMs?: number;
};

export function useMouseTask(
  el: HTMLElement,
  {
    onClick,
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
  }: UseMouseTaskProps
) {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let initialPinchDistance: number | null = null;
  let pressStart = 0;
  let isDragging = false;
  let isActive = false;
  let finalDy = 0;
  let longPressTimer: number | null = null;

  const getTouchDistance = (t0: Touch, t1: Touch) => {
    const dx = t1.clientX - t0.clientX;
    const dy = t1.clientY - t0.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    } else if (e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY, id: e.touches[0].identifier };
    }
    return null;
  };

  const reset = () => {
    isDragging = false;
    isActive = false;
    // activeTouchId = null;
    finalDy = 0;
    initialPinchDistance = null;

    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const onStart = (e: MouseEvent | TouchEvent) => {
    const pos = getEventPosition(e);
    if (!pos) return;

    // if ("id" in pos) activeTouchId = pos.id;

    isActive = true;
    startX = endX = pos.x;
    startY = endY = pos.y;
    pressStart = Date.now();
    isDragging = false;
    finalDy = 0;

    if ("touches" in e && e.touches.length === 2) {
      initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
    } else {
      longPressTimer = window.setTimeout(() => {
        if (!isDragging) {
          setMouseGesture({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            lastAction: "longpress",
          });
          onLongPress?.();
        }
      }, longPressMs);
    }
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!isActive) return;

    if ("touches" in e && e.touches.length === 2) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);

      if (initialPinchDistance !== null) {
        const distanceChange = currentDistance - initialPinchDistance;
        if (Math.abs(distanceChange) > pinchThresholdPx) {
          if (distanceChange > 0) {
            setMouseGesture("lastAction", "pinchZoomOut");
            onPinchZoomOut?.();
          } else {
            setMouseGesture("lastAction", "pinchZoomIn");
            onPinchZoomIn?.();
          }
          initialPinchDistance = currentDistance; // Reset to detect further zoom gestures
        }
      }
      return; // Skip further processing during pinch gesture
    }

    const pos = getEventPosition(e);
    if (!pos) return;

    const dx = pos.x - startX;
    const dy = pos.y - startY;
    finalDy = dy;
    endX = pos.x;
    endY = pos.y;

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

        // setMouseGesture({
        //   lastAction: "dragging horizontal",
        // });
      } else {
        const downPercent = dy / window.innerHeight;

        if (downPercent > 0.05) {
          //   onDragVerticalLarge?.();
          // } else if (downPercent > 0) {
          //   onDragVerticalSmall?.();
          setMouseGesture({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            lastAction: "dragging",
          });
        }
      }
    }
  };

  const onEnd = () => {
    if (!isActive) return;

    const dragPercent = finalDy / window.innerHeight;

    if (isDragging && dragPercent > 0.001) {
      setMouseGesture({ lastAction: "dragDownRelease" });
      onDragDownRelease?.();
    } else if (!isDragging && Date.now() - pressStart < longPressMs) {
      setMouseGesture({ lastAction: "click" });
      onClick?.();
    }

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
