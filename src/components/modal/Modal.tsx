import styles from "./Modal.module.css";

import { Portal } from "solid-js/web";
import { createEffect, createMemo, createSignal, For } from "solid-js";

import { useElementByPoint, useVirtualList } from "solidjs-use";

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

  //Tracking current elemenet on screen based on x and y
  const { element } = useElementByPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const currentElement = createMemo(() => {
    const curEl = element()?.parentElement?.dataset.id;
    if (curEl) return curEl;
  });

  ////////////// Virtual list //////////////////////////////////////////
  const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(displayMedias, {
    itemHeight: () => window.innerHeight,
    overscan: 1, // Only display 3 elements
  });

  ////////////// END Virtual list //////////////////////////////////////////

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
            <span>Edit</span>
            <span>View</span>
          </div>
        </header>

        <div class={styles.modalImages} ref={containerProps.ref} onScroll={containerProps.onScroll}>
          <div style={wrapperProps().style}>
            <For each={list()}>
              {({ data }, index) => {
                return (
                  <div class={styles.imageContainer} data-id={data.media_id}>
                    <img loading="lazy" src={data.SourceFile} alt={`Modal Image ${index()}`} />
                  </div>
                );
              }}
            </For>
          </div>
        </div>
        <ActionNav />
      </div>
    </Portal>
  );
};

export default Modal;
