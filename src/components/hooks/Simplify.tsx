import { onCleanup, onMount } from "solid-js";
import { useMousePressed } from "solidjs-use";
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
  const { setMouseGesture } = useViewMediaContext();
  const { pressed } = useMousePressed();

  let start = { x: 0, y: 0 };
  let pressTimer: number | null = null;
  let pinchStartDistance = 0;

  /* helpers ------------------------------------------------------- */
  const dist = (t0: Touch, t1: Touch) => {
    const dx = t1.clientX - t0.clientX;
    const dy = t1.clientY - t0.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const mid = (t0: Touch, t1: Touch) => ({
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  });

  const evtPos = (e: MouseEvent | TouchEvent) =>
    e instanceof MouseEvent ? { x: e.clientX, y: e.clientY } : { x: e.touches[0].clientX, y: e.touches[0].clientY };

  /* core ---------------------------------------------------------- */
  const onStart = (e: MouseEvent | TouchEvent) => {
    const pos = evtPos(e);
    if (!pos) return;

    start = pos;
    setMouseGesture({ status: true });

    // long-press timer
    pressTimer = window.setTimeout(() => {
      setMouseGesture({ action: "longPress", status: true });
    }, longPressMs);

    // pinch start
    if ("touches" in e && e.touches.length === 2) {
      pinchStartDistance = dist(e.touches[0], e.touches[1]);
      pressTimer && clearTimeout(pressTimer);
    }
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!pressed()) return;

    // --- pinch ----------------------------------------------------
    if ("touches" in e && e.touches.length === 2) {
      const [t0, t1] = e.touches;
      const dNow = dist(t0, t1);
      const zoomFactor = ((dNow - pinchStartDistance) / pinchStartDistance) * ZOOM_SENSITIVITY;

      if (dNow > 0) {
        setView("zoomLevel", (prev) => Math.min(prev * (1 + zoomFactor), MAX_ZOOM_LEVEL));
        setMouseGesture({ action: "pinchZoomOut", pinchDistance: zoomFactor });
      } else {
        setView("zoomLevel", (prev) => Math.max(prev * (1 + zoomFactor), MIN_ZOOM_LEVEL));
        setMouseGesture({ action: "pinchZoomIn", pinchDistance: zoomFactor });
      }

      // /* midpoint that should stay fixed on screen ----------------- */
      // const m = mid(t0, t1);

      // /* update zoom ------------------------------------------------
      //  * We treat the current centre of the screen as origin (0,0) in
      //  * view coordinates.  To keep the midpoint fixed we shift the
      //  * view by the amount the scale change would otherwise move it.
      //  */
      // setView(({ zoomLevel, zoomOffset }) => {
      //   const newZoom = Math.min(Math.max(zoomLevel * (1 + delta * ZOOM_SENSITIVITY), MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL);

      //   const scale = newZoom / zoomLevel;
      //   const newOffset = {
      //     x: (zoomOffset.x - m.x) * scale + m.x,
      //     y: (zoomOffset.y - m.y) * scale + m.y,
      //   };

      //   return { zoomLevel: newZoom, zoomOffset: newOffset };
      // });

      // setMouseGesture({ action: delta > 0 ? "pinchZoomOut" : "pinchZoomIn", status: true });
      pinchStartDistance = dNow;
      return;
    }

    // --- drag -----------------------------------------------------
    const pos = evtPos(e);
    if (!pos) return;

    const dx = pos.x - start.x;
    const dy = pos.y - start.y;

    if (Math.abs(dx) > thresholdPx || Math.abs(dy) > thresholdPx) {
      pressTimer && clearTimeout(pressTimer);
      setMouseGesture({ action: Math.abs(dx) > Math.abs(dy) ? "dragHorizontal" : "dragVertical", status: true });
      // external view translation can live here if needed
    }
  };

  const onEnd = () => {
    pressTimer && clearTimeout(pressTimer);
    setMouseGesture({ action: "singleClick", status: false });
    onSingleClick?.();
  };

  /* wiring -------------------------------------------------------- */
  onMount(() => {
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchmove", onMove);
    el.addEventListener("touchend", onEnd);

    el.addEventListener("mousedown", onStart);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onEnd);
    el.addEventListener("mouseleave", onEnd);

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
