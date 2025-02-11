import { CloseIcon } from "../../components/svg-icons";
import styles from "./Setting.module.css";

const Setting = () => {
  return (
    <>
      <h1>Setting</h1>
      <div> Display storage ===================</div>
      <div> Reindex ===================</div>
      <div>Link</div>
      <div>Link</div>
      <div>Link</div>
      <div>Link</div>
      <button
        class={styles.closeButton}
        on:click={() => {
          const popover = document.getElementById("setting-contents");
          if (popover) popover.hidePopover();
        }}>
        {CloseIcon()}
      </button>
    </>
  );
};

export default Setting;
