import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { Component, createEffect, createMemo, createSignal, For, Index, onMount, Setter } from "solid-js";

import { useElementByPoint, useIntersectionObserver } from "solidjs-use";

import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";

import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";
import { createStore, SetStoreFunction, StoreSetter } from "solid-js/store";
import { List } from "@solid-primitives/list";

export interface ElementModal {
  elIndex: number;
  elId: string;
  curEl?: HTMLElement | null;
}

interface ModalProps {
  lastItem?: Setter<HTMLElement | null>;
}

const DISPLAY_SIZE = 7; // We want to show at least 7 elements
const BUFFER_SIZE = Math.floor(DISPLAY_SIZE / 2); // 3 elements before and after the current index

const Modal: Component<ModalProps> = (props) => {
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
    elIndex: items().keys().next().value!, // Current selected index
    elId: items().values().next().value!, // Current Id of selected el
  });

  onMount(() => {
    // Scroll to selected element in Modal
    scrollToElement(current.elId);

    // On close or clicked back button, remove the top state on the stack
    window.onpopstate = (event) => {
      if (event.state) handleCloseModal();
    };
  });

  const modalMedias = () => getSublist(displayMedias, current.elIndex);

  const setData = (index: number, mediaId: string) => {
    setCurrent({
      elId: mediaId,
      elIndex: index,
    });
    setOneItem(current.elIndex, current.elId);
  };

  const updateCurrent = (newIndex: number): void => {
    if (newIndex < 0 || newIndex >= displayMedias.length) return; // Prevent out-of-bounds access
    setData(newIndex, displayMedias[newIndex].media_id);
    scrollToElement(current.elId);
  };

  const shiftUp = () => updateCurrent(current.elIndex - 1);
  const shiftDown = () => updateCurrent(current.elIndex + 1);

  // //Tracking current element on screen based on x and y
  // const { element } = useElementByPoint({
  //   x: window.innerWidth / 2,
  //   y: window.innerHeight / 2,
  //   multiple: false,
  //   // immediate: false,
  //   // interval: 500,
  // });

  // createMemo(() => {
  //   // Auto select the next element after an item deleted
  //   if (items().size === 0) {
  //     // Handle the case where the list empty - Close Modal
  //     if (displayMedias.length === 0) handleCloseModal();

  //     // Handle index delete is the last index
  //     // current.elIndex >= displayMedias.length - 1 ? current.elIndex - 1 : current.elIndex;
  //     const index = current.elIndex >= displayMedias.length - 1 ? current.elIndex - 1 : current.elIndex; //Math.min(current.elIndex, displayMedias.length - 1);
  //     const mediaId = displayMedias[index].media_id;

  //     console.log(index, mediaId);
  //     console.log(displayMedias);

  //     setData(index, mediaId);
  //     scrollToElement(current.elId);
  //   }
  // });

  // createEffect(() => {
  //   console.log("Current before", current.elIndex, current.elId);

  //   const mediaEl = element()?.dataset;
  //   if (!mediaEl) return;
  //   const modalIdx = mediaEl.modalidx ? parseInt(mediaEl.modalidx, 10) : NaN;
  //   const modalId = mediaEl.modalid;

  //   if (isNaN(modalIdx) || !modalId) return;
  //   if (current.elIndex === modalIdx || current.elId === modalId) return;

  //   if (current.elIndex < modalIdx) {
  //     //Shirt down
  //     shiftDown();
  //   }

  //   if (current.elIndex > modalIdx) {
  //     //Shirt up
  //     shiftUp();
  //   }
  //   console.log("Current:", current.elIndex, modalIdx, current.elId, modalId, current.elId === modalId);
  //   // setCurrent({ elIndex: modalIdx, elId: modalId });
  // });

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
          </div>
        </header>

        <div class={styles.modalImages} id="modalImages">
          <List each={modalMedias()}>
            {(media, index) => {
              // const currentIndex = displayMedias.indexOf(media());

              return <MediaDisplay media={media()} index={0} setShowImgOnly={setShowImgOnly} />;
            }}
          </List>
        </div>

        <div class={`${styles.modalThumbs} ${showImageOnly() ? "hideButtons" : ""}`}>
          <List each={modalMedias()}>
            {(media, index) => {
              // const edgeEl: boolean = index === 0 || modalMedias().length - 1 ? true : false;
              // const currentIndex = displayMedias.indexOf(media());
              return (
                <div
                  style={media().media_id === current.elId ? { width: "70px", height: "60px", margin: "0 5px" } : {}}
                  data-thumbId={media().media_id}
                  data-idx={index()}
                  onClick={() => {
                    const numberOfSteps = calculateIndex(index(), current.elIndex, displayMedias.length);
                    const navigateToIndex = current.elIndex + numberOfSteps;

                    if (current.elIndex === navigateToIndex) return;

                    updateCurrent(navigateToIndex);
                  }}>
                  <img inert src={media().ThumbPath} />
                </div>
              );
            }}
          </List>
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

/**
 * Scrolls to the specified element using its data-modalId attribute.
 *
 * @param modalId - The unique identifier of the target element.
 */
const scrollToElement = (modalId: string): void => {
  const targetElement = document.querySelector(`[data-modalId="${modalId}"]`) as HTMLElement | null;

  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "instant", block: "start" });
  }
};

/**
 * Calculates the step difference required to move from the current index
 * to the target index based on buffer constraints.
 * @param targetIndex - The index of the clicked thumbnail.
 * @param currentIndex - The current active index.
 * @param arrayLength - The total length of the array.
 * @returns The computed step difference for navigation.
 */
const calculateIndex = (targetIndex: number, currentIndex: number, arrayLength: number): number => {
  const isAtEnd = currentIndex + BUFFER_SIZE >= arrayLength;

  return isAtEnd
    ? targetIndex - 2 * BUFFER_SIZE - currentIndex + arrayLength - 1
    : targetIndex - Math.min(currentIndex, BUFFER_SIZE);
};

const getElementId = (el: HTMLElement) => {
  console.log(el.dataset.modalid);
  return el.dataset.modalid;
};

/**
 * Retrieves a sublist of elements centered around the current index, adjusting for boundaries.
 * @param elements - The full list of media elements.
 * @param currentIndex - The index of the currently active element.
 * @returns A sublist of elements, dynamically adjusted based on the current index.
 */
const getSublist = (elements: MediaType[], currentIndex: number): MediaType[] => {
  const totalElements = elements.length;

  // Case 1: If the list has fewer elements than DISPLAY_SIZE, return the full list
  if (totalElements <= DISPLAY_SIZE) {
    return elements;
  }

  // Define initial sublist range
  let startIndex = Math.max(0, currentIndex - BUFFER_SIZE);
  let endIndex = Math.min(totalElements - 1, currentIndex + BUFFER_SIZE);

  // Adjust window if it doesn’t fit within DISPLAY_SIZE
  if (endIndex - startIndex + 1 < DISPLAY_SIZE) {
    if (startIndex === 0) {
      endIndex = Math.min(DISPLAY_SIZE - 1, totalElements - 1);
    } else if (endIndex === totalElements - 1) {
      startIndex = Math.max(0, totalElements - DISPLAY_SIZE);
    }
  }

  // Return the sublist
  return elements.slice(startIndex, endIndex + 1);
};
