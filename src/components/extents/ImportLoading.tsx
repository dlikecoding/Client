import { Component, Show } from "solid-js";
import { CloseIcon } from "../svgIcons";
import styles from "./ImportLoading.module.css";
import { SetStoreFunction } from "solid-js/store";
import { ProcessMesg } from "../../pages/admin/Dashboard";

interface StreamMesgProps {
  streamMesg: ProcessMesg;
  setStreamMesg: SetStoreFunction<ProcessMesg>;
}

const ImportLoading: Component<StreamMesgProps> = (props) => {
  const streamMesg = () => props.streamMesg;

  return (
    <div class={styles.processPopup}>
      <div class={styles.processMessage}>
        <div style={{ "max-width": "350px" }}>{streamMesg().mesg}</div>

        <div>
          <Show
            when={props.streamMesg.isRunning}
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
