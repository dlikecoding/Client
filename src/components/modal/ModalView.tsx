import styles from "./ModalView.module.css";

import { Portal } from "solid-js/web";
import { Accessor, Component, createMemo, createSignal, For, onMount, Setter, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { useManageURLContext } from "../../context/ManageUrl";
import { useViewMediaContext } from "../../context/ViewContext";
import { useMediaContext } from "../../context/Medias";
import { CompressIcon, CustomButtonIcon, ExpandIcon, GoBackIcon, ZoomInIcon, ZoomOutIcon } from "../svgIcons";

import { formatTime, scrollToModalElement, scrollToViewElement } from "../extents/helper/helper";
import MediaDisplay from "./MediaDisplay";
import ActionNav from "../photoview/actionNav/ActionNav";
import { useResizeObserver } from "solidjs-use";
// import NotFound from "../extents/NotFound";
// import { List } from "@solid-primitives/list";

interface ElementModal {
  elIndex: number;
  elId: number;
}

interface ModalProps {
  // visibleRows: Accessor<MediaType[]>;

  setLastEl: Setter<HTMLElement | null | undefined>;
  endIdxView: Accessor<number>;
  startIdxView: Accessor<number>;
}

const BUFFER_ITEM = 3;

const PADDING = 200;
const ITEM_HEIGHT = window.innerHeight + PADDING; // Full innerHeight + 100px for gap

const VIEWPORT_HEIGHT = ITEM_HEIGHT * BUFFER_ITEM;
const VISIBLE_ITEM = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT) + 2;

const Modal: Component<ModalProps> = (props) => {
  const { showImageOnly, setOpenModal, displayMedias } = useViewMediaContext();
  const { items, setItems, setOneItem } = useMediaContext();

  const { view, setView } = useManageURLContext();

  // const visibleRows = () => props.visibleRows();

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
  let containerRef: HTMLDivElement;

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
      scrollToViewElement(current.elId, "nearest"); // scroll to view to the current id in PhotoView
    };

    // Observer window.innerHeight on change to prevent photo overlapping
    useResizeObserver(containerRef, (_entries) => {});
  });

  const setSelectCurrentItem = (index: number, mediaId: number) => {
    setCurrent({ elId: mediaId, elIndex: index });
    setOneItem(current.elIndex, current.elId);
  };

  // Display time in header
  const displayTime = createMemo(() => {
    const curEl = displayMedias[current.elIndex];
    if (!curEl) return { date: "", time: "" };
    return formatTime(curEl.create_date);
  });

  const endIdxView = () => props.endIdxView();
  const startIdxView = () => props.startIdxView();

  /** On Scroll, set scroll top. Check if current position is equal to the START/END INDEX in
   * ContextView, if so, scroll to it */
  const onScrollModal = (e: Event) => {
    e.preventDefault();
    setScrollTop(containerRef.scrollTop);

    // In the case user loading passed the range of ContextView, scroll to that element in context view
    if (current.elIndex === endIdxView() || current.elIndex === startIdxView()) {
      scrollToViewElement(current.elId);
    }
  };

  // // Reset zoom when scroll to other elements
  createMemo(() => {
    if (current.elId) setView("zoomLevel", 1);
  });

  /** Create sublist for thumbnails */
  // const modalMedias = () => getSublist(displayMedias, current.elIndex);

  // Create auto change object fit for images and videos in modal:
  createMemo(() => {
    const objectFit = view.modalObjFit ? "contain" : "cover";
    document.documentElement.style.setProperty("--modal-object-fit", objectFit);
  });

  const handleZoom = (input: number) => {
    setView("zoomLevel", (prev) => prev + input);
  };

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header classList={{ [styles.fadeOut]: showImageOnly() }} style={{ "z-index": 2 }}>
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
            <button onClick={() => setView("modalObjFit", (prev) => !prev)}>
              {view.modalObjFit ? ExpandIcon() : CompressIcon()}
            </button>

            <button popoverTarget="more-modal-popover">{CustomButtonIcon()}</button>
            <div popover="auto" id="more-modal-popover" class="popover-container devices_filter_popover">
              <div class="media_type_contents">
                <button onClick={() => handleZoom(1)} disabled={view.zoomLevel === 5}>
                  {ZoomInIcon()}
                </button>
                <span>Zoom</span>
                <button onClick={() => handleZoom(-1)} disabled={view.zoomLevel === 1}>
                  {ZoomOutIcon()}
                </button>
              </div>

              <div onClick={() => setView("showThumb", (prev) => !prev)}>
                Thumbnails {view.showThumb ? "ON" : "OFF"}
              </div>
              <div onClick={() => setView("autoplay", (prev) => !prev)}>
                Video Autoplay {view.autoplay ? "ON" : "OFF"}
              </div>
              {/* <div>Show ON </div> */}
            </div>
          </div>
        </header>

        <div class={styles.modalImages} ref={(el) => (containerRef = el)} id="modalImages" onScroll={onScrollModal}>
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
                />
              )}
            </For>
          </div>
        </div>

        {/* <Show when={view.showThumb}>
          <div
            classList={{ [styles.modalThumbs]: true, [styles.fadeOut]: showImageOnly() || displayMedias.length <= 1 }}>
            <List each={visibleRows()} fallback={<NotFound />}>
              {(media, index) => (
                <div
                  style={media().media_id === current.elId ? { width: "50px", margin: "0 5px" } : {}}
                  // data-thumbId={media().media_id}
                  onClick={() => {
                    console.log(media().media_id, index(), startIndex(), endIdxView());
                    // setSelectCurrentItem
                  }}>
                  <img inert src={media().thumb_path} />
                </div>
              )}
            </List>
          </div>
        </Show> */}

        <div classList={{ [styles.fadeOut]: showImageOnly() }}>
          <ActionNav />
        </div>
      </div>
    </Portal>
  );
};

