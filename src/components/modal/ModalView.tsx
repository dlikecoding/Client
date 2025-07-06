import styles from "./ModalView.module.css";

import { Component, createMemo, createSignal, Setter, Show } from "solid-js";
import { useViewMediaContext } from "../../context/ViewContext";
import { useMediaContext } from "../../context/Medias";
import { Portal } from "solid-js/web";
import { createStore } from "solid-js/store";
import ActionNav from "../photoview/actionNav/ActionNav";
import { useManageURLContext } from "../../context/ManageUrl";
import { CustomButtonIcon, GoBackIcon } from "../svgIcons";
import { formatTime, getElementBySelector, scrollToViewElement } from "../extents/helper/helper";

// type ModalProps = {
//   setLastEl: Setter<HTMLElement | null>;
// };

type DragCoordinate = {
  x: number;
  y: number;
};

const MAX_SCALE = 4;

export const Modal = () => {
  const { showImageOnly, openModal, setOpenModal, displayMedias } = useViewMediaContext();
  const { setItems, setOneItem } = useMediaContext();
  const { view, setView } = useManageURLContext();

  const [dragCoords, setDragCoords] = createStore<DragCoordinate>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = createSignal(false);

  const closeModal = () => {
    const el = getElementBySelector("idx", openModal.activeIdx);
    if (!el) return;

    // Set the destination where the image going to jump to.
    setOpenModal("startRect", el.getBoundingClientRect());

    setItems(new Map());
    setOpenModal("startFocus", false);
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
    setDragCoords("x", 0);
  };

  const showPrev = () => {
    setOpenModal("activeIdx", (prev) => Math.max(0, prev - 1));

    if (view.zoomLevel > 1) setView("zoomLevel", 1);
    scrollToViewElement(displayMedias[openModal.activeIdx].media_id);
    setDragCoords("x", 0);
  };

  let startX: number = 0,
    startY: number = 0,
    initialPinchDistance: number | null = null;

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
    } else {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging()) return;

    if (e.touches.length === 2 && initialPinchDistance !== null) {
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = newDistance / initialPinchDistance;
      setView("zoomLevel", Math.min(Math.max(scale, 1), MAX_SCALE)); // Clamp between 1x and 3x
    } else if (e.touches.length === 1) {
      setDragCoords({ x: e.touches[0].clientX - startX, y: e.touches[0].clientY - startY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (view.zoomLevel > 1) return;

    if (dragCoords.y > 100) closeModal();
    else if (dragCoords.x > 50) showPrev();
    else if (dragCoords.x < -50) showNext();

    setDragCoords({ x: 0, y: 0 });
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
      width: "100dvw",
      height: "auto",
      transform: "translate(-50%, -50%) scale(1)",
    };
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

            <button popoverTarget="more-modal-popover">{CustomButtonIcon()}</button>
            <div popover="auto" id="more-modal-popover" class="popover-container devices_filter_popover">
              {/* <div class="media_type_contents">
                <button onClick={() => handleZoom(1)} disabled={view.zoomLevel === 5}>
                  {ZoomInIcon()}
                </button>
                <span>Zoom</span>
                <button onClick={() => handleZoom(-1)} disabled={view.zoomLevel === 1}>
                  {ZoomOutIcon()}
                </button>
              </div> */}

              <div onClick={() => setView("showThumb", (prev) => !prev)}>
                Thumbnails {view.showThumb ? "ON" : "OFF"}
              </div>
              <div onClick={() => setView("autoplay", (prev) => !prev)}>
                Video Autoplay {view.autoplay ? "ON" : "OFF"}
              </div>
              {/* <div>Slideshow ON </div> */}
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
                  transition: isDragging() ? "none" : "all 0.3s ease",
                  "border-radius": "8px",
                  ...targetStyle(),
                  transform: `${targetStyle().transform} translate(${dragCoords.x}px, ${dragCoords.y}px) scale(${
                    view.zoomLevel
                  })`,
                }}
              />
            </Show>

            <button
              onClick={(e) => (e.stopPropagation(), showPrev())}
              style={{
                position: "absolute",
                left: "2rem",
                color: "#fff",
                background: "none",
                border: "none",
                "font-size": "4rem",
              }}>
              ‹
            </button>
            <button
              onClick={(e) => (e.stopPropagation(), showNext())}
              style={{
                position: "absolute",
                right: "2rem",
                color: "#fff",
                background: "none",
                border: "none",

                "font-size": "4rem",
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
