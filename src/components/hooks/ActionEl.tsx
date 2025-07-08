import { onMount, onCleanup } from "solid-js";
import { useManageURLContext } from "../../context/ManageUrl";
import { useViewMediaContext, defaultMouse } from "../../context/ViewContext";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from "../modal/ModalView";

const ZOOM_SENSITIVITY = 0.25; // 0 = no zoom, 1 = full zoom effect
const HOLD_THRESHOLD = 500; // ms
const MOVE_THRESHOLD = 1; // px

export function useMouseTask(el: HTMLElement) {
  const { setView } = useManageURLContext();
  const { mouseGesture, setMouseGesture } = useViewMediaContext();

  let startTime = 0;
  let initPinch = 0;
  let holdTimer: number;
  let isDragging = false;
  let isResizing = false;

  // --- Helpers ---
  const getPoint = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    }
    return null;
  };

  const getTouchDistance = (t0: Touch, t1: Touch) => {
    const dx = t1.clientX - t0.clientX;
    const dy = t1.clientY - t0.clientY;
    return Math.hypot(dx, dy);
  };

  // Two-finger pinch detection
  const tryStartPinch = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      initPinch = getTouchDistance(e.touches[0], e.touches[1]);
      isResizing = true;
      setMouseGesture("action", "pinchZoom");
      return true;
    }
    return false;
  };

  // --- Event handlers ---
  const handleStart = (e: MouseEvent | TouchEvent) => {
    // only prevent default on touch; desktop drag usually OK
    if (e.cancelable) e.preventDefault();

    startTime = Date.now();
    isDragging = false;
    isResizing = false;

    // pinch takes priority
    if ("touches" in e && tryStartPinch(e)) {
      setMouseGesture("start", getPoint(e)!);
      return;
    }

    const pt = getPoint(e);
    if (!pt) return;
    setMouseGesture("start", pt);

    // schedule hold‐timer
    holdTimer = window.setTimeout(() => {
      if (!isDragging && !isResizing) {
        setMouseGesture("action", "longPress");
      }
    }, HOLD_THRESHOLD);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    const pt = getPoint(e);
    if (!pt || !mouseGesture.start) return;

    // pinch‐zoom path
    if (isResizing && "touches" in e && e.touches.length === 2) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = 1 + (dist / initPinch - 1) * ZOOM_SENSITIVITY;
      setView("zoomLevel", (prev) => {
        const newLevel = Math.min(Math.max(prev * scale, MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL);
        return newLevel;
      });
      initPinch = dist;
      setMouseGesture("action", "pinchZoom");
      return;
    }

    // dragging path
    const dx = pt.x - mouseGesture.start.x;
    const dy = pt.y - mouseGesture.start.y;
    const dist = Math.hypot(dx, dy);

    if (dist > MOVE_THRESHOLD) {
      clearTimeout(holdTimer);
      isDragging = true;
      setMouseGesture("end", pt);

      // decide horizontal vs vertical
      if (!mouseGesture.action) {
        if (Math.abs(dx) > Math.abs(dy)) {
          setMouseGesture("action", "dragHorizontal");
        } else {
          setMouseGesture("action", "dragVertical");
        }
      }
    }
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    clearTimeout(holdTimer);

    const pt = getPoint(e);
    const duration = Date.now() - startTime;

    if (pt && mouseGesture.start) {
      const dx = pt.x - mouseGesture.start.x;
      const dy = pt.y - mouseGesture.start.y;
      const dist = Math.hypot(dx, dy);

      if (dist < MOVE_THRESHOLD && duration < HOLD_THRESHOLD) {
        if (mouseGesture.action === "longPress") {
          setMouseGesture("action", "longPressEnd");
        } else {
          setMouseGesture("action", "singleClick");
        }
      } else if (isDragging) {
        setMouseGesture("action", "dragEnd");
      } else if (isResizing) {
        setMouseGesture("action", "pinchZoomEnd");
      }
    }

    // reset on next tick so the action has time to propagate
    setTimeout(() => setMouseGesture(defaultMouse), 0);

    isDragging = false;
    isResizing = false;
  };

  onMount(() => {
    const mouseOpts = { passive: false };
    const touchOpts = { passive: false };

    el.addEventListener("mousedown", handleStart, mouseOpts);
    el.addEventListener("mousemove", handleMove, mouseOpts);
    el.addEventListener("mouseup", handleEnd, mouseOpts);
    el.addEventListener("mouseleave", handleEnd, mouseOpts);

    el.addEventListener("touchstart", handleStart, touchOpts);
    el.addEventListener("touchmove", handleMove, touchOpts);
    el.addEventListener("touchend", handleEnd, touchOpts);
    el.addEventListener("touchcancel", handleEnd, touchOpts);

    onCleanup(() => {
      el.removeEventListener("mousedown", handleStart);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseup", handleEnd);
      el.removeEventListener("mouseleave", handleEnd);

      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
      el.removeEventListener("touchcancel", handleEnd);

      clearTimeout(holdTimer);
    });
  });
}
