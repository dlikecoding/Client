import { onCleanup, onMount } from "solid-js";
// import { mouseGesture, setMouseGesture } from "./mouseStore";
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, useManageURLContext, ZOOM_SENSITIVITY } from "../../context/ManageUrl";
import { useViewMediaContext } from "../../context/ViewContext";

// type MouseTaskProps = {
//   onSingleClick: () => void;
//   thresholdPx?: number;
//   longPressMs?: number;
// };

export function useMouseTask(el: HTMLElement) {
  const { setView } = useManageURLContext();
  let initTouch = 0;
  const { mouseGesture, setMouseGesture, resetMouse, translate, setTranslate } = useViewMediaContext();

  const getDistance = (t1: Touch, t2: Touch) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const getMidPoint = (t0: Touch, t1: Touch) => ({
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  });

  const getPosition = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    } else if (e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return null;
  };

  const reset = () => {
    resetMouse();
  };

  const onStart = (e: MouseEvent | TouchEvent) => {
    // e.preventDefault();
    const pos = getPosition(e);
    if (!pos) return;

    if ("touches" in e && e.touches.length === 2) {
      initTouch = getDistance(e.touches[0], e.touches[1]);
      setMouseGesture({ action: "pinchZoom", status: true, start: { x: pos.x - translate.x, y: pos.y - translate.y } });
    }
    return;
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    const pos = getPosition(e);
    if (!pos || !initTouch) return;

    if (mouseGesture.action === "pinchZoom" && "touches" in e && e.touches.length === 2) {
      // setMouseGesture("end", { x: pos.x, y: pos.y }); //current pos on viewport
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const delta = newDistance - initTouch;

      // if (Math.abs(delta) > pinchThresholdPx) {
      const zoomFactor = (delta / initTouch) * ZOOM_SENSITIVITY;
      setView("zoomLevel", (prev) => Math.min(Math.max(prev * (1 + zoomFactor), MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL));

      // setMouseGesture({ action: delta > 0 ? "pinchZoomOut" : "pinchZoomIn" });
      initTouch = newDistance;
      // }
      // return;
    }

    // setTranslate({ x: pos.x - mouseGesture.start.x, y: pos.y - mouseGesture.start?.y });
  };

  const onEnd = () => {
    if (mouseGesture.action !== "pinchZoom") return;
    // setView("zoomLevel", (prev) =>
    //   prev <= MIN_ZOOM_LEVEL ? MIN_ZOOM_LEVEL : prev >= MAX_ZOOM_LEVEL ? MAX_ZOOM_LEVEL : prev
    // );
    reset();
  };

  onMount(() => {
    if (!el) return;
    const opt = { passive: false };

    el.addEventListener("touchstart", onStart, opt);
    el.addEventListener("touchmove", onMove, opt);
    el.addEventListener("touchend", onEnd, opt);
    el.addEventListener("touchcancel", onEnd, opt);

    el.addEventListener("mousedown", onStart, opt);
    el.addEventListener("mousemove", onMove, opt);
    el.addEventListener("mouseup", onEnd, opt);
    el.addEventListener("mouseleave", onEnd, opt);

    onCleanup(() => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);

      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onEnd);
      el.removeEventListener("mouseleave", onEnd);
    });
  });
}
