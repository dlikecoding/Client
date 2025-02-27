import { Portal } from "solid-js/web";
import { createEffect, createMemo, createSignal, For, Index, onCleanup, onMount } from "solid-js";
import { useViewMediaContext } from "../../context/ViewContext";
import { GoBackIcon } from "../svgIcons";
import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";
import styles from "./Modal.module.css";
import { List } from "@solid-primitives/list";

const DISPLAY_SIZE = 5; // Number of items visible at once
const BUFFER_SIZE = Math.floor(DISPLAY_SIZE / 2); // Extra buffer before and after

const Modal = () => {
  const { setOpenModal, displayMedias } = useViewMediaContext();
  const { setItems } = useMediaContext();

  const [showImageOnly, setShowImgOnly] = createSignal(false);
  const ITEM_HEIGHT = window.innerHeight; // Calculate per-item height
  const [scrollTop, setScrollTop] = createSignal(0);

  let container!: HTMLDivElement;

  // Total height of the virtualized list
  const totalHeight = createMemo(() => displayMedias.length * ITEM_HEIGHT);

  // Compute visible range with BUFFER
  const visibleRange = createMemo(() => {
    const startIdx = Math.max(0, Math.floor(scrollTop() / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIdx = Math.min(displayMedias.length, startIdx + DISPLAY_SIZE + BUFFER_SIZE);

    return displayMedias.slice(startIdx, endIdx).map((item, index) => ({
      item,
      index: startIdx + index,
    }));
  });

  // Scroll event handler
  const onScroll = () => requestAnimationFrame(() => setScrollTop(container.scrollTop));

  onMount(() => container.addEventListener("scroll", onScroll));
  onCleanup(() => container.removeEventListener("scroll", onScroll));

  // Close modal and reset state
  const handleCloseModal = () => {
    setItems(new Map());
    setOpenModal(false);
  };

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header class={`${showImageOnly() ? "hideButtons" : ""}`} style={{ "z-index": 1 }}>
          <button
            onClick={() => {
              window.history.back();
              handleCloseModal();
            }}>
            {GoBackIcon()}
          </button>
        </header>

        {/* Scrollable Virtualized List */}
        <div
          ref={container}
          class={styles.modalImages}
          id="modalImages"
          style={{ height: "100vh", "overflow-y": "auto", position: "relative" }}>
          <div style={{ height: `${totalHeight()}px`, position: "relative" }}>
            <Index each={visibleRange()}>
              {(item) => (
                <MediaDisplay
                  itemTop={item().index * ITEM_HEIGHT}
                  itemHeight={ITEM_HEIGHT}
                  media={item().item}
                  index={item().index}
                  setShowImgOnly={setShowImgOnly}
                />
              )}
            </Index>
          </div>
        </div>

        <ActionNav showImageOnly={showImageOnly()} />
      </div>
    </Portal>
  );
};

export default Modal;
