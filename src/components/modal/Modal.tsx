import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createEffect, createMemo, createSignal, For, Index, onMount } from "solid-js";

import { useElementByPoint, useIntersectionObserver } from "solidjs-use";

import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";

import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";
import { createStore } from "solid-js/store";
import { List } from "@solid-primitives/list";

export interface ElementModal {
  curIndex: number;
  curId: string;
  curEl: HTMLElement | null;
}

const DISPLAY_SIZE = 7; // We want to show at least 7 elements
const BUFFER_SIZE = 3; // 3 elements before and after the current index

const Modal = () => {
  const { setOpenModal, displayMedias } = useViewMediaContext();
  const { items, setItems, setOneItem } = useMediaContext();

  const [showImageOnly, setShowImgOnly] = createSignal(false);

  // when this modal close
  const handleCloseModal = () => {
    setItems(new Map());
    setOpenModal(false);
  };

  /////////////////////////////////////////////////////////////

  const [current, setCurrent] = createStore<ElementModal>({
    curIndex: items().keys().next().value!, // Current selected index
    curId: items().values().next().value!, // Current Id of selected el
    curEl: null,
  });

  onMount(() => {
    // Scroll to selected element in Modal
    handleScrolltoEl(displayMedias[current.curIndex].media_id);

    // On close or clicked back button, remove the top state on the stack
    window.onpopstate = (event) => {
      if (event.state) handleCloseModal();
    };

    setCurrent("curEl", element());
  });

  const modalMedias = createMemo(() => getSublist(displayMedias, current.curIndex));

  // const updateList = () => {
  //   const result = getSublist(displayMedias, current.curIndex);
  //   // setModalMedias(result);
  // };

  //Tracking current element on screen based on x and y
  const { element } = useElementByPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const updateCurrent = (direction: number): void => {
    setCurrent({
      curEl: element(),
      curId: displayMedias[current.curIndex + direction].media_id,
      curIndex: current.curIndex + direction,
    });
    handleScrolltoEl(current.curId);
  };

  const shiftUp = () => {
    if (current.curIndex > 0) {
      updateCurrent(-1);
      console.log("UP: ", current.curIndex);
    }
  };

  const shiftDown = () => {
    if (current.curIndex < displayMedias.length) {
      // setCurrent("curIndex", (prev) => prev + 1);
      console.log("Down: ", current.curIndex);
      updateCurrent(1);
    }
  };

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header style={{ "z-index": 1, opacity: showImageOnly() ? 0 : 1 }}>
          <button
            onClick={() => {
              window.history.back();
              handleCloseModal();
            }}>
            {GoBackIcon()}
          </button>
          <div class={styles.modalTitle}>
            {/* <p>{displayTime().date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime().time}</p> */}
          </div>
          <div class="buttonContainer">
            <button class={styles.modalButtons} onClick={shiftUp}>
              Up
            </button>
            <button class={styles.modalButtons} onClick={shiftDown}>
              Down
            </button>

            <button class={styles.modalButtons} onClick={shiftDown}>
              SetEl
            </button>
          </div>
        </header>

        <div class={styles.modalImages} id="modalImages">
          <For each={modalMedias()}>
            {(media, index) => {
              console.log("Create new", index());
              return (
                <MediaDisplay media={media} index={displayMedias.indexOf(media)} setShowImgOnly={setShowImgOnly} />
              );
            }}
          </For>
        </div>

        <div class={styles.modalThumbs} style={{ opacity: showImageOnly() ? 0 : 1 }}>
          <For each={modalMedias()}>
            {(media, index) => {
              return (
                <div
                  style={media.media_id === current.curId ? { width: "70px", margin: "0 5px" } : {}}
                  data-thumbId={media.media_id}
                  onClick={() => {}}>
                  <img inert src={media.ThumbPath} />
                </div>
              );
            }}
          </For>
        </div>

        <ActionNav showImageOnly={showImageOnly()} />
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

const handleScrolltoEl = (elId: string) => {
  const element = document.querySelector(`[data-modalId="${elId}"]`);
  if (element) element.scrollIntoView({ behavior: "auto", block: "start" });
};

const getIndex = (elCurIdx: number, idx: number) => {
  return elCurIdx < BUFFER_SIZE ? idx : elCurIdx - (BUFFER_SIZE - idx);
};

const getElementId = (el: HTMLElement) => {
  console.log(el.dataset.modalid);
  return el.dataset.modalid;
};

function getSublist(elements: MediaType[], currentIndex: number) {
  // Case 1: If the list is smaller than 7 elements, return the whole list
  if (elements.length <= DISPLAY_SIZE) {
    return elements;
  }

  // Case 2: If the list is large enough, we want to dynamically calculate the sublist
  let start = currentIndex - BUFFER_SIZE;
  let end = currentIndex + BUFFER_SIZE;

  // Case 3: If the start goes below 0, adjust the window to the left
  if (start < 0) {
    start = 0;
    end = DISPLAY_SIZE - 1;
  }

  // Case 4: If the end exceeds the list's length, adjust the window to the right
  if (end >= elements.length) {
    end = elements.length - 1;
    start = end - (DISPLAY_SIZE - 1);
  }

  // Return the sublist by slicing the elements from start to end (inclusive)
  return elements.slice(start, end + 1);
}

const IntersectionOnScroll = (currentSelectedItem: (idx: number, id: string) => void): void => {
  const elements = document.querySelectorAll<HTMLElement>("#modalImages");

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const mediaEl = entry.target as HTMLElement;
          const modalIdx = mediaEl.dataset.modalidx ? parseInt(mediaEl.dataset.modalidx, 10) : NaN;
          const modalId = mediaEl.dataset.modalid;

          if (!isNaN(modalIdx) && modalId) {
            currentSelectedItem(modalIdx, modalId);
          }
        }
      });
    },
    { threshold: 1 }
  );

  elements.forEach((el) => observer.observe(el));
};
