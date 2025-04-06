import { Show } from "solid-js";
import { CloseIcon } from "../svgIcons";
import styles from "./ImportLoading.module.css";

const ImportLoading = (props: any) => {
  return (
    <div class={styles.processPopup}>
      <div class={styles.processMessage}>
        <div style={{ "max-width": "350px" }}>{props.streamMesg.mesg}</div>

        <div>
          <Show
            when={!props.streamMesg.status}
            fallback={
              <button onClick={() => props.setStreamMesg("mesg", "")}>
                <CloseIcon />
              </button>
            }>
            <div class={styles.f_spinner}>
              <svg viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20"></circle>
                <circle cx="25" cy="25" r="20"></circle>
              </svg>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default ImportLoading;
