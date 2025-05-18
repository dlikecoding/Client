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
        <header
          style={{
            background: "var(--popup-bground)",
            "backdrop-filter": "blur(20px) brightness(1)",
            "-webkit-backdrop-filter": "blur(20px) brightness(1)",
            padding: "15px 20px",
            "align-items": "center",
          }}>
          <button
            onClick={props.onCancel}
            style={{
              padding: "7px 15px",
              color: "var(--button-active-color)",
            }}>
            Cancel
          </button>
          {props.dropdown}
          <button
            onClick={props.onDone}
            style={{
              padding: "7px 15px",
              color: "var(--button-active-color)",
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
