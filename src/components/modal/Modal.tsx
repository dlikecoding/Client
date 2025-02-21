import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createEffect, createMemo, createSignal, For, Index, onMount } from "solid-js";

import { useElementByPoint, useIntersectionObserver } from "solidjs-use";

import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";

import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";

const STEP = 2;

const Modal = (props: any) => {
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

  const [selectedIdx, setSelectedIdx] = createSignal<number>(items().keys().next().value!);

  //Tracking current elemenet on screen based on x and y
  const { element } = useElementByPoint({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    multiple: false,
    immediate: true,
  });

  const displayTime = createMemo(() => {
    const dTime = element()?.dataset.time;
    if (dTime) return formatTime(dTime);
  });

  // Handle scroll to current click element
  const [targetRef, setTargetRef] = createSignal<HTMLDivElement>();

  onMount(() => {
    targetRef()?.scrollIntoView({ behavior: "instant", block: "start" });
  });

  createMemo(() => {
    const currentEl = element()?.dataset.idx;
    console.log("selectedIdx", currentEl);
  });

  const [target, setTarget] = createSignal<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = createSignal(false);

  useIntersectionObserver(target, ([{ isIntersecting }]) => {
    setIsVisible(isIntersecting);
  });

  const addTopEls = () => setSelectedIdx((prev) => (prev > 1 ? prev - 1 : prev));
  const addBottomEls = () => setSelectedIdx((prev) => (prev < displayMedias.length - 1 ? prev + 1 : prev));

  /** When last element is visible on the DOM, remove from the target,
   * and then load more element to dom (only ONCE)*/
  createEffect(() => {
    if (isVisible()) {
      console.log(target());
      addTopEls();
      setTarget(null);
    }
  });

  const medias = () =>
    displayMedias.slice(Math.max(0, selectedIdx() - STEP), Math.min(displayMedias.length, selectedIdx() + 1 + STEP));
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
            <p>{displayTime()?.date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime()?.time}</p>
          </div>
          <div class="buttonContainer">
            {/* <span>Edit</span> */}
            {/* <span>View</span> */}
            <button onClick={addTopEls}>TOP </button>
            <button onClick={addBottomEls}>BOTTOM </button>
          </div>
        </header>

        <div class={styles.modalImages}>
          <For each={medias()}>
            {(media, index) => {
              const curItem = createMemo(() => items().values().next().value!);
              const isCurItem = media.media_id === curItem();
              const isFirst = index() === 1;

              return (
                <MediaDisplay
                  refSetter={isCurItem ? setTargetRef : isFirst ? setTarget : undefined}
                  media={media}
                  index={index()}
                />
              );
            }}
          </For>
        </div>

        <div class={styles.modalThumbs}>
          <Index each={medias()}>
            {(media, index) => (
              <div>
                <img src={media().ThumbPath} />
              </div>
            )}
          </Index>
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
