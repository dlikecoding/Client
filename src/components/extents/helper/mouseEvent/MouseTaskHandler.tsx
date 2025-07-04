import { onCleanup } from "solid-js";
import { setMouseGesture } from "./mouseStore";

type UseMouseTaskProps = {
  onClick?: () => void;
  onDragHorizontal?: () => void;
  onDragVerticalSmall?: () => void;
  onDragVerticalLarge?: () => void;
  onLongPress?: () => void;
  onDragDownRelease?: () => void;
  thresholdPx?: number;
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
    thresholdPx = 5,
    longPressMs = 500,
  }: UseMouseTaskProps
) {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let pressStart = 0;
  let isDragging = false;
  let isActive = false;
  let finalDy = 0;
  let longPressTimer: number | null = null;

  // To handle touch identifier for multi-touch
  let activeTouchId: number = 0;

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    } else {
      const touch = Array.from(e.changedTouches).find((t) => activeTouchId === null || t.identifier === activeTouchId);
      if (touch) {
        return { x: touch.clientX, y: touch.clientY, id: touch.identifier };
      }
    }
    return null;
  };

  const reset = () => {
    isDragging = false;
    isActive = false;
    // activeTouchId = 0;
    finalDy = 0;
    startX = startY = endX = endY = 0;

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
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!isActive) return;
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

      setMouseGesture({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        lastAction: "dragging",
      });

      if (longPressTimer !== null) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (absDx > absDy) {
        onDragHorizontal?.();
      } else {
        const downPercent = dy / window.innerHeight;
        if (downPercent > 0.05) {
          onDragVerticalLarge?.();
        } else if (downPercent > 0) {
          onDragVerticalSmall?.();
        }
      }
    }
  };

  const onEnd = (e: MouseEvent | TouchEvent) => {
    if (!isActive) return;

    const dragPercent = finalDy / window.innerHeight;

    if (isDragging && dragPercent > 0.05) {
      setMouseGesture({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        lastAction: "dragDownRelease",
      });
      onDragDownRelease?.();
    } else if (!isDragging && Date.now() - pressStart < longPressMs) {
      setMouseGesture({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        lastAction: "click",
      });
      onClick?.();
    }

    reset();
  };

  // Mouse events
  el.addEventListener("mousedown", onStart);
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  // Touch events
  el.addEventListener("touchstart", onStart);
  document.addEventListener("touchmove", onMove);
  document.addEventListener("touchend", onEnd);
  document.addEventListener("touchcancel", onEnd);

  onCleanup(() => {
    el.removeEventListener("mousedown", onStart);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    el.removeEventListener("touchstart", onStart);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);
    document.removeEventListener("touchcancel", onEnd);
  });
}
