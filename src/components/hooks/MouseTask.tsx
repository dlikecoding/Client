import { onCleanup, onMount } from "solid-js";
// import { mouseGesture, setMouseGesture } from "./mouseStore";
import { useManageURLContext } from "../../context/ManageUrl";
import { useViewMediaContext } from "../../context/ViewContext";

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 10;
const ZOOM_SENSITIVITY = 0.3;

type MouseTaskProps = {
  onSingleClick: () => void;
  thresholdPx?: number;
  longPressMs?: number;
};

export function useMouseTask(el: HTMLElement, { onSingleClick, thresholdPx = 5, longPressMs = 500 }: MouseTaskProps) {
  const { setView } = useManageURLContext();
  const { mouseGesture, setMouseGesture } = useViewMediaContext();

  let initialPinchDistance = 0;
  let pressStart = 0;
  let finalDy = 0;
  let longPressTimer: number | null = null;
  let currentAction: "none" | "longPress" | "drag" | "pinch" = "none";

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
    finalDy = 0;
    initialPinchDistance = 0;
    currentAction = "none";

    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    setMouseGesture({ status: false });
  };

  const onStart = (e: MouseEvent | TouchEvent) => {
    if (currentAction !== "none") return;

    const pos = getEventPosition(e);
    if (!pos) return;

    pressStart = Date.now();
    finalDy = 0;

    setMouseGesture({ start: { x: pos.x, y: pos.y }, status: true });

    if ("touches" in e && e.touches.length === 2) {
      currentAction = "pinch";
      initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
    } else {
      longPressTimer = window.setTimeout(() => {
        if (currentAction === "none") {
          currentAction = "longPress";
          setMouseGesture({
            action: "longPress",
            status: true,
          });
        }
      }, longPressMs);
    }
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (currentAction === "longPress") return; // ignore all others during long press
    const pos = getEventPosition(e);
    if (!pos) return;

    if ("touches" in e && e.touches.length === 2) {
      if (currentAction !== "pinch") return;

      const [touch0, touch1] = e.touches;
      const currentDistance = getTouchDistance(touch0, touch1);

      const distanceChange = currentDistance - initialPinchDistance;

      // if (Math.abs(distanceChange) > pinchThresholdPx) {
      const zoomFactor = (distanceChange / initialPinchDistance) * ZOOM_SENSITIVITY;

      if (distanceChange > 0) {
        setView("zoomLevel", (prev) => Math.min(prev * (1 + zoomFactor), MAX_ZOOM_LEVEL));
        setMouseGesture({ action: "pinchZoomOut", pinchDistance: zoomFactor });
      } else {
        setView("zoomLevel", (prev) => Math.max(prev * (1 + zoomFactor), MIN_ZOOM_LEVEL));
        setMouseGesture({ action: "pinchZoomIn", pinchDistance: zoomFactor });
      }
      // }
      return;
    }

    // if still waiting for long press
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    const dx = pos.x - (mouseGesture.start?.x ?? 0);
    const dy = pos.y - (mouseGesture.start?.y ?? 0);
    finalDy = dy;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > thresholdPx || absDy > thresholdPx) {
      if (currentAction === "none") {
        currentAction = "drag";
      }

      setMouseGesture({
        end: { x: pos.x, y: pos.y },
        action: absDx > absDy ? "dragHorizontal" : "dragVertical",
      });
    }
  };

  const onEnd = () => {
    if (currentAction === "longPress") {
      setMouseGesture({ action: "longPressEnd" });
    } else if (currentAction === "drag" && finalDy / window.innerHeight > 0.001) {
      setMouseGesture({ action: "dragDownRelease" });
    } else if (currentAction === "none") {
      setMouseGesture({ action: "singleClick" });
      onSingleClick?.();
    }

    reset();
  };

  onMount(() => {
    if (!el) return;

    el.addEventListener("touchstart", onStart, false);
    el.addEventListener("touchmove", onMove, false);
    el.addEventListener("touchend", onEnd, false);

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
