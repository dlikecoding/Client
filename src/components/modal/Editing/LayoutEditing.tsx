import styles from "../ModalView.module.css";
import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";

import moreStyles from "./Editing.module.css";

type EditMediaProps = {
  onCancel: () => void;
  onDone: () => void;
  children: JSX.Element;
};

const LayoutEditing: Component<EditMediaProps> = (props) => {
  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1, background: "transparent" }}>
        <header>
          <div class="buttonContainer">
            <button onClick={props.onCancel} style={{ padding: "7px 15px" }}>
              Cancel
            </button>
          </div>
          <div class="buttonContainer">
            <button onClick={props.onDone} style={{ padding: "7px 15px" }}>
              Done
            </button>
          </div>
        </header>

        <div class={styles.modalContent}>{props.children}</div>
      </div>
    </Portal>
  );
};

export default LayoutEditing;
