import styles from "./ModalView.module.css";

import { Portal } from "solid-js/web";
import { Component, createMemo, createSignal, For, onMount, Setter, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { List } from "@solid-primitives/list";

import { MediaType, useViewMediaContext } from "../../context/ViewContext";
import { useMediaContext } from "../../context/Medias";
import { CustomButtonIcon, GoBackIcon, ObjectFitContainIcon, ObjectFitCoverIcon } from "../svgIcons";

import MediaDisplay from "./MediaDisplay";
import { scrollIntoViewFc } from "../extents/helper/helper";
import NotFound from "../extents/NotFound";
import ActionNav from "../photoview/actionNav/ActionNav";

interface ElementModal {
  elIndex: number;
  elId: string;
}

interface ModalProps {
  setLastEl: Setter<HTMLElement | null | undefined>;
}

const BUFFER_ITEM = 3;
const ITEM_HEIGHT = window.innerHeight + 100; // Full innerHeight + 100px for gap
const VIEWPORT_HEIGHT = ITEM_HEIGHT * BUFFER_ITEM;

const VISIBLE_ITEM = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT) + 2;

const Modal: Component<ModalProps> = (props) => {
  const { setOpenModal, displayMedias } = useViewMediaContext();
  const { items, setItems, setOneItem } = useMediaContext();

  const [showImageOnly, setShowImageOnly] = createSignal(false);

  // when this modal close
  const handleCloseModal = () => {
    setItems(new Map());
    setOpenModal(false);
  };

  /** Tracking current index display on the screen */
  const [current, setCurrent] = createStore<ElementModal>({
    elIndex: items().keys().next().value!, // Current selected index
    elId: items().values().next().value!, // Current Id of selected el
  });

  ///////////////// Virtualization Modal /////////////////////////////////////////////////
  let containerRef!: HTMLDivElement;
  const [scrollTop, setScrollTop] = createSignal(current.elIndex * ITEM_HEIGHT);

  const startIndex = createMemo(() => Math.max(0, Math.floor(scrollTop() / ITEM_HEIGHT) - 1));
  const endIndex = createMemo(() => Math.min(displayMedias.length - 1, startIndex() + VISIBLE_ITEM));

  const visualModal = createMemo(() => {
    if (displayMedias.length === 0) {
      window.history.back();
      return [];
    }
    return displayMedias.slice(startIndex(), endIndex() + 1);
  });

  /** If the last item is removed, and we are scrolled past the new end of the list,
   * we should adjust the scroll: */
  createMemo(() => {
    if (startIndex() >= displayMedias.length - 1) setScrollTop((displayMedias.length - 1) * ITEM_HEIGHT);
  });

  onMount(() => {
    // Scroll to selected element in Modal
    scrollToModalElement(current.elId);

    // On close or clicked back button, remove the top state on the stack
    window.onpopstate = (event) => {
      if (!event.state) return;
      handleCloseModal();
      scrollToViewElement(current.elId); // scroll to view to the current id in PhotoView
    };

    // viewModal control object fit and contain
    setViewModal(document.documentElement.style.getPropertyValue("--objectFitModal"));
  });

  const setSelectCurrentItem = (index: number, mediaId: string) => {
    setCurrent({ elId: mediaId, elIndex: index });
    setOneItem(current.elIndex, current.elId);
  };

  // Display time in header
  const displayTime = createMemo(() => {
    const curEl = displayMedias[current.elIndex];
    if (!curEl) return { date: "", time: "" };
    return formatTime(curEl.CreateDate);
  });

  /** Create sublist for thumbnails */
  const modalMedias = () => getSublist(displayMedias, current.elIndex);
  const [viewModal, setViewModal] = createSignal<string>("");

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header classList={{ [styles.fadeOut]: showImageOnly() }} style={{ "z-index": 1 }}>
          <div class="buttonContainer">
            <button
              onClick={() => {
                window.history.back();
                handleCloseModal();
              }}>
              {GoBackIcon()}
            </button>
          </div>

          <div class={styles.modalTitle}>
            <p>{displayTime().date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime().time}</p>
          </div>
          <div class="buttonContainer">
            <button
              style={{ visibility: displayMedias[current.elIndex]?.FileType !== "Photo" ? "hidden" : "visible" }}
              onClick={() => {
                setViewModal((prev) => (prev === "contain" ? "cover" : "contain"));
                document.documentElement.style.setProperty("--objectFitModal", viewModal());
              }}>
              {viewModal() === "contain" ? ObjectFitCoverIcon() : ObjectFitContainIcon()}
            </button>
            <button popoverTarget="more-modal-popover">{CustomButtonIcon()}</button>
            <div popover="auto" id="more-modal-popover" class="popover-container devices_filter_popover">
              <div>TESTING...</div>
              <div>TESTING...</div>
              <div>TESTING...</div>
            </div>
          </div>
        </header>

        <div
          class={styles.modalImages}
          ref={containerRef}
          id="modalImages"
          onScroll={(event) => {
            event.preventDefault();
            setScrollTop(containerRef.scrollTop);
          }}>
          <div class={styles.visualList} style={{ height: `${displayMedias.length * ITEM_HEIGHT}px` }}>
            <For each={visualModal()}>
              {(media, index) => (
                <MediaDisplay
                  /** Loadmore base on the last element of Modal:
                   * lastEl target is set to equal element in ModalView in MediaDisplay */
                  setLastEl={displayMedias.length - 1 === startIndex() + index() ? props.setLastEl : undefined}
                  topPos={(startIndex() + index()) * ITEM_HEIGHT}
                  viewIndex={startIndex() + index()}
                  media={media}
                  setSelectCurrentItem={setSelectCurrentItem}
                  setShowImageOnly={setShowImageOnly}
                  showImageOnly={showImageOnly}
                />
              )}
            </For>
          </div>
        </div>

        <div classList={{ [styles.modalThumbs]: true, [styles.fadeOut]: showImageOnly() || displayMedias.length <= 1 }}>
          <List each={modalMedias()} fallback={<NotFound />}>
            {(media, index) => (
              <div
                style={media().media_id === current.elId ? { width: "70px", height: "60px", margin: "0 5px" } : {}}
                data-thumbId={media().media_id}
                // onClick={() => {
                //   const numberOfSteps = calculateIndex(index(), current.elIndex, displayMedias.length);
                //   const navigateToIndex = current.elIndex + numberOfSteps;

                //   if (current.elIndex === navigateToIndex) return;
                //   updateCurrent(navigateToIndex);
                // }}
              >
                <img inert src={media().ThumbPath} />
              </div>
            )}
          </List>
        </div>

        <div classList={{ [styles.fadeOut]: showImageOnly() }}>
          <ActionNav />
        </div>
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
 * Scrolls to the specified element using its data-modalid attribute.
 * @param modalid - The unique identifier of the target element.
 */
const scrollToModalElement = (modalid: string): void => {
  scrollIntoViewFc("modalid", modalid);
};

/**
 * Scrolls to the specified element using its data-modalid attribute.
 * @param mediaId - The unique identifier of the target element.
 */
const scrollToViewElement = (mediaId: string): void => {
  scrollIntoViewFc("id", mediaId);
};

// There is an issue when change displaySize to 10 or diffrent number, When clicked on specific item, it does not return the correct element.
const DISPLAY_SIZE = 11; // We want to show at least 7 elements
const BUFFER_SIZE = Math.floor(DISPLAY_SIZE / 2); // 3 elements before and after the current index

/**
 * Retrieves a sublist of elements centered around the current index, adjusting for boundaries.
 * @param elements - The full list of media elements.
 * @param currentIndex - The index of the currently active element.
 * @returns A sublist of elements, dynamically adjusted based on the current index.
 */
const getSublist = (elements: MediaType[], currentIndex: number): MediaType[] => {
  //(MediaType & { index: number })[]
  const totalElements = elements.length;

  // If the list has fewer elements than DISPLAY_SIZE, return the full list
  if (totalElements <= DISPLAY_SIZE) return elements; //elements.map((item, index) => ({ ...item, index }));

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

  const subModalList = elements.slice(startIndex, endIndex + 1);
  // const subModalListIds = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => ({
  //   ...elements[startIndex + i],
  //   index: startIndex + i,
  // }));

  return subModalList;
};

// /**
//  * Calculates the step difference required to move from the current index
//  * to the target index based on buffer constraints.
//  * @param targetIndex - The index of the clicked thumbnail.
//  * @param currentIndex - The current active index.
//  * @param arrayLength - The total length of the array.
//  * @returns The computed step difference for navigation.
//  */
// const calculateIndex = (targetIndex: number, currentIndex: number, arrayLength: number): number => {
//   if (targetIndex === currentIndex) return 0; // No movement needed

//   const isAtEnd = currentIndex + BUFFER_SIZE >= arrayLength;
//   const isAtStart = currentIndex - BUFFER_SIZE < 0;

//   if (isAtEnd) {
//     return targetIndex - (arrayLength - BUFFER_SIZE - 1);
//   } else if (isAtStart) {
//     return targetIndex;
//   }

//   return targetIndex - currentIndex;
// };

// const updateCurrent = (newIndex: number): void => {
//   if (newIndex < 0 || newIndex >= displayMedias.length) return; // Prevent out-of-bounds access
//   setSelectCurrentItem(newIndex, displayMedias[newIndex].media_id);
//   setScrollTop(newIndex * ITEM_HEIGHT);
//   scrollToModalElement(current.elId);
// };

// const startIndex = createMemo(() => {
//   const minIdx = Math.min(
//     Math.floor(scrollTop() / ITEM_HEIGHT) - 1,
//     displayMedias.length - 1
//   );
//   return Math.max(0, minIdx);
// });
