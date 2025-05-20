import styles from "../ModalView.module.css";
import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";

type EditMediaProps = {
  onCancel: () => void;
  onDone: () => void;
  children: JSX.Element;
  dropdown?: JSX.Element;
};

const LayoutEditing: Component<EditMediaProps> = (props) => {
  return (
    <Portal>
      <div class={styles.modalContainer} style={{ "z-index": 1, background: "transparent" }}>
        <header>
          <button
            onClick={props.onCancel}
            style={{
              padding: "7px 15px",
              color: "var(--button-active-color)",
              "text-shadow": "0 0 1px 1px black",
            }}>
            Cancel
          </button>
          {props.dropdown}
          <button
            onClick={props.onDone}
            style={{
              padding: "7px 15px",
              color: "var(--button-active-color)",
              "text-shadow": "0 0 1px 1px black",
            }}>
            Done
          </button>
        </header>

        {props.children}
      </div>
    </Portal>
  );
};

export default LayoutEditing;
