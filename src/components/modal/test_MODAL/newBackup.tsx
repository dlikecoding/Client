import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useIntersectionObserver } from "solidjs-use";

import { useViewMediaContext } from "../../../context/ViewContext";
import { useMediaContext } from "../../../context/Medias";

import { GoBackIcon } from "../../svgIcons";
import ActionNav from "../../photoview/actionNav/ActionNav";
import MediaDisplay from "../MediaDisplay";

export interface ElementModal {
  curIndex: number;
  curMediaId: string;
}

const STEP = 5;

const Modal = () => {
  const { setOpenModal, displayMedias } = useViewMediaContext();
  const { items, setItems, setOneItem } = useMediaContext();

  // when this modal close
  const handleCloseModal = () => {
    setItems(new Map());
    setOpenModal(false);
  };

  // Scroll to selected element in Modal
  // On close or clicked back button, remove the top state on the stack
  onMount(async () => {
    handleScrolltoEl(el.curMediaId);

    window.onpopstate = (event: PopStateEvent) => {
      if (event.state) handleCloseModal();
    };

    const allMedias = document.querySelector("#modalImages");
    setElementRefs(allMedias?.childNodes);
  });

  /////////////////////////////////////////////////////////////

  // Create tracking current element displaying in DOME tree
  const [el, setEl] = createStore<ElementModal>({
    curIndex: items().keys().next().value!, // Current selected index
    curMediaId: items().values().next().value!, // Current Id of selected el
  });

  // List of medias. Started with selected mediaID and then add 2 lement on the top and 2 element in the bottom
  const modalMedias = createMemo(() => {
    const startIndex = Math.max(0, el.curIndex - STEP);
    const endIndex = Math.min(displayMedias.length, el.curIndex + 1 + STEP);

    return displayMedias.slice(startIndex, endIndex);
  });

  // When Item scrolled to or clicked in thumb image, it will change current element (el)
  const handleSelectItems = (idx: number, id: string) => {
    if (el.curIndex === idx || el.curMediaId === id) return;

    setOneItem(idx, id);
    setEl({ curMediaId: id, curIndex: idx });
  };

  const [elementsRefs, setElementRefs] = createSignal<NodeListOf<ChildNode> | undefined>();

  createMemo(() => {
    if (modalMedias()) {
      console.log("On Changed...");
      const allMedias = document.querySelector("#modalImages");
      setElementRefs(allMedias?.childNodes);
      // IntersectionOnScroll(elementsRefs(), handleSelectItems);
    }
  });

  // Create observtion for all elements in DOME

  // Display Date and Time on the header
  const displayTime = createMemo(() => formatTime(displayMedias[el.curIndex]?.CreateDate));

  const [showImageOnly, setShowImgOnly] = createSignal(false);

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
            <p>{displayTime().date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime().time}</p>
          </div>
          <div class="buttonContainer">
            {/* <span>Edit</span> */}
            <span>View</span>
          </div>
        </header>

        <div class={styles.modalImages} id="modalImages">
          <For each={modalMedias()}>
            {(media, index) => {
              const curIndex = currentIndex(el.curIndex, index());

              return (
                <MediaDisplay
                  // refSetter={(el) => setElementRefs((prev) => [...prev, el])}
                  media={media}
                  index={curIndex}
                  setShowImgOnly={setShowImgOnly}
                />
              );
            }}
          </For>
        </div>

        <div class={styles.modalThumbs} style={{ opacity: showImageOnly() ? 0 : 1 }}>
          <For each={modalMedias()}>
            {(media, index) => {
              const curIndex = currentIndex(el.curIndex, index());
              return (
                <div
                  style={media.media_id === el.curMediaId ? { width: "70px", margin: "0 5px" } : {}}
                  data-thumbId={media.media_id}
                  onClick={() => {
                    handleScrolltoEl(media.media_id);
                    handleSelectItems(curIndex, media.media_id);
                  }}>
                  <img src={media.ThumbPath} />
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
  if (element) element.scrollIntoView({ behavior: "instant", block: "start" });
};

const currentIndex = (elCurIdx: number, idx: number) => {
  return elCurIdx < STEP ? idx : elCurIdx - (STEP - idx);
};

const IntersectionOnScroll = async (elements: HTMLElement[], handleSelectItems: (idx: number, id: string) => void) => {
  // const allMedias = document.querySelectorAll("#modalImages");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const mediaEl = entry.target as HTMLElement;
          handleSelectItems(parseInt(mediaEl.dataset.modalidx!), mediaEl.dataset.modalid!);
        }
      });
    },
    { threshold: 1 }
  );

  elements.forEach((el: HTMLElement) => observer.observe(el));
};

// Initialize Intersction Observe:
// createMemo(() => {
//   console.log("Run observer ... ");
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           // Do some thing
//           const mediaEl = entry.target as HTMLElement;
//           // handleIntersection(media.media_id, currentIndex, el)
//           // if (mediaEl.dataset)

//           handleSelectItems(parseInt(mediaEl.dataset.modalidx!), mediaEl.dataset.modalid!);
//         }
//       });
//     },
//     { threshold: 1 } // Adjust threshold as needed
//   );

//   elementsRefs().forEach((el: HTMLElement) => observer.observe(el));

//   onCleanup(() => observer.disconnect());
// });
