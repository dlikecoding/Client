import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createEffect, createSignal, For } from "solid-js";

import { useElementByPoint } from "solidjs-use";

import { useViewMediaContext } from "../../context/ViewContext";

import { GoBackIcon } from "../svgIcons";
import DeviceFilter from "../photoview/buttons/DeviceFilter";
import ActionNav from "../photoview/actionNav/ActionNav";

const Modal = (props: any) => {
  const { setOpenModal, displayMedias, setDisplayMedia } = useViewMediaContext();

  // On close or clicked back button, remove the top state on the stack
  window.onpopstate = (event) => {
    if (event.state) setOpenModal(false);
  };

  const testListOfIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  //Tracking current elemenet on screen based on x and y
  const { element } = useElementByPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [currentElement, setCurrentElement] = createSignal<string>();

  createEffect(() => {
    const curEl = element()?.parentElement?.dataset.idx;

    console.log(curEl);
    if (curEl) {
      setCurrentElement(curEl);
    }
  });

  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1 }}>
        <header style={{ "z-index": 1 }}>
          <button
            onClick={() => {
              window.history.back();
              setOpenModal(false);
            }}>
            {GoBackIcon()}
          </button>
          <div class={styles.modalTitle}>
            <p>August 8, 2025 - {currentElement()}</p>
            <p style={{ "font-size": "12px" }}>4:02 PM</p>
          </div>
          <div class="buttonContainer">
            <button>Edit</button>
            <DeviceFilter />
          </div>
        </header>

        <div class={styles.modalImages}>
          <For each={testListOfIndex}>
            {(mediaIdx, index) => {
              return (
                <div class={styles.imageContainer} data-idx={index()}>
                  <img loading="lazy" src={displayMedias[mediaIdx].SourceFile} alt={`Modal Image ${index()}`} />
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
