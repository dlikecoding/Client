import { Portal } from "solid-js/web";
import { useViewMediaContext } from "../../context/ViewContext";
import styles from "./Modal.module.css";
import DeviceFilter from "../photoview/buttons/DeviceFilter";
import ActionNav from "../photoview/actionNav/ActionNav";
import { GoBackIcon } from "../svgIcons";
import { For } from "solid-js";

const Modal = (props: any) => {
  const { setOpenModal, displayMedias, setDisplayMedia } = useViewMediaContext();

  // On close or clicked back button, remove the top state on the stack
  window.onpopstate = (event) => {
    if (event.state) setOpenModal(false);
  };

  const testListOfIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
            <p>August 8, 2025</p>
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
                <div class={styles.imageContainer}>
                  <img loading="lazy" src={displayMedias.at(mediaIdx)?.SourceFile} alt={`Modal Image ${index()}`} />
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