export default Modal;

// // There is an issue when change displaySize to 10 or diffrent number, When clicked on specific item, it does not return the correct element.
// const DISPLAY_THUMBS_SIZE = 7; // We want to show at least 7 elements
// const BUFFER_SIZE = Math.floor(DISPLAY_THUMBS_SIZE / 2); // 3 elements before and after the current index

// /**
//  * Retrieves a sublist of elements centered around the current index, adjusting for boundaries.
//  * @param elements - The full list of media elements.
//  * @param currentIndex - The index of the currently active element.
//  * @returns A sublist of elements, dynamically adjusted based on the current index.
//  */
// const getSublist = (elements: MediaType[], currentIndex: number): MediaType[] => {
//   //(MediaType & { index: number })[]
//   const totalElements = elements.length;

//   // If the list has fewer elements than DISPLAY_THUMBS_SIZE, return the full list
//   if (totalElements <= DISPLAY_THUMBS_SIZE) return elements; //elements.map((item, index) => ({ ...item, index }));

//   // Define initial sublist range
//   let startIndex = Math.max(0, currentIndex - BUFFER_SIZE);
//   let endIndex = Math.min(totalElements - 1, currentIndex + BUFFER_SIZE);

//   // Adjust window if it doesn’t fit within DISPLAY_THUMBS_SIZE
//   if (endIndex - startIndex + 1 < DISPLAY_THUMBS_SIZE) {
//     if (startIndex === 0) {
//       endIndex = Math.min(DISPLAY_THUMBS_SIZE - 1, totalElements - 1);
//     } else if (endIndex === totalElements - 1) {
//       startIndex = Math.max(0, totalElements - DISPLAY_THUMBS_SIZE);
//     }
//   }

//   const subModalList = elements.slice(startIndex, endIndex + 1);
//   // const subModalListIds = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => ({
//   //   ...elements[startIndex + i],
//   //   index: startIndex + i,
//   // }));

//   return subModalList;
// };

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
