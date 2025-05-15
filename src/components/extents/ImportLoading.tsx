import { Component, Show } from "solid-js";
import { CloseIcon } from "../svgIcons";
import styles from "./ImportLoading.module.css";
import { SetStoreFunction } from "solid-js/store";
import { ProcessMesg } from "../../pages/admin/Dashboard";
import Spinner from "./Spinner";

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
            <Spinner />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default ImportLoading;
