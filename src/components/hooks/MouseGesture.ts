import { onCleanup, onMount } from "solid-js";
// import { mouseGesture, setMouseGesture } from "./mouseStore";
import { useManageURLContext } from "../../context/ManageUrl";
import { useViewMediaContext } from "../../context/ViewContext";

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 10;
const ZOOM_SENSITIVITY = 0.3;

// type MouseTaskProps = {
//   onSingleClick: () => void;
//   thresholdPx?: number;
//   longPressMs?: number;
// };

export function useMouseTask(el: HTMLElement) {
  // const { setView } = useManageURLContext();
  const { mouseGesture, setMouseGesture, resetMouse, translate, setTranslate } = useViewMediaContext();

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
    resetMouse();
  };

  const onStart = (e: MouseEvent | TouchEvent) => {
    const pos = getEventPosition(e);
    if (!pos) return;
    setMouseGesture({
      drag: true,
      start: { x: pos.x - translate.x, y: pos.y - translate.y },
    });
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!mouseGesture.drag) return;

    const pos = getEventPosition(e);
    if (!pos) return;
    setMouseGesture("end", { x: pos.x, y: pos.y }); //current pos on viewport
    setTranslate({ x: pos.x - mouseGesture.start.x, y: pos.y - mouseGesture.start?.y });
  };

  const onEnd = () => {
    if (!mouseGesture.drag) return;

    console.log(mouseGesture);
    reset();
  };

  onMount(() => {
    if (!el) return;
    const opt = { passive: false };

    el.addEventListener("touchstart", onStart, opt);
    el.addEventListener("touchmove", onMove, opt);
    el.addEventListener("touchend", onEnd, opt);

    el.addEventListener("mousedown", onStart, opt);
    el.addEventListener("mousemove", onMove, opt);
    el.addEventListener("mouseup", onEnd, opt);
    el.addEventListener("mouseleave", onEnd, opt);

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
