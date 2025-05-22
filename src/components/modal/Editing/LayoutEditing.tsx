import styles from "../ModalView.module.css";
import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { CloseIcon, DoneButtonIcon } from "../../svgIcons";

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
          <button onClick={props.onCancel} class={`${styles.editButton} ${styles.canceled}`}>
            {CloseIcon()}
          </button>
          {props.dropdown}
          <button onClick={props.onDone} class={`${styles.editButton} ${styles.finished}`}>
            {DoneButtonIcon()}
          </button>
        </header>

        {props.children}
      </div>
    </Portal>
  );
};

export default LayoutEditing;
