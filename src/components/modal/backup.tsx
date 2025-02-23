import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createEffect, createMemo, createSignal, For, Index, onMount } from "solid-js";

import { useElementByPoint, useElementVisibility, useIntersectionObserver } from "solidjs-use";

import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";

import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";
import { createStore, SetStoreFunction, StoreSetter } from "solid-js/store";

interface ElementModal {
  curIndex: number;
  curId: string;
  divEl?: HTMLElement;
}

const STEP = 2;

const Modal = () => {
  const { setOpenModal, displayMedias } = useViewMediaContext();
  const { items, setItems, setOneItem } = useMediaContext();

  const handleCloseModal = () => {
    setItems(new Map());
    setOpenModal(false);
  };

  // On close or clicked back button, remove the top state on the stack
  window.onpopstate = (event) => {
    if (event.state) handleCloseModal();
  };
  /////////////////////////////////////////////////////////////

  const [el, setEl] = createStore<ElementModal>({
    curIndex: items().keys().next().value!, // Current selected index
    curId: items().values().next().value!, // Current Id of selected el
    divEl: undefined,
  });

  // Handle selected Item on change
  const handleSelectItems = (idx: number, id: string, divEl?: HTMLElement) => {
    setOneItem(idx, id);
    setEl({ curId: id, curIndex: idx, divEl: divEl });
  };

  //////////////////////////////////////////////////////////////////////

  const isVisible = useElementVisibility(el.divEl);
  //Tracking current elemenet on screen based on x and y
  // const { element } = useElementByPoint({
  //   x: window.innerWidth / 2,
  //   y: window.innerHeight / 2,
  //   multiple: false,
  //   immediate: true,
  //   interval: 1,
  // });

  // const displayTime = createMemo(() => {
  //   const dTime = element()?.dataset.modaltime;
  //   if (dTime) return formatTime(dTime);
  // });

  const modalMedias = () =>
    displayMedias.slice(Math.max(0, el.curIndex - STEP), Math.min(displayMedias.length, el.curIndex + 1 + STEP));

  // const addTopEls = () => setEl("curIndex", (prev) => (prev > 1 ? prev - 1 : prev));
  // const addBottomEls = () => setEl("curIndex", (prev) => (prev < displayMedias.length - 1 ? prev + 1 : prev));

  ////////////////////TEST////////////////////////

  // createMemo(() => {
  //   const elementIdx: string | undefined = element()?.dataset.modalidx;
  //   const elementId: string | undefined = element()?.dataset.modalid;

  //   if (!elementId) return;
  //   console.log("scroll", elementIdx, elementId);
  //   // handleSelectItems(parseInt(elementIdx!), elementId, element()!);
  // });

  // createMemo(() => {
  //   if (el && el.divEl) el.divEl.scrollIntoView({ behavior: "instant", block: "start" });
  // });

  createEffect(() => {
    if (isVisible()) {
      console.log(el.divEl!.outerHTML);
    }
  });

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header style={{ "z-index": 1 }}>
          <button
            onClick={() => {
              window.history.back();
              handleCloseModal();
            }}>
            {GoBackIcon()}
          </button>
          <div class={styles.modalTitle}>
            {/* <p>{displayTime()?.date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime()?.time}</p> */}
          </div>
          <div class="buttonContainer">
            {/* <span>Edit</span> */}
            {/* <span>View</span> */}
            {/* <button onClick={addTopEls}>TOP </button>
            <button onClick={addBottomEls}>BOTTOM </button> */}
          </div>
        </header>

        <div class={styles.modalImages}>
          <For each={modalMedias()}>
            {(media, index) => {
              const currentIndex = el.curIndex - (STEP - index());
              // return media.media_id === el.curId ? (
              //   <MediaDisplay
              //     refSetter={(el: StoreSetter<any>) => setEl("divEl", el)}
              //     media={media}
              //     index={currentIndex}
              //   />
              // ) : (
              return (
                <MediaDisplay
                  refSetter={(el: StoreSetter<any>) => setEl("divEl", el)}
                  media={media}
                  index={currentIndex}
                />
              );
              // );
            }}
          </For>
        </div>

        <div class={styles.modalThumbs}>
          <For each={modalMedias()}>
            {(media, index) => {
              const currentIndex = el.curIndex - (STEP - index());
              return (
                <div
                  data-thumbId={media.media_id}
                  onClick={() => {
                    const element: HTMLElement | null = document.querySelector(`[data-modalId="${media.media_id}"]`);
                    handleSelectItems(currentIndex, media.media_id, element!);
                  }}>
                  <img src={media.ThumbPath} />
                </div>
              );
            }}
          </For>
        </div>

        <ActionNav />
      </div>
    </Portal>
  );
};

export default Modal;

const formatTime = (timestamp: string): { date: string; time: string } => {
  const date = new Date(timestamp);
  return {
    date: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date),
    time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: true }).format(date),
  };
};

// const getSubElements = (arr: MediaType[], midIdx: number): MediaType[] => {
//   const startIdx = Math.max(0, midIdx - NUMBER_OF_MEDIAS_MODAL);
//   const endIdx = Math.min(arr.length, midIdx + NUMBER_OF_MEDIAS_MODAL + 1);
//   return arr.slice(startIdx, endIdx);
// };
