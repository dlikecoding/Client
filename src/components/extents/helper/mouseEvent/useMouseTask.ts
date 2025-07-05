import { onCleanup, onMount } from "solid-js";

type UseMouseTaskProps = {
  onSingleTap?: () => void;
  onVerticalSlide?: (percentX: number, percentY: number, state: "move" | "end") => void;
  onPan?: (dx: number, dy: number, state: "move" | "end") => void;
  onPinch?: (scale: number, center: { x: number; y: number }, state: "move" | "end") => void;
  tapThresholdPx?: number;
};

export function useMouseTask(el: HTMLElement, props: UseMouseTaskProps) {
  let lastTouchDistance = 0;
  let initialScale = 1;
  let lastTouchCenter = { x: 0, y: 0 };
  let isPinching = false;
  let isDragging = false;
  let startX = 0,
    startY = 0;

  const getDistance = (t1: Touch, t2: Touch) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const getCenter = (t1: Touch, t2: Touch) => ({
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  });

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching = true;
      lastTouchDistance = getDistance(e.touches[0], e.touches[1]);
      lastTouchCenter = getCenter(e.touches[0], e.touches[1]);
      initialScale = 1;
    } else if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      const newDist = getDistance(e.touches[0], e.touches[1]);
      const scale = newDist / lastTouchDistance;
      const center = getCenter(e.touches[0], e.touches[1]);
      props.onPinch?.(scale * initialScale, center, "move");
    } else if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (Math.abs(dy) > Math.abs(dx)) {
        const percentX = dx / window.innerWidth;
        const percentY = dy / window.innerHeight;
        props.onVerticalSlide?.(percentX, percentY, "move");
      } else {
        props.onPan?.(dx, dy, "move");
      }
    }
  };

  const onTouchEnd = () => {
    if (isPinching) {
      props.onPinch?.(initialScale, lastTouchCenter, "end");
      isPinching = false;
    } else if (isDragging) {
      props.onVerticalSlide?.(0, 0, "end");
      props.onPan?.(0, 0, "end");
      isDragging = false;
    }
  };

  onMount(() => {
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    onCleanup(() => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    });
  });
}
