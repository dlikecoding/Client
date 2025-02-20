import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createMemo, createSignal, For, onMount } from "solid-js";

import { useElementByPoint } from "solidjs-use";

import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";

import ActionNav from "../photoview/actionNav/ActionNav";
import { useMediaContext } from "../../context/Medias";
import MediaDisplay from "./MediaDisplay";

const NUMBER_OF_MEDIAS_MODAL = 5;

const Modal = (props: any) => {
  const { setOpenModal, displayMedias } = useViewMediaContext();
  const { items, setItems } = useMediaContext();

  const handleCloseModal = () => {
    setItems(new Map());
    setOpenModal(false);
  };

  // On close or clicked back button, remove the top state on the stack
  window.onpopstate = (event) => {
    if (event.state) handleCloseModal();
  };

  // Get a slide of element so can minimal display
  // const [modalEls, setModalEls] = createSignal<MediaType[]>(
  //   getSubElements(displayMedias, items().keys().next().value!)
  // );

  const modalEls = () => {
    const keysArray = Array.from(items().keys());
    return getSubElements(displayMedias, keysArray[0]!);
  };

  //Tracking current elemenet on screen based on x and y
  const { element } = useElementByPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const displayTime = createMemo(() => {
    const dTime = element()?.dataset.time;
    // console.log(element());
    if (dTime) return formatTime(dTime);
  });

  // Handle scroll to current click element
  const [targetRef, setTargetRef] = createSignal<HTMLDivElement>();
  onMount(() => {
    if (targetRef()) targetRef()!.scrollIntoView({ behavior: "instant", block: "start" });
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
            <p>{displayTime()?.date}</p>
            <p style={{ "font-size": "12px" }}>{displayTime()?.time}</p>
          </div>
          <div class="buttonContainer">
            {/* <span>Edit</span> */}
            <span>View</span>
          </div>
        </header>

        <div class={styles.modalImages}>
          <For each={modalEls()}>
            {(media, index) => {
              return media.media_id === items().values().next().value! ? (
                <MediaDisplay curTarget={setTargetRef} media={media} index={index()} />
              ) : (
                <MediaDisplay media={media} index={index()} />
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

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(date);

  return { date: formattedDate, time: formattedTime };
};

const getSubElements = (arr: MediaType[], midIdx: number): MediaType[] => {
  const startIdx = Math.max(0, midIdx - NUMBER_OF_MEDIAS_MODAL);
  const endIdx = Math.min(arr.length, midIdx + NUMBER_OF_MEDIAS_MODAL + 1);
  return arr.slice(startIdx, endIdx);
};
