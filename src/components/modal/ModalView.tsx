import styles from "./ModalView.module.css";

import { createMemo, createSignal, Show } from "solid-js";
import { useViewMediaContext } from "../../context/ViewContext";
import { useMediaContext } from "../../context/Medias";
import { Portal } from "solid-js/web";
import { createStore } from "solid-js/store";
import ActionNav from "../photoview/actionNav/ActionNav";
import { useManageURLContext } from "../../context/ManageUrl";
import { CustomButtonIcon, GoBackIcon, ZoomInIcon, ZoomOutIcon } from "../svgIcons";
import { formatTime, getElementBySelector, scrollToViewElement } from "../extents/helper/helper";

type DragCoordinate = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};

const MAX_SCALE = 4;

const defaultCoords = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

export const Modal = () => {
  const { showImageOnly, openModal, setOpenModal, displayMedias } = useViewMediaContext();
  const { setItems, setOneItem } = useMediaContext();
  const { view, setView } = useManageURLContext();

  const [dragCoords, setDragCoords] = createStore<DragCoordinate>(defaultCoords);
  const [isDragging, setIsDragging] = createSignal(false);

  const closeModal = () => {
    setView("zoomLevel", 1);

    const el = getElementBySelector("idx", openModal.activeIdx);
    if (!el) return;

    // Set the destination where the image going to jump to.
    setOpenModal({ startRect: el.getBoundingClientRect(), startFocus: false });
    setItems(new Map());

    setTimeout(
      () =>
        setOpenModal({
          isOpen: false,
          activeIdx: -1,
          startRect: undefined,
        }),
      300
    );
  };

  const showNext = () => {
    setOpenModal("activeIdx", (prev) => Math.min(displayMedias.length - 1, prev + 1));

    if (view.zoomLevel > 1) setView("zoomLevel", 1);
    scrollToViewElement(displayMedias[openModal.activeIdx].media_id);
    setDragCoords(defaultCoords);
  };

  const showPrev = () => {
    setOpenModal("activeIdx", (prev) => Math.max(0, prev - 1));

    if (view.zoomLevel > 1) setView("zoomLevel", 1);
    scrollToViewElement(displayMedias[openModal.activeIdx].media_id);
    setDragCoords(defaultCoords);
  };

  let startX: number = 0,
    startY: number = 0,
    initialPinchDistance: number | null = null;

  // inside your Modal component, before handleTouchStart
  const [pointerStart, setPointerStart] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 2) {
      initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
    } else {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      setIsDragging(true);

      // if we’re zoomed in, record where we started and what the current offset is
      if (view.zoomLevel > 1) {
        setPointerStart({ x: touch.clientX, y: touch.clientY });
        setOffsetStart({ x: dragCoords.end.x, y: dragCoords.end.y });
      }
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    if (!isDragging()) return;

    if (e.touches.length === 2 && initialPinchDistance != null) {
      // pinch‐to‐zoom
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = newDistance / initialPinchDistance;
      setView("zoomLevel", Math.min(Math.max(scale, 1), MAX_SCALE));
      return;
    }

    const touch = e.touches[0];

    if (view.zoomLevel > 1) {
      // accumulate drag + clamp
      const dx = touch.clientX - pointerStart().x;
      const dy = touch.clientY - pointerStart().y;
      // raw new offset
      const raw = { end: { x: offsetStart().x + dx, y: offsetStart().y + dy } };
      // clamp into viewport
      const clamped = clampOffset(raw, view.zoomLevel);
      setDragCoords("end", { x: clamped.end.x, y: clamped.end.y });
    } else {
      // in un‐zoomed state, treat as swipe for prev/next/close
      const newX = touch.clientX - startX;
      const newY = touch.clientY - startY;
      setDragCoords("end", { x: newX, y: newY });
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();

    setIsDragging(false);

    if (view.zoomLevel > 1) {
      // keep whatever offset we ended on
      return;
    }
    // at zoomLevel=1, use the drag to navigate or close
    if (dragCoords.end.y > 100) closeModal();
    else if (dragCoords.end.x > 50) showPrev();
    else if (dragCoords.end.x < -50) showNext();

    setDragCoords(defaultCoords);
  };

  const targetStyle = createMemo(() => {
    const rect = openModal.startRect;
    if (!rect || !openModal.startFocus) {
      return {
        top: `${rect?.top}px`,
        left: `${rect?.left}px`,
        width: `${rect?.width}px`,
        height: `${rect?.height}px`,
        transform: "scale(1)",
      };
    }
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(1)",
    };
  });

  createMemo(() => {
    if (view.zoomLevel === 1) setDragCoords(defaultCoords);

    const clamped = clampOffset(dragCoords, view.zoomLevel);
    setDragCoords("end", { x: clamped.end.x, y: clamped.end.y });
  });

  // Update id everytime item deleted
  createMemo(() => {
    if (displayMedias.length === 0) {
      window.history.back();
      return closeModal();
    }

    const updateIdx = Math.min(displayMedias.length - 1, openModal.activeIdx);
    setOneItem(updateIdx, displayMedias[updateIdx].media_id);

    if (openModal.activeIdx > displayMedias.length - 1) setOpenModal("activeIdx", updateIdx);
  });

  // Display time in header
  const displayTime = createMemo(() => {
    const curEl = displayMedias[openModal.activeIdx];
    if (!curEl) return { date: "", time: "" };
    return formatTime(curEl.create_date);
  });

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header classList={{ [styles.fadeOut]: showImageOnly() }} style={{ "z-index": 2 }}>
          <div class="buttonContainer">
            <button
              onClick={() => {
                window.history.back();
                closeModal();
              }}>
              {GoBackIcon()}
            </button>
          </div>

          <div class={styles.modalTitle}>
            <p>{displayTime().date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime().time}</p>
          </div>
          <div class="buttonContainer">
            {/* <button onClick={() => setView("modalObjFit", (prev) => !prev)}>
              {view.modalObjFit ? ExpandIcon() : CompressIcon()}
            </button> */}

            <button onClick={() => setView("showThumb", (prev) => !prev)}>[{view.showThumb ? "On" : "Off"}]</button>

            <button popoverTarget="more-modal-popover">{CustomButtonIcon()}</button>
            <div popover="auto" id="more-modal-popover" class="popover-container devices_filter_popover">
              <div class="media_type_contents">
                <button onClick={() => setView("zoomLevel", (prev) => prev + 1)} disabled={view.zoomLevel === 5}>
                  {ZoomInIcon()}
                </button>
                <span>Zoom</span>
                <button onClick={() => setView("zoomLevel", (prev) => prev - 1)} disabled={view.zoomLevel === 1}>
                  {ZoomOutIcon()}
                </button>
              </div>

              <div onClick={() => setView("autoplay", (prev) => !prev)}>
                Video Autoplay {view.autoplay ? "ON" : "OFF"}
              </div>
            </div>
          </div>
        </header>

        <div class={styles.modalImages}>
          <div
            class={styles.mediaContainer}
            // onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <Show when={displayMedias.length > 0}>
              <img
                src={displayMedias[openModal.activeIdx].source_file}
                style={{
                  position: "absolute",
                  // width: isDragging() ? `${80}%` : "100%",
                  transition: isDragging() ? "none" : "all 0.3s ease",
                  ...targetStyle(),
                  transform: `${targetStyle().transform} 
                    translate(${dragCoords.end.x}px, ${dragCoords.end.y}px) 
                    scale(${view.zoomLevel})`,
                }}
              />
            </Show>

            <button
              onClick={(e) => (e.stopPropagation(), showPrev())}
              class={styles.navButton}
              style={{
                left: "2rem",
              }}>
              ‹
            </button>
            <button
              class={styles.navButton}
              onClick={(e) => (e.stopPropagation(), showNext())}
              style={{
                right: "2rem",
              }}>
              ›
            </button>
          </div>
        </div>

        <div classList={{ [styles.fadeOut]: showImageOnly() }}>
          <ActionNav />
        </div>
      </div>
    </Portal>
  );
};

const getDistance = (t1: Touch, t2: Touch) => {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const clampOffset = (offset: { end: { x: number; y: number } }, zoom: number) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const imgWidth = viewportWidth * zoom;
  const imgHeight = viewportHeight * zoom;

  const maxX = (imgWidth - viewportWidth) / 2;
  const maxY = (imgHeight - viewportHeight) / 2;

  return {
    end: {
      x: Math.max(-maxX, Math.min(maxX, offset.end.x)),
      y: Math.max(-maxY, Math.min(maxY, offset.end.y)),
    },
  };
};
