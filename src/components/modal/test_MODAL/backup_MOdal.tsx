import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createMemo, createSignal, For, onMount } from "solid-js";

import { useIntersectionObserver } from "solidjs-use";

import { useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";

import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";
import { createStore } from "solid-js/store";
import { List } from "@solid-primitives/list";

export interface ElementModal {
  curIndex: number;
  curId: string;
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

  // On close or clicked back button, remove the top state on the stack
  window.onpopstate = (event) => {
    if (event.state) handleCloseModal();
  };
  /////////////////////////////////////////////////////////////

  // Create tracking current element displaying in DOME tree
  const [el, setEl] = createStore<ElementModal>({
    curIndex: items().keys().next().value!, // Current selected index
    curId: items().values().next().value!, // Current Id of selected el
  });

  // List of medias. Started with selected mediaID and then add 2 lement on the top and 2 element in the bottom
  const modalMedias = () =>
    displayMedias.slice(Math.max(0, el.curIndex - STEP), Math.min(displayMedias.length, el.curIndex + 1 + STEP));

  // When Item scrolled to or clicked in thumb image, it will change current element (el)
  const handleSelectItems = (idx: number, id: string) => {
    setOneItem(idx, id);
    setEl({ curId: id, curIndex: idx });
  };

  // Create observtion for all elements in DOME
  const handleIntersection =
    (id: string, idx: number) =>
    ([entry]: IntersectionObserverEntry[]) => {
      if (!entry.isIntersecting) return;

      return handleSelectItems(idx, id);
    };

  // Display Date and Time on the header
  const displayTime = createMemo(() => formatTime(displayMedias[el.curIndex].CreateDate));

  // Scroll to selected element in Modal
  onMount(() => {
    handleScrolltoEl(el.curId);
  });

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
            <button class={styles.modalButtons} onClick={() => console.log("View change clicked")}>
              View
            </button>
          </div>
        </header>

        <div class={styles.modalImages} id="modalImages">
          <For each={modalMedias()}>
            {(media) => {
              const currentIndex = displayMedias.indexOf(media); //el.curIndex - (STEP - index());
              return (
                <MediaDisplay
                  refSetter={(el) =>
                    el &&
                    useIntersectionObserver(el, handleIntersection(media.media_id, currentIndex), {
                      root: null,
                      rootMargin: "0px",
                      threshold: 0.99999999999999,
                    })
                  }
                  media={media}
                  index={currentIndex}
                  setShowImgOnly={setShowImgOnly}
                />
              );
            }}
          </For>
        </div>

        <div class={styles.modalThumbs} style={{ opacity: showImageOnly() ? 0 : 1 }}>
          <For each={modalMedias()}>
            {(media, index) => {
              const currentIndex = displayMedias.indexOf(media); //el.curIndex - (STEP - index()); //displayMedias.indexOf(media);
              return (
                <div
                  style={media.media_id === el.curId ? { width: "70px", margin: "0 5px" } : {}}
                  data-thumbId={media.media_id}
                  onClick={() => {
                    console.log(currentIndex, media.media_id);
                    handleScrolltoEl(media.media_id);
                    handleSelectItems(currentIndex, media.media_id);
                  }}>
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

const IntersectionOnScroll = (handleSelectItems: (idx: number, id: string) => void): void => {
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
            handleSelectItems(modalIdx, modalId);
          }
        }
      });
    },
    { threshold: 1 }
  );

  elements.forEach((el) => observer.observe(el));
};
